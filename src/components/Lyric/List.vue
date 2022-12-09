<script setup lang="ts">
import { computed } from 'vue'
import audioStore from '@/store/audioStore'
const storeAudio = audioStore()
const lyric = computed(() => {
  let arr: Array<object>
  console.log(storeAudio.lyric.lrc)
  console.log(storeAudio.lyric.lrc?.split('\n'))
  return storeAudio.lyric.lrc
})
</script>

<template>

</template>