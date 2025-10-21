// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tinaDirective from "./astro-tina-directive/register";
// import { env } from "@env";
import tailwindcss from "@tailwindcss/vite";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://cajuinasaogeraldo.com.br",
  output: "static",
  integrations: [mdx(), sitemap(), react(), tinaDirective()],
  vite: {
    plugins: [tailwindcss()],
    // resolve: {
    //   alias: {
    //     "@env": path.resolve(__dirname, "../../env.ts"),
    //   },
    // },
  },
});
