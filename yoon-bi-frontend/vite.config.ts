import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Utilise VITE_API_TARGET uniquement en développement pour proxifier /api vers le backend
export default defineConfig(() => {
  const apiTarget = process.env.VITE_API_TARGET || 'https://yoon-bi-backend.onrender.com'
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
