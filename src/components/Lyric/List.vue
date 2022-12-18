<script setup lang="ts">
import { computed } from 'vue'
import audioStore from '@/store/audioStore'
const storeAudio = audioStore()
const lyric = computed(() => {
  return storeAudio.lyric.lrc?.split('\n').map(item => {
    let key = `${item.split(']')[0]}]`
    let value = `${item.split(']')[1]}`
    return [
      key,value
    ]
  })
})
</script>

<template>
  <div class="w-full h-64 overflow-y-auto flex justify-center ">
    <ul class="w-3/4">
      <li v-for="lrc in lyric" class="text-center">
        {{ lrc[1] }}
      </li>
    </ul>
  </div>
</template>