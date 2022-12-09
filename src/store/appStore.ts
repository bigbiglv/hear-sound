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
      // 显示状态下 如果传入的参数和当前的值一样的话 改为另一种显示模式
      if (modal !== 'hidden' && modal === this.modal) {
        enum EModal {
          'normal' = 'occupy',
          'occupy' = 'normal'
        }
        return this.modal = EModal[modal]
      }
      this.modal = modal
    },
  }
})