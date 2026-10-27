
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // Permite abrir la app mediante un túnel HTTPS
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },

  preview: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
