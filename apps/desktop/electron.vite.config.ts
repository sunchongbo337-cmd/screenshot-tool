import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const appDir = dirname(fileURLToPath(import.meta.url));

/**
 * Vite `?url` imports from hoisted node_modules resolve to `/@fs/E:/...` which is invalid inside
 * Tesseract's worker `importScripts`. Copy assets into renderer `public/` and load via normal URLs.
 */
function copyTesseractToRendererPublic(): Plugin {
  const rendererPublic = join(appDir, 'src/renderer/public');
  return {
    name: 'copy-tesseract-to-renderer-public',
    buildStart() {
      const nmRoot = (() => {
        let d = appDir;
        for (let i = 0; i < 12; i++) {
          const candidate = join(d, 'node_modules', 'tesseract.js');
          if (existsSync(candidate)) return join(d, 'node_modules');
          const parent = dirname(d);
          if (parent === d) break;
          d = parent;
        }
        return null;
      })();
      if (!nmRoot) {
        console.warn('[electron-vite] copy-tesseract: node_modules/tesseract.js not found (skip)');
        return;
      }
      const tessJs = join(nmRoot, 'tesseract.js');
      const tessCore = join(nmRoot, 'tesseract.js-core');
      const workerSrc = join(tessJs, 'dist', 'worker.min.js');
      if (!existsSync(workerSrc)) {
        console.warn('[electron-vite] copy-tesseract: worker.min.js missing (skip)');
        return;
      }
      const outTess = join(rendererPublic, 'tesseract');
      const outCore = join(rendererPublic, 'tesseract-core');
      mkdirSync(outTess, { recursive: true });
      mkdirSync(outCore, { recursive: true });
      copyFileSync(workerSrc, join(outTess, 'worker.min.js'));
      if (existsSync(tessCore)) {
        for (const name of readdirSync(tessCore)) {
          if (!name.startsWith('tesseract-core-simd-lstm')) continue;
          if (!name.endsWith('.wasm.js') && !name.endsWith('.wasm')) continue;
          copyFileSync(join(tessCore, name), join(outCore, name));
        }
      }
    }
  };
}

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: resolve(appDir, 'src/main/index.ts')
      }
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: resolve(appDir, 'src/preload/index.ts'),
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
    root: resolve(appDir, 'src/renderer'),
    plugins: [react(), copyTesseractToRendererPublic()],
    optimizeDeps: {
      include: ['js-web-screen-shot']
    },
    server: {
      // Keep a stable port to reduce "Connection Failed" when multiple dev servers run.
      port: 5176
    },
    build: {
      outDir: resolve(appDir, 'dist/renderer'),
      emptyOutDir: true
    }
  }
});

