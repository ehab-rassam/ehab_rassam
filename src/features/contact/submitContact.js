import { getContactApiUrl } from "./contactApi.js";

/**
 * POST JSON to the relay. Throws on network errors; returns parsed body on HTTP responses.
 */
export async function submitContact(payload) {
  const url = getContactApiUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "omit",
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  return { ok: res.ok, status: res.status, body };
}
