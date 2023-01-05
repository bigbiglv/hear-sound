<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import Progress from '@/components/Progress/index.vue'
import { storeToRefs } from 'pinia' 
import appStore from '@/store/appStore'
import audioStore from '@/store/audioStore'
const storeApp = appStore()
const { volumePosition, volumeMode } = storeToRefs(storeApp)
const contextClass = computed(() => {
  // 根据弹出位置设置宽高样式
  let modeClass = volumeMode.value === 'vertical' ? `w-10 h-50` : `w-50 h-10`
  // 设置居中 默认靠边 通过位置移动到不可见
  let positionClass: string = ''
  let classObj = {
    top: 'left-1/2 -translate-x-1/2 -translate-y-full top-0',
    bottom: 'left-1/2 -translate-x-1/2 translate-y-full bottom-0',
    right: 'top-1/2 -translate-y-1/2 translate-x-full right-0',
    left: 'top-1/2 -translate-y-1/2 -translate-x-full left-0'
  }
  positionClass += classObj[volumePosition.value]
  return `${modeClass} ${positionClass}`
})
const storeAudio = audioStore()
const isDrag = ref<boolean>(false)
function progressDrag(data: boolean){
  isDrag.value = data
}

/**
 * 弹窗关闭的时机
 */
let timer:NodeJS.Timeout
watchEffect(() => {
  if (isDrag.value && timer) {
    // 正在滑动并且已经启动过一次定时器了就停止之前的定时器 取消关闭
    clearTimeout(timer)
  }
  if (!isDrag.value && storeApp.volumeModal) {
    timer = setTimeout(() => {
      storeApp.closeVolumeModal()
    }, 2000);
  }
})

const volume = computed({
  get(){
    return storeAudio.volume
  },
  set(val){
    // 设置音量
    storeAudio.setVolume(val)
  }
})
</script>

<template>
  <div 
    id="volumeModal"
    class="fixed rounded-full transform bg-light-900 z-50 flex justify-center items-center" 
    :class="contextClass"
    >
    <Progress
      v-model="volume"
      :orient="storeApp.volumeMode"
      :max="1"
      :min="0" 
      @update:drag="progressDrag"
    />

  </div>
</template>