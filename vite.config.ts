import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['iOS >= 13', 'Safari >= 13', 'last 2 versions'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  base: '/',
  build: {
    target: ['es2015', 'safari13'],
  },
})
