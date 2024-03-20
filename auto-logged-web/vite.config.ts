import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'
import manifest from './src/manifest'
import ElementPlus from 'unplugin-element-plus/vite'
import wasm from 'vite-plugin-wasm'
const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9999,
  },
  plugins: [
    vue(),
    wasm(),
    ElementPlus({}),
    webExtension({
      manifest: {
        ...manifest,
      },
    }),
  ],
})
