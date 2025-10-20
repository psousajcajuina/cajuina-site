// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import tinaDirective from "./astro-tina-directive/register"
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://cajuinasaogeraldo.com.br',
  output: 'static', 
  integrations: [mdx(), sitemap(), react(), tinaDirective()],

  vite: {
    plugins: [tailwindcss()],
  },
});