import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/mandi': {
        target: 'https://api.data.gov.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mandi/, '/resource/35985678-0d79-46b4-9ed6-6f13308a1d24'),
      },
    },
  },
})