/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TINA_GRAPHQL_URL?: string;
  readonly PUBLIC_TINA_API_URL?: string;
  readonly PUBLIC_TINA_CLIENT_ID?: string;
  readonly PUBLIC_TINA_TOKEN?: string;
  readonly PUBLIC_TINA_BRANCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
