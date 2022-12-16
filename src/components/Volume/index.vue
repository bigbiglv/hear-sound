<script setup lang="ts">
import { computed } from 'vue'
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
const volume = computed({
  get(){
    // 音量是 0-1 , 这里设置为 100 倍
    return storeAudio.volume * 100 | 0
  },
  set(val){
    // 设置音量
    storeAudio.setVolume(val / 100)
  }
})
</script>

<template>
  <div 
    id="volumeModal"
    class="fixed rounded-full transform bg-light-900 z-50 flex justify-center items-center" 
    :class="contextClass"
    >
    <Progress v-model="volume" :position="storeApp.volumeMode" :max="100" :min="0" />
  </div>
</template>