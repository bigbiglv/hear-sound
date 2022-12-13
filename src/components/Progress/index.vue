<script setup lang="ts">
import appStore from '@/store/appStore'
import { computed } from 'vue'
const storeApp = appStore()
const inputClass = computed(() => {
  if(storeApp.volumeMode === 'vertical') {
    return ' -rotate-90'
  }else{
    return ''
  }
})
</script>

<template>
  <div class="transform origin-center" :class="inputClass">
    <input type="range">
  </div>
</template>