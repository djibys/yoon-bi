import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration pour la production - Supprime les console.log
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprime tous les console.log en production
        drop_debugger: true, // Supprime tous les debugger
      },
    },
  },
})
