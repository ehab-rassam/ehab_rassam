/**
 * Local/production contact relay: validates input, rate-limits, sends Telegram.
 * Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (never use VITE_ prefix).
 *
 * Run: node server/telegram-proxy.mjs
 * Default listen: PORT or 5175, path POST /contact
 *
 * Logging: set NODE_ENV=production or CONTACT_API_QUIET=1 for minimal logs.
 * Verbose relay logs: CONTACT_API_DEBUG=1
 */
import http from "node:http";
import { URL } from "node:url";
import "dotenv/config";

const PORT = Number(process.env.CONTACT_API_PORT || process.env.PORT || 5175);
const PATH = "/contact";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Minimal stdout in production unless CONTACT_API_DEBUG=1 */
const RELAY_DEBUG =
  process.env.CONTACT_API_DEBUG === "1" ||
  (process.env.NODE_ENV !== "production" &&
    process.env.CONTACT_API_DEBUG !== "0" &&
    process.env.CONTACT_API_QUIET !== "1");

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const rateBuckets = new Map();

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 200,
  message: 4000,
};

const TELEGRAM_SEND_MESSAGE_PATH = "/sendMessage";

function log(...args) {
  // eslint-disable-next-line no-console
  console.log("[contact-api]", ...args);
}

function debug(...args) {
  if (RELAY_DEBUG) log(...args);
}

function logError(...args) {
  // eslint-disable-next-line no-console
  console.error("[contact-api]", ...args);
}

function maskBotToken(token) {
  if (!token || typeof token !== "string") {
    return { loaded: false, length: 0, preview: "(missing)" };
  }
  const t = token.trim();
  if (!t) return { loaded: false, length: 0, preview: "(empty)" };
  const colon = t.indexOf(":");
  if (colon > 0) {
    const botId = t.slice(0, colon);
    const secret = t.slice(colon + 1);
    const idPart =
      botId.length <= 4
        ? `${botId.slice(0, 1)}***`
        : `${botId.slice(0, 3)}…${botId.slice(-2)}`;
    const secPart =
      secret.length <= 6
        ? "***"
        : `${secret.slice(0, 2)}…${secret.slice(-4)}`;
    return { loaded: true, length: t.length, preview: `${idPart}:${secPart}` };
  }
  return {
    loaded: true,
    length: t.length,
    preview: `${t.slice(0, 2)}…${t.slice(-4)}`,
  };
}

function maskChatId(chatId) {
  if (chatId == null || String(chatId).trim() === "") {
    return { loaded: false, length: 0, preview: "(missing)" };
  }
  const s = String(chatId).trim();
  if (!s) return { loaded: false, length: 0, preview: "(empty)" };
  if (s.length <= 6) return { loaded: true, length: s.length, preview: "***" };
  return {
    loaded: true,
    length: s.length,
    preview: `${s.slice(0, 3)}…${s.slice(-4)}`,
  };
}

function logTelegramEnvStatus(context) {
  const tokenMeta = maskBotToken(TELEGRAM_BOT_TOKEN);
  const chatMeta = maskChatId(TELEGRAM_CHAT_ID);
  if (RELAY_DEBUG) {
    log(`Telegram env (${context}):`, {
      TELEGRAM_BOT_TOKEN: {
        loaded: tokenMeta.loaded,
        length: tokenMeta.length,
        maskedPreview: tokenMeta.preview,
      },
      TELEGRAM_CHAT_ID: {
        loaded: chatMeta.loaded,
        length: chatMeta.length,
        maskedPreview: chatMeta.preview,
      },
      endpointUrl: `https://api.telegram.org/bot<REDACTED>${TELEGRAM_SEND_MESSAGE_PATH}`,
    });
    return;
  }
  log(
    `Telegram env (${context}) token=${tokenMeta.loaded ? "ok" : "missing"} ` +
      `chat=${chatMeta.loaded ? "ok" : "missing"} ` +
      `maskedToken=${tokenMeta.preview} maskedChat=${chatMeta.preview}`
  );
}

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  if (!ALLOWED_ORIGINS.length) {
    return process.env.NODE_ENV !== "production";
  }
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return headers;
}

function rateLimit(ip) {
  const now = Date.now();
  let b = rateBuckets.get(ip);
  if (!b || now - b.windowStart > RATE_WINDOW_MS) {
    b = { windowStart: now, count: 0 };
    rateBuckets.set(ip, b);
  }
  b.count += 1;
  if (b.count > RATE_MAX) return false;
  return true;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function trimLen(v, max) {
  if (typeof v !== "string") return "";
  const t = v.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function isValidEmail(email) {
  if (email.length > LIMITS.email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateBody(body) {
  const errors = {};
  const name = trimLen(body.name, LIMITS.name);
  const email = trimLen(body.email, LIMITS.email).toLowerCase();
  const phone = trimLen(body.phone, LIMITS.phone);
  const subject = trimLen(body.subject, LIMITS.subject);
  const message = trimLen(body.message, LIMITS.message);
  const honeypot = body._hp;

  if (honeypot != null && String(honeypot).trim() !== "") {
    return { ok: false, honeypot: true };
  }
  if (!name || name.length < 2) errors.name = "short";
  if (!email || !isValidEmail(email)) errors.email = "invalid";
  if (!subject || subject.length < 2) errors.subject = "short";
  if (!message || message.length < 10) errors.message = "short";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { name, email, phone, subject, message },
  };
}

async function readJsonBody(req, maxBytes = 32_768) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function sendTelegram(data) {
  const tokenMeta = maskBotToken(TELEGRAM_BOT_TOKEN);
  const chatMeta = maskChatId(TELEGRAM_CHAT_ID);
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}${TELEGRAM_SEND_MESSAGE_PATH}`;

  debug("Telegram sendMessage request:", {
    method: "POST",
    url: `https://api.telegram.org/bot<REDACTED>${TELEGRAM_SEND_MESSAGE_PATH}`,
    tokenStatus: {
      loaded: tokenMeta.loaded,
      length: tokenMeta.length,
      masked: tokenMeta.preview,
    },
    chatIdStatus: {
      loaded: chatMeta.loaded,
      length: chatMeta.length,
      masked: chatMeta.preview,
    },
  });

  const text = [
    "<b>Portfolio contact</b>",
    "",
    `<b>Name:</b> ${escapeHtml(data.name)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
    data.phone ? `<b>Phone:</b> ${escapeHtml(data.phone)}` : "",
    `<b>Subject:</b> ${escapeHtml(data.subject)}`,
    "",
    `<b>Message:</b>`,
    escapeHtml(data.message),
  ]
    .filter(Boolean)
    .join("\n");

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  debug("Telegram sendMessage JSON body (sanitized):", {
    chat_id_masked: maskChatId(TELEGRAM_CHAT_ID).preview,
    chat_id_length: String(TELEGRAM_CHAT_ID).length,
    chat_id_type: typeof TELEGRAM_CHAT_ID,
    text_length_chars: text.length,
    parse_mode: payload.parse_mode,
    disable_web_page_preview: payload.disable_web_page_preview,
  });

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const rawBody = await res.text();
  debug("Telegram HTTP response:", {
    status: res.status,
    statusText: res.statusText,
    response_body_raw: rawBody,
  });

  let json;
  try {
    json = JSON.parse(rawBody);
  } catch (parseErr) {
    logError("Telegram response JSON parse failed:", parseErr?.message || parseErr);
    logError("Telegram raw body:", rawBody);
    throw new Error(
      `telegram_non_json: http=${res.status} body=${rawBody.slice(0, 300)}`
    );
  }

  debug("Telegram API parsed JSON:", json);

  if (!res.ok || !json.ok) {
    const desc = json.description ?? res.statusText;
    const code = json.error_code ?? "n/a";
    logError("Telegram sendMessage FAILED:", {
      http_status: res.status,
      error_code: code,
      description: desc,
      parameters: json.parameters ?? null,
      response_body_raw: rawBody,
      parsed: json,
    });
    throw new Error(
      `telegram_api_error http=${res.status} error_code=${code} description=${desc}`
    );
  }

  if (RELAY_DEBUG) {
    log("Telegram sendMessage OK:", {
      message_id: json.result?.message_id,
      result_chat_id_masked:
        json.result?.chat?.id != null
          ? maskChatId(String(json.result.chat.id)).preview
          : undefined,
    });
  } else {
    log(`telegram: send OK message_id=${json.result?.message_id ?? "?"}`);
  }
}

function sendJson(res, status, obj, extraHeaders = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...extraHeaders,
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const origin = req.headers.origin;

  if (req.method === "OPTIONS" && url.pathname === PATH) {
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }

  if (req.method !== "POST" || url.pathname !== PATH) {
    res.writeHead(404);
    res.end();
    return;
  }

  debug("POST /contact", { origin: origin || "(none)" });

  const c = corsHeaders(origin);
  if (origin && !isOriginAllowed(origin)) {
    logError("Rejected: origin not allowed", { origin });
    sendJson(res, 403, { ok: false, code: "origin_denied" }, c);
    return;
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    logTelegramEnvStatus("reject: server_misconfigured");
    sendJson(res, 500, { ok: false, code: "server_misconfigured" }, c);
    return;
  }

  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    logError("Rate limited", { ip });
    sendJson(res, 429, { ok: false, code: "rate_limited" }, c);
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (readErr) {
    logError("Invalid JSON body:", readErr?.message || readErr);
    sendJson(res, 400, { ok: false, code: "bad_json" }, c);
    return;
  }

  const v = validateBody(body);
  if (v.honeypot) {
    debug("Honeypot triggered; returning 200 without Telegram send.");
    sendJson(res, 200, { ok: true }, c);
    return;
  }
  if (!v.ok) {
    debug("Validation failed:", v.errors);
    sendJson(res, 400, { ok: false, code: "validation", fields: v.errors }, c);
    return;
  }

  try {
    await sendTelegram(v.data);
  } catch (err) {
    logError("sendTelegram threw:", err?.message || err);
    if (err?.stack) logError(err.stack);
    sendJson(res, 502, { ok: false, code: "upstream" }, c);
    return;
  }

  sendJson(res, 200, { ok: true }, c);
});

server.listen(PORT, () => {
  log(`Listening http://127.0.0.1:${PORT}${PATH}`);
  logTelegramEnvStatus("startup");
});
