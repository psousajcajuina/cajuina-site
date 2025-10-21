import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['api/server.ts'], 
  format: ['esm'], 
  target: 'es2022', 
  outDir: 'dist/api',
  clean: true,
  sourcemap: false,
  dts: true, 
  splitting: false, 
  treeshake: true, // Remove código não utilizado
  bundle: true,
  onSuccess: 'echo "✅ Backend compilado com sucesso!"',
});