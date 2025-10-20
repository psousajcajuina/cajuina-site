import { branch } from "@consts";
import { defineConfig } from "tinacms";
import { BlogCollection } from "./collections/blog";
import { ProductsCollection } from "./collections/posts";
import { PageCollection } from "./collections/page";

export default defineConfig({
  branch,
  clientId: null,
  token: null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
    accept: ["image/*", "video/mp4"],
  },
  schema: {
    collections: [
      BlogCollection,
      ProductsCollection,
      PageCollection
    ],
  },
});
