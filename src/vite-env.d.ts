/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
