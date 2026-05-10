import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 后端默认 8000；前端原本走相对路径 ../chat 与 ../new-chat
    // 这里把这两个接口代理到后端，保持 cookie 同源
    proxy: {
      '/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
        rewrite: (p) => p.replace(/^\/chat/, '/smart/edu/chat'),
      },
      '/new-chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
        rewrite: (p) => p.replace(/^\/new-chat/, '/smart/edu/new-chat'),
      },
    },
  },
  base: './',
})
