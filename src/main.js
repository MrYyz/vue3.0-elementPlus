import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import { store, key } from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/styles/index.scss'

import baseComponents from '@/components/base'

const app = createApp(App)

app.use(router)
app.use(store, key)
app.use(ElementPlus, { size: 'small' })

// 注册基本组件
for(let k in baseComponents){
  const comp = baseComponents[k]
  app.component(comp.name, comp)
}

app.mount('#app')
