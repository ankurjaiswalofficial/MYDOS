/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs: this app may be served from a sub-path behind a
  // reverse proxy, and an absolute `/assets/...` only resolves at the root.
  base: './',
  plugins: [react()],
  server: {
    // Named so a container can reach it. `localhost` inside a container binds
    // to the container's own loopback and nothing outside can connect.
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
