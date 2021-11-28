import { defineConfig, mergeConfig } from 'vite'

import baseConfig from './config.base'

export default defineConfig(mergeConfig(baseConfig, {
  server: {
    host: '0.0.0.0',
    open: false,
    cors: true,
    port: 80,
    proxy: {
      '/admin-backend': {
        target: 'http://10.0.13.228:8090',
        changeOrigin: true
      }
    }
  }
}))