import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      entryRoot: 'src',
      include: ['src/index.ts']
    })
  ],
  server: {
    // Avoid clashing with the desktop renderer dev server.
    port: 5185
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ScreenShotPlugin',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'umd' ? 'screenShotPlugin.umd.js' : 'screenShotPlugin.es.js')
    }
  }
});

