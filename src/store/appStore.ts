import { defineStore } from 'pinia'
export default defineStore(
  'app', 
  {
    state: () => ({
      // 全局弹窗
      modal: false,
    })
  }
)