import { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home/index.vue'
import Error from '@/views/Error/index.vue'
export const base: Array<RouteRecordRaw> = [
  {
    path:'/',
    alias: '/home',
    name: 'index',
    meta: {
      isLogin: false,
      keepAlive: true,
    },
    component: Home
  },
  {
    path:'/search',
    name: 'Search',
    meta: {
      isLogin: false,
      keepAlive: false,
    },
    component: () => import('@/views/Search/index.vue')
  },
  {
    path:'/artist',
    name: 'Artist',
    meta: {
      isLogin: false,
      keepAlive: false,
    },
    component: () => import('@/views/Artist/index.vue')
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