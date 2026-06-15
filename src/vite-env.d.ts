/// <reference types="vite/client" />

/**
 * Only `VITE_*` keys are exposed to the browser. Do not store secrets here.
 */
interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
