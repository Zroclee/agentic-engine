import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 如果后端接口本身没有 /api 前缀，可以开启 rewrite 将其重写掉
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
