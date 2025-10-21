import { z } from "zod";

const IS_DEV_MODE = process.env.NODE_ENV !== "production";

const devEnvSchema = z.object({
  BACKEND_GITHUB_BRANCH: z.string().default("cms/push"),
  BACKEND_GITHUB_REPO: z.string().default("cajuina-site"),
  BACKEND_GITHUB_OWNER: z.string().default("psousajcajuina"),
  BACKEND_GITHUB_TOKEN: z
    .string()
    .default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
  BACKEND_NEXTAUTH_SECRET: z.string().default("nfuiwabfuwqonbfwqjbno"),
  BACKEND_AUTH_MS_CLIENT_ID: z.string().default("fmwquionfcouewin"),
  BACKEND_AUTH_MS_CLIENT_SECRET: z.string().default("dmwqoijnfjqwkn"),
  BACKEND_AUTH_MS_TENANT_ID: z.string().default("mkfaqnfcjkanjl"),
  BACKEND_UPSTASH_REDIS_URL: z.string().default("http://localhost:8079"),
  BACKEND_UPSTASH_REDIS_TOKEN: z.string().default("example_token"),
  BACKEND_PORT: z.coerce.number().default(4001),
  BACKEND_CORS_ORIGINS: z.string().optional().default("http://localhost:4321"),
  BACKEND_DEBUG: z.coerce.boolean().optional().default(true),
  
  // ============================================
  // FRONTEND - Site Info
  // ============================================
  FRONTEND_SITE_URL: z.string().default("https://cajuinasaogeraldo.com.br"),
  FRONTEND_SITE_TITLE: z.string().default("São Geraldo"),
  FRONTEND_SITE_DESCRIPTION: z.string().default(
    "Somos uma marca caririense que oferece à sociedade refrigerantes com alto padrão de qualidade. Esse é nosso principal objetivo e o que nos faz ser uma das maiores indústrias de bebidas do Ceará"
  ),
  FRONTEND_TINA_GRAPHQL_URL: z.string().default("http://localhost:4001/graphql"),
  FRONTEND_TINA_API_URL: z.string().default("http://localhost:4001"),
  FRONTEND_TINA_IS_LOCAL: z.coerce.boolean().default(true),
});

const prodEnvSchema = z.object({
  BACKEND_GITHUB_BRANCH: z.string({
    message: "BACKEND_GITHUB_BRANCH env var is required in production",
  }),
  BACKEND_GITHUB_REPO: z.string({ 
    message: "BACKEND_GITHUB_REPO env var is required in production" 
  }),
  BACKEND_GITHUB_OWNER: z.string({ 
    message: "BACKEND_GITHUB_OWNER env var is required in production" 
  }),
  BACKEND_GITHUB_TOKEN: z.string({ 
    message: "BACKEND_GITHUB_TOKEN env var is required in production" 
  }),
  BACKEND_NEXTAUTH_SECRET: z.string({ 
    message: "BACKEND_NEXTAUTH_SECRET env var is required in production" 
  }),
  BACKEND_AUTH_MS_CLIENT_ID: z.string({ 
    message: "BACKEND_AUTH_MS_CLIENT_ID env var is required in production" 
  }),
  BACKEND_AUTH_MS_CLIENT_SECRET: z.string({ 
    message: "BACKEND_AUTH_MS_CLIENT_SECRET env var is required in production" 
  }),
  BACKEND_AUTH_MS_TENANT_ID: z.string({ 
    message: "BACKEND_AUTH_MS_TENANT_ID env var is required in production" 
  }),
  BACKEND_UPSTASH_REDIS_URL: z.string({ 
    message: "BACKEND_UPSTASH_REDIS_URL env var is required in production" 
  }),
  BACKEND_UPSTASH_REDIS_TOKEN: z.string({ 
    message: "BACKEND_UPSTASH_REDIS_TOKEN env var is required in production" 
  }),
  BACKEND_PORT: z.coerce.number().default(4001),
  BACKEND_CORS_ORIGINS: z.string().optional(),
  BACKEND_DEBUG: z.coerce.boolean().default(false),
  
  // ============================================
  // FRONTEND - Site Info
  // ============================================
  FRONTEND_SITE_URL: z.string({ 
    message: "FRONTEND_SITE_URL env var is required in production" 
  }),
  FRONTEND_SITE_TITLE: z.string({ 
    message: "FRONTEND_SITE_TITLE env var is required in production" 
  }),
  FRONTEND_SITE_DESCRIPTION: z.string({ 
    message: "FRONTEND_SITE_DESCRIPTION env var is required in production" 
  }),
  FRONTEND_TINA_GRAPHQL_URL: z.string({ 
    message: "FRONTEND_TINA_GRAPHQL_URL env var is required in production" 
  }),
  FRONTEND_TINA_API_URL: z.string({ 
    message: "FRONTEND_TINA_API_URL env var is required in production" 
  }),
  FRONTEND_TINA_IS_LOCAL: z.coerce.boolean().default(false),
});

const env = IS_DEV_MODE
  ? devEnvSchema.parse(process.env)
  : prodEnvSchema.parse(process.env);

export { env, devEnvSchema, prodEnvSchema };
