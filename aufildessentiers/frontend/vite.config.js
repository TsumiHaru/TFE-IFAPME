import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true, // Automatically open the browser
    host: true, // Listen on all network interfaces
    // Proxy /api calls to backend during development so fetch('/api/...') works
    proxy: {
      '/api': {
        target: 'https://api.aufildessentiers.mehdikorichi.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
})
