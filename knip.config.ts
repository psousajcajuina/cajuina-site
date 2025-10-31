import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['src/**/*.ts', 'api/**/*.ts', 'api/*.ts'],
  tags: ['-@lintignore', '-@internal'],
  paths: {
    '@': ['./src/*'],
  },
};

export default config;
