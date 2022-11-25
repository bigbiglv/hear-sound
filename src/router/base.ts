import { RouteRecordRaw } from 'vue-router'
import home from '@/views/Home/index.vue'
export const base: Array<RouteRecordRaw> = [
  {
    path:'/',
    name: 'index',
    meta: {
      isLogin: false,
      keepAlive: true,
    },
    component:home
  }
]