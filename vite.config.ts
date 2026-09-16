import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';

// Classic build (default): plain Vite SPA -> dist/, then esbuild bundles
// api/server.ts -> dist/server.cjs for Express (npm run build / npm start).
// Cloudflare build (CLOUDFLARE=true): adds the CF plugin and outputs to
// dist-cf/ (client assets + Worker + wrangler.json) so the two builds never
// share dist/.
const isCloudflare = process.env.CLOUDFLARE === 'true';

export default defineConfig(() => {
  return {
    plugins: isCloudflare
      ? [react(), tailwindcss(), cloudflare()]
      : [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ...(isCloudflare
      ? {
          build: {
            outDir: 'dist-cf',
          },
        }
      : {}),
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});