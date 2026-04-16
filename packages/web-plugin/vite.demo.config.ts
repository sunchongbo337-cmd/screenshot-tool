import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Build the demo app as a static site for delivery.
export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  base: './',
  build: {
    outDir: resolve(__dirname, 'demo-dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  }
});

