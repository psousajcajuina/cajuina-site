import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['api/server.ts'], 
  format: ['esm'], 
  target: 'node18', 
  outDir: 'dist/api', 
  clean: true,
  sourcemap: true,
  dts: true, 
  splitting: false, 
  treeshake: true, // Remove código não utilizado
  bundle: true, // Agrupa dependências
  external: [
    // Módulos nativos do Node.js
    'node:*',
    'fs',
    'path',
    'crypto',
    'http',
    'https',
    'stream',
    'util',
    'events',
    'os',
    'url',
    'zlib',
    // Dependências do TinaCMS que não precisam ser agrupadas
    'tinacms',
    '@tinacms/datalayer',
    'tinacms-authjs',
    'tinacms-gitprovider-github',
  ],
  esbuildOptions(options) {
    options.platform = 'node';
    options.packages = 'external'; // Externaliza pacotes listados em 'external'
  },
  onSuccess: 'echo "✅ Backend compilado com sucesso!"',
});