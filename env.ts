import { z } from "zod";

const IS_DEV_MODE = process.env.NODE_ENV !== "production";

const devEnvSchema = z.object({
  GITHUB_BRANCH: z.string().default("cms/push"),
  GITHUB_REPO: z.string().default("cajuina-site"),
  GITHUB_OWNER: z.string().default("psousajcajuina"),
  GITHUB_PERSONAL_ACCESS_TOKEN: z
    .string()
    .default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
  NEXTAUTH_SECRET: z.string().default("nfuiwabfuwqonbfwqjbno"),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string().default("fmwquionfcouewin"),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string().default("dmwqoijnfjqwkn"),
  AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: z.string().default("mkfaqnfcjkanjl"),
  SITE_URL: z.string().default("https://cajuinasaogeraldo.com.br"),
  SITE_TITLE: z.string().default("São Geraldo"),
  SITE_DESCRIPTION: z.string().default(
    "Somos uma marca caririense que oferece à sociedade refrigerantes com alto padrão de qualidade. Esse é nosso principal objetivo e o que nos faz ser uma das maiores indústrias de bebidas do Ceará"
  ),
  DEBUG: z.coerce.boolean().optional().default(true),
  TINA_PUBLIC_IS_LOCAL: z.coerce.boolean().default(true),
});

const prodEnvSchema = z.object({
  GITHUB_BRANCH: z.string({
    message: "GITHUB_BRANCH env var is required in production",
  }),
  GITHUB_REPO: z.string({ 
    message: "GITHUB_REPO env var is required in production" 
  }),
  GITHUB_OWNER: z.string({ 
    message: "GITHUB_OWNER env var is required in production" 
  }),
  GITHUB_PERSONAL_ACCESS_TOKEN: z.string({ 
    message: "GITHUB_PERSONAL_ACCESS_TOKEN env var is required in production" 
  }),
  NEXTAUTH_SECRET: z.string({ 
    message: "NEXT_AUTH env var is required in production" 
  }),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string({ 
    message: "AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID env var is required in production" 
  }),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string({ 
    message: "AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET env var is required in production" 
  }),
  AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: z.string({ 
    message: "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID env var is required in production" 
  }),
  SITE_URL: z.string({ 
    message: "SITE_URL env var is required in production" 
  }),
  SITE_TITLE: z.string({ 
    message: "SITE_TITLE env var is required in production" 
  }),
  SITE_DESCRIPTION: z.string({ 
    message: "SITE_DESCRIPTION env var is required in production" 
  }),
  DEBUG: z.coerce.boolean().default(false),
  TINA_PUBLIC_IS_LOCAL: z.coerce.boolean().default(false),
});

const env = IS_DEV_MODE
  ? devEnvSchema.parse(process.env)
  : prodEnvSchema.parse(process.env);

export { env, devEnvSchema, prodEnvSchema };
