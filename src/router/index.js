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