import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['eiou-square.svg', 'eiou-wide.svg', 'robots.txt'],
      manifest: {
        name: 'eiou',
        short_name: 'eiou',
        theme_color: '#fff8e7',
        icons: [
          {
            src: 'eiou-square.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'eiou-square.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
