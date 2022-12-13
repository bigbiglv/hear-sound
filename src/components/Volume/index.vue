<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia' 
import appStore from '@/store/appStore'
const storeApp = appStore()
const { volumePosition, volumeMode } = storeToRefs(storeApp)
const contextClass = computed(() => {
  // 根据弹出位置设置宽高样式
  let modeClass = volumeMode.value === 'vertical' ? `w-10 h-50` : `w-50 h-10`
  // 设置居中 默认靠边 通过位置移动到不可见
  let positionClass: string = `${volumePosition.value}-0 `
  switch (volumePosition.value) {
    case 'top':
      positionClass += 'left-1/2 -translate-x-1/2 -translate-y-full'
      break
    case 'bottom':
      positionClass += 'left-1/2 -translate-x-1/2 translate-y-full'
      break
    case 'right':
      positionClass += 'top-1/2 -translate-y-1/2 translate-x-full'
      break
    case 'left':
      positionClass += 'top-1/2 -translate-y-1/2 -translate-x-full'
      break
    default:
      break
  }
  return `${modeClass} ${positionClass}`
})
</script>

<template>
  <div 
    id="volumeModal"
    class="fixed rounded-full transform bg-light-900 z-50" 
    :class="contextClass"
    >
    进度
  </div>
</template>