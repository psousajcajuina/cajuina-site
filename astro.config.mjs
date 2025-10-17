// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cajuinasaogeraldo.com.br',
  output: 'static', // SSG completo por padrão
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});