import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Served from a GitHub Pages project subpath in production
// (https://<user>.github.io/csharp-course/), but from root in local dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/csharp-course/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
