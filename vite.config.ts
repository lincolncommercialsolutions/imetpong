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
        bullsball: './bullsball.html',
        konkarne: './konkarne.html',
        birdbench: './birdbench.html',
        bob: './bob.html',
        connect4: './connect4.html',
        comingSoon: './games/coming-soon.html'
      }
    }
  }
})
