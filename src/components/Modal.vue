<script setup lang="ts">
import { computed } from 'vue'
import Tool from '@/components/Player/Tool.vue'
import LyricList from './Lyric/List.vue'
import appStore from '@/store/appStore'
const store = appStore()
const ModalClass = computed(() => {
  let rounded = store.modal === 'normal' && 'rounded-t-2xl'
  return rounded
})
</script>

<template>
  <!-- 三个模式: 全不显示; 露出90px; 全遮挡 -->
  <div 
    id="appModal"
    class="w-screen fixed bg-light-700 bottom-0"
    :style="store.modalStyle"
    :class="ModalClass"
    >
    <Tool />
    <LyricList />
  </div>
</template>


<style lang="scss" scoped>

</style>