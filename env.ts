import { IS_DEV_MODE } from "@consts";
import { z } from "zod";

const devEnvSchema = z.object({
  GITHUB_BRANCH: z.string().default("cms/push"),
  GITHUB_REPO: z.string().default("cajuina-site"),
  GITHUB_OWNER: z.string().default("psousajcajuina"),
  GITHUB_PERSONAL_ACCESS_TOKEN: z
    .string()
    .default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
  NEXTAUTH_SECRET: z.string().default("nfuiwabfuwqonbfwqjbno"),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string(),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string(),
  AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: z.string(),
  SITE_URL: z.string().default("https://cajuinasaogeraldo.com.br"),
  SITE_TITLE: z.string().default("São Geraldo"),
  SITE_DESCRIPTION: z.string(
    "Somos uma marca caririense que oferece à sociedade refrigerantes com alto padrão de qualidade. Esse é nosso principal objetivo e o que nos faz ser uma das maiores indústrias de bebidas do Ceará"
  ),
  DEBUG: z.coerce.boolean().optional().default(true),
  TINA_PUBLIC_IS_LOCAL: z.coerce.boolean().default(true),
});

const prodEnvSchema = z.object({
  GITHUB_BRANCH: z.string({
    error: "GITHUB_BRANCH env var is required in production",
  }),
  GITHUB_REPO: z.string({ error: "GITHUB_REPO env var is required in production" }),
  GITHUB_OWNER: z.string({ error: "GITHUB_OWNER env var is required in production" }),
  GITHUB_PERSONAL_ACCESS_TOKEN: z.string({ error: "GITHUB_PERSONAL_ACCESS_TOKEN env var is required in production" }),
  NEXTAUTH_SECRET: z.string({ error: "NEXT_AUTH env var is required in production" }),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string({ error: "AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID env var is required in production" }),
  AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string({ error: "AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET env var is required in production" }),
  AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: z.string({ error: "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID env var is required in production" }),
  SITE_URL: z.string({ error: "SITE_URL env var is required in production" }),
  SITE_TITLE: z.string({ error: "SITE_TITLE env var is required in production" }),
  SITE_DESCRIPTION: z.string({ error: "SITE_DESCRIPTION env var is required in production" }),
  DEBUG: z.coerce.boolean().default(false),
  TINA_PUBLIC_IS_LOCAL: z.coerce.boolean().default(false),
});

const env = IS_DEV_MODE
  ? devEnvSchema.parse(process.env)
  : prodEnvSchema.parse(process.env);

export { env, devEnvSchema, prodEnvSchema };
