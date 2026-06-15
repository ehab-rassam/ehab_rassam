/**
 * Public contact endpoint URL (no secrets). Vite injects at build time.
 * Only `VITE_*` variables are exposed to the client — never put tokens here.
 * Dev default is same-origin `/api/contact` (proxied to the local relay).
 * Respects `import.meta.env.BASE_URL` so subpath deploys (e.g. GitHub Pages) resolve correctly.
 */
export function getContactApiUrl() {
  const fromEnv = import.meta.env.VITE_CONTACT_API_URL;
  const path =
    typeof fromEnv === "string" && fromEnv.trim() ? fromEnv.trim() : "/api/contact";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const baseNorm = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  return `${baseNorm}${pathNorm}`;
}
