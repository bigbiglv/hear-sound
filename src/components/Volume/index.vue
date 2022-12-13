<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia' 
import appStore from '@/store/appStore'
const storeApp = appStore()
const { volumePosition, volumeMode } = storeToRefs(storeApp)
const contextClass = computed(() => {
  let modeClass = volumeMode.value === 'vertical' ? `${volumePosition.value}-4 w-5 h-40` : `${volumePosition.value}-4 w-40 h-5`
  let positionClass: string = `${volumePosition.value}-4 `
  if(volumePosition.value === 'left' || volumePosition.value === 'right'){
    positionClass += 'top-1/2 -translate-y-1/2'
  } else if (volumePosition.value === 'top' || volumePosition.value === 'bottom'){
    positionClass += 'left-1/2 -translate-x-1/2'
  }
  return `${modeClass} ${positionClass}`
})
</script>

<template>
  <div class="fixed rounded-md transform -translate-y-1/2 z-50" :class="contextClass">
    进度
  </div>
</template>