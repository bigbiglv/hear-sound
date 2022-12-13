import { defineStore } from 'pinia'
import type { TModal, TMode, TPosition } from './types'
import dynamics from 'dynamics.js'
import audioStore from './audioStore'
type TState = {
  modal: TModal,
  height: {
    hidden: string,
    normal: string,
    occupy: string,
  },
  volumePosition: TPosition
}
export default defineStore('app',{
  state: (): TState => ({
    // 全局弹窗
    modal: 'normal',
    height: {
      hidden: '0px',
      normal: '56px',
      occupy: '800px'
    },
    volumePosition: 'right'

  }),
  actions: {
    /** 设置播放弹窗的显示模式 */
    setModal(modal: TModal) {
      // 当前没有播放的歌曲信息 又传参显示 
      if (modal !== 'hidden' && !audioStore().playSong?.hasOwnProperty('id')) {
        return
      }
      // 切换到的模式的高度
      let height: string
      // 显示状态下 如果传入的参数和当前的值this.modal一样的话 改为另一种显示模式
      if (modal !== 'hidden' && modal === this.modal) {
        enum EModal {
          'normal' = 'occupy',
          'occupy' = 'normal'
        }
        height = this.height[EModal[modal]]
        this.modal = EModal[modal]
      }else{
        height = this.height[modal]
        this.modal = modal
      }
      // 执行动画
      this.animation(height)
    },
    /** 改变高度的动画 */
    animation(height: string) {
      const modalElement = document.getElementById('appModal')
      dynamics.animate(
        modalElement,
        {
          height,
        },
        {
          type: dynamics.spring,
          duration: 500,
          friction: 400,
        }
      )
    },
  },
  getters: {
    // modal的样式
    modalStyle: (state) => {
      let height = `height: ${state.height[state.modal]};`
      return height
    },
    // 音量弹窗的模式
    volumeMode(): TMode {
      if (this.volumePosition === 'left' || this.volumePosition === 'right'){
        return 'vertical'
      }else{
        return 'horizontal'
      }
    },
  },
})