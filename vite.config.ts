/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        visualizer({
          filename: 'stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
          manifest: {
            name: 'Vizu',
            short_name: 'Vizu',
            description: 'Ghost mode social — encrypted proximity network',
            theme_color: 'var(--app-primary)',
            background_color: 'var(--app-primary)',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/home',
            icons: [
              { src: '/icon-72.png', sizes: '72x72', type: 'image/png' },
              { src: '/icon-96.png', sizes: '96x96', type: 'image/png' },
              { src: '/icon-128.png', sizes: '128x128', type: 'image/png' },
              { src: '/icon-144.png', sizes: '144x144', type: 'image/png' },
              { src: '/icon-152.png', sizes: '152x152', type: 'image/png' },
              { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icon-384.png', sizes: '384x384', type: 'image/png' },
              { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/.*\/api\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24, // 1 day
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['motion'],
              'vendor-icons': ['lucide-react'],
              'vendor-axios': ['axios'],
            },
          },
        },
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['**/*.test.{js,jsx,ts,tsx}'],
        env: {
          VITE_DEV_AUTO_LOGIN: 'false',
        },
      }
    };
});



