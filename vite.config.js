// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        page1: 'page1.html',
        page2: 'page2.html'
      }
    }
  }
})
