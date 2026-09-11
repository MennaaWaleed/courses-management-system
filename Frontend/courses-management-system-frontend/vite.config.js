import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs (0.0.0.0)
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.trycloudflare.com'
    ],
    hmr: {
      clientPort: 443 // Ensures HMR connects over secure HTTPS through Cloudflare
    }
  }
})