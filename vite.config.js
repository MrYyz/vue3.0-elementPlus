import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { injectHtml } from 'vite-plugin-html'
import { description, iconsrc } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@views': resolve(__dirname, './src/views'),
      '@router': resolve(__dirname, './src/router')
    }
  },
  plugins: [
    vue(), 
    vueJsx(),
    injectHtml({
      injectData: {
        title: description,
        iconsrc
      }
    })
  ]
})
