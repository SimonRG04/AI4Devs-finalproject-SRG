import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },
    preview: {
      port: process.env.PORT || 5173,
      strictPort: true,
      host: true, // Escuchar en todas las interfaces de red (0.0.0.0)
      allowedHosts: [
        'frontend-vuejs-production.up.railway.app',
        '.railway.app' // Permitir todos los subdominios de railway.app
      ]
    }
  }
}) 