import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'UIKit',
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部化处理不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为外部化依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  }
})
