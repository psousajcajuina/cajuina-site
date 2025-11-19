import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
// @ts-ignore
import typographyPlugin from '@tailwindcss/typography';
import { colors } from './src/ui/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '10px',
        xsm: '12px',
      },
      fontFamily: {
        din: ['var(--font-din)', 'sans-serif'],
        bevan: ['Bevan', 'cursive'],
        sans: [
          'var(--aw-font-sans, ui-sans-serif)',
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          'var(--aw-font-serif, ui-serif)',
          ...defaultTheme.fontFamily.serif,
        ],
        heading: [
          'var(--aw-font-heading, ui-sans-serif)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        ...colors,
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    // typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  purge: ['./src/**/*.html', './src/**/*.astro', './src/**/*.jsx'],
};
