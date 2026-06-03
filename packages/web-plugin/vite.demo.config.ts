import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Dev server + static demo build (index.html → demo-dist).
export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  base: './',
  server: {
    port: 5185,
    strictPort: true
  },
  optimizeDeps: {
    include: ['js-web-screen-shot']
  },
  build: {
    outDir: resolve(__dirname, 'demo-dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  }
});
