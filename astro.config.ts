import path from 'path';
import { fileURLToPath } from 'url';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
  resolveImagePathsRemarkPlugin,
} from './src/utils/frontmatter';
import { remarkYouTubePlugin } from './src/utils/remark-youtube';
import { remarkLayoutShortcodes } from './src/utils/remark-layout-shortcodes';
import { preprocessShortcodes } from './src/utils/preprocess-shortcodes';
import { viteShortcodePreprocessor } from './src/utils/vite-shortcode-preprocessor';
import react from '@astrojs/react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (
  items: (() => AstroIntegration) | (() => AstroIntegration)[] = []
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL || 'https://cajuinasaogeraldo.com.br',

  // SSG completo por padrão
  output: 'static',

  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
    astrowind({
      config: './src/config.yaml',
    }),
    react(),
  ],

  image: {
    domains: [
      'cdn.pixabay.com',
      'images.unsplash.com',
      'cajuinasaogeraldo.com.br',
    ],
  },

  markdown: {
    remarkPlugins: [
      readingTimeRemarkPlugin,
      resolveImagePathsRemarkPlugin,
      preprocessShortcodes, // ANTES do parser processar
      remarkYouTubePlugin,
      remarkLayoutShortcodes,
    ],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
    shikiConfig: {
      wrap: true,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  vite: {
    plugins: [tailwindcss(), viteShortcodePreprocessor()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
