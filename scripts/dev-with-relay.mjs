/**
 * Starts the Telegram contact relay, waits until TCP accepts, then starts Vite.
 * Forwards extra args to Vite, e.g. `npm run dev -- --host`.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const relayPort = Number(
  process.env.CONTACT_API_PORT || process.env.PORT || 5175
);
const relayHost = "127.0.0.1";

function waitForPort(port, { host = relayHost, timeoutMs = 25_000 } = {}) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      if (Date.now() - started > timeoutMs) {
        reject(
          new Error(
            `Timed out waiting for contact relay on ${host}:${port}. Check server/telegram-proxy.mjs logs.`
          )
        );
        return;
      }
      const socket = net.connect({ port, host }, () => {
        socket.end();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        setTimeout(attempt, 120);
      });
    };
    attempt();
  });
}

const relayScript = path.join(root, "server", "telegram-proxy.mjs");
const relay = spawn(process.execPath, [relayScript], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

let vite = null;

function shutdown() {
  try {
    vite?.kill("SIGTERM");
  } catch {
    /* ignore */
  }
  try {
    relay.kill("SIGTERM");
  } catch {
    /* ignore */
  }
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

try {
  await new Promise((resolve, reject) => {
    const onRelayExit = (code) => {
      reject(
        new Error(
          `Contact relay exited with code ${code} before ${relayHost}:${relayPort} was ready. Check server/telegram-proxy.mjs.`
        )
      );
    };
    relay.once("exit", onRelayExit);
    waitForPort(relayPort).then(
      () => {
        relay.off("exit", onRelayExit);
        resolve();
      },
      (err) => {
        relay.off("exit", onRelayExit);
        reject(err);
      }
    );
  });
} catch (e) {
  console.error(e?.message || e);
  shutdown();
  process.exit(1);
}

const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
if (!fs.existsSync(viteBin)) {
  console.error(`Vite CLI not found at ${viteBin}. Run npm install.`);
  shutdown();
  process.exit(1);
}

const viteArgs = [viteBin, ...process.argv.slice(2)];

vite = spawn(process.execPath, viteArgs, {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

relay.on("exit", () => {
  if (vite && !vite.killed) {
    try {
      vite.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
});

vite.on("exit", (code) => {
  try {
    relay.kill("SIGTERM");
  } catch {
    /* ignore */
  }
  process.exit(code ?? 0);
});
