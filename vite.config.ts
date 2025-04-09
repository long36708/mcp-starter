import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node18',        // target modern Node version
    ssr: true,               // build for SSR (Node) instead of browser
    outDir: 'dist',          // output directory for build artifacts
    rollupOptions: {
      output: {
        format: 'esm',                   // output as ES module
        entryFileNames: 'server.mjs'     // single output file name
      }
      // You could mark certain packages as external if desired:
      // external: ['some-native-module']
    }
  },
  test: {
    // Vitest config if needed (could also be in separate vitest.config.ts)
    environment: 'node'
  }
});
