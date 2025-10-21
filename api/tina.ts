import express from "express";
import cookieParser from "cookie-parser";
import ServerlessHttp from "serverless-http";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import cors from "cors";
import databaseClient from "tina/database";
import { IS_LOCAL } from "@consts";
import { env } from "@env";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const tinaBackend = TinaNodeBackend({
  authProvider: IS_LOCAL
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: env.NEXTAUTH_SECRET,
          debug: true,
          providers: [
            //@ts-ignore
            MicrosoftEntraID({
              clientId: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
              clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
              issuer: env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
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

export const handler = ServerlessHttp(app);
