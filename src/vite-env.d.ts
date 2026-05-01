/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID?: string;
  /** URL de l’API Express en production (ex. https://api.example.com), sans slash final */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
