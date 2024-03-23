import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    plugins: [vue(), jsx()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/src/pages/mainPage/index.html'),
          webview: resolve(__dirname, 'src/renderer/src/pages/desktopPet/index.html')
        }
      }
    }
  }
})
