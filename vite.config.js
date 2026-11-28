
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'FindIt - Objetos perdidos y encontrados',
        short_name: 'FindIt',
        description: 'Encuentra y publica objetos perdidos o encontrados en tu comunidad.',

        theme_color: '#4169e1',
        background_color: '#eef3ff',

        display: 'standalone',
        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },


      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) =>
              request.destination === 'image' &&
              url.hostname.endsWith('.ngrok-free.dev') &&
              url.pathname.startsWith('/api/files/'),

            handler: 'CacheFirst',

            options: {
              cacheName: 'findit-pocketbase-imagenes',

              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },

              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }

    })
  ],

  server: {
    allowedHosts: ['.trycloudflare.com']
  },

  preview: {
    allowedHosts: ['.trycloudflare.com']
  }
})
