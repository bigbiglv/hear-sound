import { defineStore } from 'pinia'
import type { TModal } from './types'
import audioStore from './audioStore'
type TState = {
  modal: TModal
}
export default defineStore('app',{
  state: (): TState => ({
    // 全局弹窗
    modal: 'normal',
  }),
  actions: {
    /** 设置播放弹窗的显示模式 */
    setModal(modal: TModal) {
      // 当前没有播放的歌曲信息 又传参显示 
      if (modal !== 'hidden' && !audioStore().playSong?.hasOwnProperty('id')) {
        return
      }
      this.modal = modal
    },
  }
})