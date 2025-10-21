import { defineConfig, LocalAuthProvider } from "tinacms";
import { BlogCollection } from "./collections/blog";
import { GlobalConfigCollection } from "./collections/global-config";
import { PageCollection } from "./collections/page";
import { ProductsCollection } from "./collections/posts";
import {
  TinaUserCollection,
  DefaultAuthJSProvider
} from "tinacms-authjs/dist/tinacms";
import { BRANCH, IS_LOCAL } from "@consts";

//@ts-ignore
export default defineConfig({
  branch: BRANCH,
  authProvider: IS_LOCAL
    ? new LocalAuthProvider()
    : new DefaultAuthJSProvider(),
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
