import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from "tinacms-authjs";
import databaseClient from './database'
// import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { IS_LOCAL } from "../../consts";
import { env } from "../../env";

const handler = TinaNodeBackend({
  authProvider: IS_LOCAL
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient,
          secret: env.NEXTAUTH_SECRET,
          providers: [
            
          ]
        }),
      }),
  databaseClient: databaseClient,
});

export default (req: any, res: any) => {
  // Modify the request here if you need to
  return handler(req, res);
};
