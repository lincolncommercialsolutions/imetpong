import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: '/home.html'
  },
  build: {
    rollupOptions: {
      input: {
        home: './home.html',
        pong: './pong.html',
        comingSoon: './games/coming-soon.html'
      }
    }
  }
})
