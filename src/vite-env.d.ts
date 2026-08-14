/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTES_PASSWORD_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
