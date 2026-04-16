import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: resolve(__dirname, 'src/main/index.ts')
      }
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: resolve(__dirname, 'src/preload/index.ts'),
        // Electron preload 在多数环境下仍按 CommonJS 加载；
        // 输出 ESM（.mjs）会触发 "Cannot use import statement outside a module"。
        output: {
          format: 'cjs',
          entryFileNames: 'index.cjs'
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react()],
    server: {
      // Keep a stable port to reduce "Connection Failed" when multiple dev servers run.
      port: 5176
    },
    build: {
      outDir: resolve(__dirname, 'dist/renderer'),
      emptyOutDir: true
    }
  }
});

