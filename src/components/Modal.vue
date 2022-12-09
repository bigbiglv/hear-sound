<script setup lang="ts">
import { computed } from 'vue'
import Tool from '@/components/Player/Tool.vue'
import LyricList from './Lyric/List.vue'
import appStore from '@/store/appStore'
const store = appStore()
enum Modal {
  'hidden' = 'bottom-0',
  'normal' = 'h-14 bottom-0',
  'occupy' = 'h-screen bottom-0'
}
const ModalClass = computed(() => {
  let rounded = store.modal === 'normal' && 'rounded-t-2xl'
  return `${Modal[store.modal]} ${rounded}`
})
</script>

<template>
  <!-- 三个模式: 全不显示; 露出90px; 全遮挡 -->
  <div class="w-screen fixed bg-red-300 transition-all duration-150" :class="ModalClass">
    <Tool />
    <LyricList />
  </div>
</template>


<style lang="scss" scoped>

</style>