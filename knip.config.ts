import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['src/**/*.ts', 'api/**/*.ts', 'api/*.ts'],
  tags: ['-@lintignore', '-@internal'],
  rules: {
    dependencies: 'off',
    unlisted: 'warn',
  },
  paths: {
    '@': ['./src/*'],
  },
  compilers: {
    mdx: true,
    astro: true,
  },
};

export default config;
