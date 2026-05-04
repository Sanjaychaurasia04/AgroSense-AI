import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/mandi': {
        target: 'https://api.data.gov.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(
          /^\/api\/mandi/,
          '/resource/9ef84268-d588-465a-a308-a864a43d0070'  // ← correct ID
        ),
      },
    },
  },
})