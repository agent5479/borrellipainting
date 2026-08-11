import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/borrellipainting/',
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist',
    emptyOutDir: !isSsrBuild,
    sourcemap: false,
  },
}))
