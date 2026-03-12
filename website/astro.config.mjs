import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'node:path';

export default defineConfig({
  site: 'https://lum1104.github.io',
  base: '/Folkday',
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@shared': path.resolve(import.meta.dirname, '..', 'src'),
      },
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          resolveJsonModule: true,
          esModuleInterop: true,
        },
      },
    },
  },
});
