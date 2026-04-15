import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
      'react-dom/server': 'react-dom/server.browser',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  ssr: {
    noExternal: true,
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
    },
  },
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
      },
    }),
  ],
});
