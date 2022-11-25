import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { base } from './base'
const routes: Array<RouteRecordRaw> = [...base]
export default createRouter({
  history: createWebHashHistory(),
  routes,
})