import { defineStore } from 'pinia'
type TState = {
  modal: 'hideden' | 'normal' | 'occupy'
}
export default defineStore('app',{
  state: (): TState => ({
    // 全局弹窗
    modal: 'normal',
  })
})