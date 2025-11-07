import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['*.ts', 'api/**/*.ts', 'api/*.ts'],
  ignore: ['**/node_modules/**', '**/dist/**', '*.config.ts'],
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
