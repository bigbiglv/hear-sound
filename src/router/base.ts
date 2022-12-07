import { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home/index.vue'
import Error from '@/views/Error/index.vue'
export const base: Array<RouteRecordRaw> = [
  {
    path:'/',
    name: 'index',
    meta: {
      isLogin: false,
      keepAlive: true,
    },
    component: Home
  },
  {
    path:'/:catchAll(.*)',
    name: 'NotFound',
    meta: {
      isLogin: false,
      keepAlive: false,
    },
    component: Error
  },
]