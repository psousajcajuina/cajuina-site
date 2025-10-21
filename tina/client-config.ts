/**
 * Configuração do cliente TinaCMS
 * Permite usar URLs diferentes para desenvolvimento e produção
 */

const IS_BROWSER = typeof window !== "undefined";
const IS_DEV = process.env.NODE_ENV !== "production";

// URLs da API do TinaCMS
export const TINA_GRAPHQL_URL = IS_BROWSER
  ? // No browser, usar variáveis públicas do Astro
    import.meta.env.PUBLIC_TINA_GRAPHQL_URL || 
    (IS_DEV ? "http://localhost:4001/graphql" : "")
  : // No servidor (build time), usar variáveis de ambiente Node
    process.env.FRONTEND_TINA_GRAPHQL_URL || "http://localhost:4001/graphql";

export const TINA_API_URL = IS_BROWSER
  ? import.meta.env.PUBLIC_TINA_API_URL || 
    (IS_DEV ? "http://localhost:4001" : "")
  : process.env.FRONTEND_TINA_API_URL || "http://localhost:4001";

export const TINA_CLIENT_ID = IS_BROWSER
  ? import.meta.env.PUBLIC_TINA_CLIENT_ID
  : process.env.FRONTEND_TINA_CLIENT_ID;

export const TINA_TOKEN = IS_BROWSER
  ? import.meta.env.PUBLIC_TINA_TOKEN
  : process.env.FRONTEND_TINA_TOKEN;

// Branch ativo (para preview de diferentes branches)
export const TINA_BRANCH = IS_BROWSER
  ? import.meta.env.PUBLIC_TINA_BRANCH || "main"
  : process.env.BACKEND_GITHUB_BRANCH || "main";
