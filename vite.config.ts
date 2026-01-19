import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Redirect ethers to ethers5 for Aleph SDK compatibility
      "ethers": path.resolve(__dirname, "./node_modules/ethers5"),
    },
  },
  optimizeDeps: {
    include: ['ethers5'],
  },
})
