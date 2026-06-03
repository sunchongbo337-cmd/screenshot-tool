import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/** Bundle content script with js-web-screen-shot (also used by offscreen.html). */
export default defineConfig({
  build: {
    outDir: resolve(__dirname),
    emptyOutDir: false,
    lib: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/content.ts'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        inlineDynamicImports: true
      }
    },
    target: 'chrome100',
    minify: false
  }
});
