import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  // Base URL для GitHub Pages
  base: '/RETRO-PC-STORE/',
  
  // Настройки сервера разработки
  server: {
    port: 3000,
    open: true,
    host: true
  },

  // Настройки сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['workbox-window'],
          'fallback-data': ['./assets/js/fallback-data.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // CSS настройки
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_variables.scss";`
      }
    },
    devSourcemap: true
  },

  // Плагины
  plugins: [
    // PWA поддержка
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'assets/img/**/*'],
      manifest: {
        name: 'RETRO-PC STORE',
        short_name: 'RetroPC',
        description: 'Демонстрационный магазин винтажных компонентов',
        theme_color: '#33FF33',
        background_color: '#0D0D0D',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
              }
            }
          }
        ]
      }
    }),

    // Поддержка старых браузеров
    legacy({
      targets: ['defaults', 'not IE 11']
    }),

    // Сжатие файлов
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],

  // Оптимизации
  optimizeDeps: {
    include: ['workbox-window']
  }
});
