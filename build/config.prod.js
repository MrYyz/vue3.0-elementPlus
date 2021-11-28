import { defineConfig, mergeConfig } from 'vite'
import minifyHtml from 'vite-plugin-html'
import configBase from './config.base'

export default defineConfig(mergeConfig(configBase, {
  plugins: [
    minifyHtml()
  ],
  build: {
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    commonjsOptions: {
      ignoreDynamicRequires: false,
      transformMixedEsModules: true,
      brotliSize: false,
      sourceMap: false
    }
  }
}))