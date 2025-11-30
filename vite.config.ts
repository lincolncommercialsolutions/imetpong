import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: '/index.html'
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        pong: './pong.html',
        comingSoon: './games/coming-soon.html'
      }
    }
  }
})
