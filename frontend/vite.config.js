import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/attestation': {
        target: 'http://20.49.47.204:8001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
