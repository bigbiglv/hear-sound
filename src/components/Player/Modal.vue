<script setup lang="ts">
import { computed } from 'vue' 
import appStore from '@/store/appStore'
const store = appStore()
enum Modal {
  'hideden' = 'bottom-0',
  'normal' = 'h-14 bottom-0',
  'occupy' = 'h-screen bottom-0'
}
const ModalClass = computed(() => {
  return Modal[store.modal]
})
</script>

<template>
  <!-- 三个模式: 全不显示; 露出90px; 全遮挡 -->
  <div class="w-screen fixed bg-red-300 rounded-t-lg transition-all" :class="ModalClass">
    
  </div>
</template>


<style lang="scss" scoped>

</style>