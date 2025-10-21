//@ts-nocheck
import express from "express";
import cookieParser from "cookie-parser";
import ServerlessHttp from "serverless-http";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import AzureADProvider from "next-auth/providers/azure-ad";
import cors from "cors";
import { IS_LOCAL } from "../consts";
import { env } from "../env";
import databaseClient from "tina/__generated__/databaseClient";

//@ts-ignore
const app = express();

// Configuração de CORS para permitir frontend separado
const allowedOrigins = IS_LOCAL 
  ? ['http://localhost:4321', 'http://localhost:3000', 'http://localhost:4200']
  : [env.FRONTEND_SITE_URL, ...(env.BACKEND_CORS_ORIGINS?.split(',') || [])];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueou origem: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-branch'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

const tinaBackend = TinaNodeBackend({
  authProvider: IS_LOCAL
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: env.BACKEND_NEXTAUTH_SECRET,
          debug: env.BACKEND_DEBUG,
          providers: [
            AzureADProvider({
              clientId: env.BACKEND_AUTH_MS_CLIENT_ID,
              clientSecret: env.BACKEND_AUTH_MS_CLIENT_SECRET,
              tenantId: env.BACKEND_AUTH_MS_TENANT_ID,
            }),
          ],
        }),
      }),
  databaseClient,
});

app.post("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

app.get("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

// Tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: IS_LOCAL ? err.message : 'Ocorreu um erro no servidor'
  });
});

// Exportar handler para uso serverless (Netlify, Vercel, etc)
export const handler = ServerlessHttp(app);

// Exportar app para testes e uso standalone
export default app;
