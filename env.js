"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodEnvSchema = exports.devEnvSchema = exports.env = void 0;
var zod_1 = require("zod");
var IS_DEV_MODE = process.env.NODE_ENV !== "production";
var devEnvSchema = zod_1.z.object({
    // ============================================
    // BACKEND - GitHub (Git Provider)
    // ============================================
    BACKEND_GITHUB_BRANCH: zod_1.z.string().default("cms/push"),
    BACKEND_GITHUB_REPO: zod_1.z.string().default("cajuina-site"),
    BACKEND_GITHUB_OWNER: zod_1.z.string().default("psousajcajuina"),
    BACKEND_GITHUB_TOKEN: zod_1.z
        .string()
        .default("fnciasocbiuwqbvjdsbviusebvnjdsvbdhj"),
    // ============================================
    // BACKEND - Auth (NextAuth + Microsoft Entra ID)
    // ============================================
    BACKEND_NEXTAUTH_SECRET: zod_1.z.string().default("nfuiwabfuwqonbfwqjbno"),
    BACKEND_AUTH_MS_CLIENT_ID: zod_1.z.string().default("fmwquionfcouewin"),
    BACKEND_AUTH_MS_CLIENT_SECRET: zod_1.z.string().default("dmwqoijnfjqwkn"),
    BACKEND_AUTH_MS_TENANT_ID: zod_1.z.string().default("mkfaqnfcjkanjl"),
    // ============================================
    // BACKEND - Database (Upstash Redis)
    // ============================================
    BACKEND_UPSTASH_REDIS_URL: zod_1.z.string().default("http://localhost:8079"),
    BACKEND_UPSTASH_REDIS_TOKEN: zod_1.z.string().default("example_token"),
    // ============================================
    // BACKEND - Server Config
    // ============================================
    BACKEND_PORT: zod_1.z.coerce.number().default(4001),
    BACKEND_CORS_ORIGINS: zod_1.z.string().optional().default("http://localhost:4321"),
    BACKEND_DEBUG: zod_1.z.coerce.boolean().optional().default(true),
    // ============================================
    // FRONTEND - Site Info
    // ============================================
    FRONTEND_SITE_URL: zod_1.z.string().default("https://cajuinasaogeraldo.com.br"),
    FRONTEND_SITE_TITLE: zod_1.z.string().default("São Geraldo"),
    FRONTEND_SITE_DESCRIPTION: zod_1.z.string().default("Somos uma marca caririense que oferece à sociedade refrigerantes com alto padrão de qualidade. Esse é nosso principal objetivo e o que nos faz ser uma das maiores indústrias de bebidas do Ceará"),
    // ============================================
    // FRONTEND - TinaCMS Client (públicas)
    // ============================================
    FRONTEND_TINA_GRAPHQL_URL: zod_1.z.string().default("http://localhost:4001/graphql"),
    FRONTEND_TINA_API_URL: zod_1.z.string().default("http://localhost:4001"),
    FRONTEND_TINA_IS_LOCAL: zod_1.z.coerce.boolean().default(true),
});
exports.devEnvSchema = devEnvSchema;
var prodEnvSchema = zod_1.z.object({
    // ============================================
    // BACKEND - GitHub (Git Provider)
    // ============================================
    BACKEND_GITHUB_BRANCH: zod_1.z.string({
        message: "BACKEND_GITHUB_BRANCH env var is required in production",
    }),
    BACKEND_GITHUB_REPO: zod_1.z.string({
        message: "BACKEND_GITHUB_REPO env var is required in production"
    }),
    BACKEND_GITHUB_OWNER: zod_1.z.string({
        message: "BACKEND_GITHUB_OWNER env var is required in production"
    }),
    BACKEND_GITHUB_TOKEN: zod_1.z.string({
        message: "BACKEND_GITHUB_TOKEN env var is required in production"
    }),
    // ============================================
    // BACKEND - Auth (NextAuth + Microsoft Entra ID)
    // ============================================
    BACKEND_NEXTAUTH_SECRET: zod_1.z.string({
        message: "BACKEND_NEXTAUTH_SECRET env var is required in production"
    }),
    BACKEND_AUTH_MS_CLIENT_ID: zod_1.z.string({
        message: "BACKEND_AUTH_MS_CLIENT_ID env var is required in production"
    }),
    BACKEND_AUTH_MS_CLIENT_SECRET: zod_1.z.string({
        message: "BACKEND_AUTH_MS_CLIENT_SECRET env var is required in production"
    }),
    BACKEND_AUTH_MS_TENANT_ID: zod_1.z.string({
        message: "BACKEND_AUTH_MS_TENANT_ID env var is required in production"
    }),
    // ============================================
    // BACKEND - Database (Upstash Redis)
    // ============================================
    BACKEND_UPSTASH_REDIS_URL: zod_1.z.string({
        message: "BACKEND_UPSTASH_REDIS_URL env var is required in production"
    }),
    BACKEND_UPSTASH_REDIS_TOKEN: zod_1.z.string({
        message: "BACKEND_UPSTASH_REDIS_TOKEN env var is required in production"
    }),
    // ============================================
    // BACKEND - Server Config
    // ============================================
    BACKEND_PORT: zod_1.z.coerce.number().default(4001),
    BACKEND_CORS_ORIGINS: zod_1.z.string().optional(),
    BACKEND_DEBUG: zod_1.z.coerce.boolean().default(false),
    // ============================================
    // FRONTEND - Site Info
    // ============================================
    FRONTEND_SITE_URL: zod_1.z.string({
        message: "FRONTEND_SITE_URL env var is required in production"
    }),
    FRONTEND_SITE_TITLE: zod_1.z.string({
        message: "FRONTEND_SITE_TITLE env var is required in production"
    }),
    FRONTEND_SITE_DESCRIPTION: zod_1.z.string({
        message: "FRONTEND_SITE_DESCRIPTION env var is required in production"
    }),
    // ============================================
    // FRONTEND - TinaCMS Client (públicas)
    // ============================================
    FRONTEND_TINA_GRAPHQL_URL: zod_1.z.string({
        message: "FRONTEND_TINA_GRAPHQL_URL env var is required in production"
    }),
    FRONTEND_TINA_API_URL: zod_1.z.string({
        message: "FRONTEND_TINA_API_URL env var is required in production"
    }),
    FRONTEND_TINA_IS_LOCAL: zod_1.z.coerce.boolean().default(false),
});
exports.prodEnvSchema = prodEnvSchema;
var env = IS_DEV_MODE
    ? devEnvSchema.parse(process.env)
    : prodEnvSchema.parse(process.env);
exports.env = env;
