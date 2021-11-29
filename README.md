# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 ``<script setup>`` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)


# 基于 vue3.0 + element plus + axios + vue-router + vuex + sass 常用的前端技术搭建的脚手架。

## 搭建脚手架的心路历程

### 步骤1. npm install @vitejs/app

### 步骤2. npm install  @vitejs/plugin-vue-jsx
##### 引入 @vitejs/plugin-vue-jsx 兼容 JSX 语法（案例：用JSX写组件注册成基础组件）

build/config.base.js 或者 vite.config.js
---
```
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vue(), 
    vueJsx(),
  ]
}
```

### 步骤3. npm install axios --save

src/utils/request.js
---
```
import axios from 'axios'
// import { useMsgbox, Message } from 'element3'
import store from '@/store'
// import { getToken } from '@/utils/auth'
const getToken = () => ''

const service = axios.create({
  baseURL: window.process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      console.log('接口信息报错', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('接口信息报错' + error)
    return Promise.reject(error)
  },
)

export default service
```

src/apis/auth.js
---
```
import request from '@/utils/request'

// 账号密码登录
export function doLogin(data) {
  const {
    username, // 登录行
    password, // 密码
    checkKey, // 验证码（手写）
    captcha // 验证码
  } = data
  return request.post('/admin-backend/supplier/login', { username, password, checkKey, captcha })
}
```


#### 步骤4. vite中的proxy代理

build/config.dev.js
---
```
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
```

### 步骤5. npm install vue-router --save

src/router/index.js
---
```
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首页', control: false, noNavibart: true },
    component: () => import(/* webpackChunkName: "home" */'@views/Home/index.vue'),
  }, {
    path: '/login',
    name: 'login',
    meta: { title: '登录', control: false, noNavibart: true },
    component: () => import(/* webpackChunkName: "login" */'@views/Login/index.vue')
  }, {
    path: '/platform',
    name: 'platform',
    redirect: '/platform/homepage',
    meta: { title: '管理平台', control: true },
    component: () => import('@/views/platform/index.vue'),
    children: [
      {
        path: '/platform/homepage',
        name: 'homepage',
        meta: { title: '管理平台', control: true },
        component: () => import('@views/platform/pages/homepage/index.vue')
      }
    ]
  }, {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: { title: 'not-fount', control: false, noNavibart: true },
    component: () => import(/* webpackChunkName: "404" */'@views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, form, next) => {
  next()
})


export default router
```

main.js 引入 router
---
```
import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'

const app = createApp(App)
app.use(router)

app.mount('#app')

```


### 步骤6. npm install vuex --save

src/store/index.js
---
```
import { createStore, useStore as baseUseStore } from 'vuex'
import modules from './modules/index'

export const store = createStore({
  state: {
    count: 0
  },
  getters: {
    double: (state) => state.count * 2
  },
  mutations: {
    ADD_COUNT: (state, data = 10) => {
      state.count += data
    }
  },
  actions: {
    addCount ({ commit }, data) {
      commit('ADD_COUNT', data)
    }
  },
  modules
})

export const key = Symbol('y-store')

export function useStore () {
  return baseUseStore(key)
}
```

src/store/modules/index.js
---
```
import auth from './auth'

const modules = {
  auth
}
export default modules
```

src/store/modules/auth.js
---
```
const authModule = {
  namespace: true, // 配合module使用【true-调用action方法时，路径：文件名/actions下面得方法名】
  state: {
    loginInfo: {}, // 登录信息
    token: ''
  },
  getters: {
    userInfo: (state) => state.loginInfo.userInfo || {}
  },
  mutations: {
    SAVE_LOGININFO: (state, data) => {
      state.loginInfo = data
    },
    REMOVE_LOGININFO: (state) => {
      state.loginInfo = {}
    }
  },
  actions: {
    saveLoginInfo: ({ commit }, data) => {
      commit('SAVE_LOGININFO', data)
    },
    removeLoginInfo: ({ commit }) => {
      commit('REMOVE_LOGININFO')
    }
  }
}

export default authModule
```

main.js 引入 store
---
```
import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from '@/store'

const app = createApp(App)
app.use(store, key)

app.mount('#app')
```

### 步骤7. npm install sass --save
#### 安装即用

### 步骤8. npm install eslint -D

#### ESLint 安装成功后，在项目根目录下执行 npx eslint --init，然后按照终端操作的提示完成一系列设置来创建配置文件。
#### 进入到项目目录下的 eslintrc.json 中，在 rules 中新增下面代码，也就是强制要求 JavaScript 的行尾不写分号。
---
```
    "rules": {
        "semi": ["warn","never"]
    }
```
#### 然后，我们在命令行中执行 npx eslint src，接着你就会看到下图所示的报错信息，其中详细告诉你了哪里的代码不合规范。

### 步骤9. npm install vite-plugin-html -D
#### 利用vite-plugin-html插件，修改网页在浏览器的标题和图标。
package.json

vite.config.js
---
```
import { injectHtml } from 'vite-plugin-html'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@views': resolve(__dirname, './src/views'),
      '@router': resolve(__dirname, './src/router')
    }
  },
  plugins: [
    injectHtml({
      injectData: {
        title: description,
        iconsrc
      }
    })
  ]
})
```

package.json
---
```
{
  "name": "vite_project_20211126",
  "version": "0.0.0",
  "description": "智博诚PC端vue3",
  "iconsrc": "/zbc.png",
  ...
}
```

index.html
---
```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <!-- <link rel="icon" href="/favicon.ico" /> -->
  <link rel="icon" href=<%=iconsrc %> />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- <title>Vite App</title> -->
  <title>
    <%= title %>
  </title>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>

</html>
```
