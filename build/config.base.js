import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { injectHtml } from 'vite-plugin-html'
import { description, iconsrc } from '../package.json'

export default {
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@views': resolve(__dirname, '../src/views'),
      '@router': resolve(__dirname, '../src/router'),
      '@store': resolve(__dirname, '../src/store')
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
}