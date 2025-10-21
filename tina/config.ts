import { defineConfig, LocalAuthProvider } from "tinacms";
import { BlogCollection } from "./collections/blog";
import { GlobalConfigCollection } from "./collections/global-config";
import { PageCollection } from "./collections/page";
import { ProductsCollection } from "./collections/posts";
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from "tinacms-authjs/dist/tinacms";
import { BRANCH, IS_LOCAL } from "@consts";
import { env } from "@env";

//@ts-ignore
export default defineConfig({
  branch: BRANCH,
  contentApiUrlOverride: IS_LOCAL
    ? "http://localhost:4001/graphql"
    : env.FRONTEND_TINA_GRAPHQL_URL,
  authProvider: IS_LOCAL
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      TinaUserCollection,
      BlogCollection,
      PageCollection,
      GlobalConfigCollection,
      ProductsCollection,
    ],
  },
});
