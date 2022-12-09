<script setup lang="ts">
import { computed } from 'vue'
import audioStore from '@/store/audioStore'
import appStore from '@/store/appStore'
const store = audioStore()
const storeApp = appStore()
const percentClass = computed(() => {
  let result = (store.currentTime / store.duration) * 100
  return `width: ${result ? result.toFixed(0) : 0 }%`
})
</script>

<template>
  <div class="px-4 relative flex justify-between items-center cursor-pointer box-border z-10">
    <div class="flex">
      <div class="mr-2 rounded-full overflow-hidden" @click="storeApp.setModal('occupy')">
        <img src="" alt="封面">
      </div>
      <div>
        <p>{{ store.playSong?.name }}</p>
        <p>
          <span v-for="artist in store.playSong?.artists" :key="artist.id"> {{ artist.name }} </span>
        </p>
      </div>
    </div>
    <div class="flex">
      <button @click="store.isPlay ? store.pause() : store.play()">
        {{ store.isPlay ? '暂停' : '播放' }}
      </button>
      <button @click="store.next()">下一曲</button>
    </div>
    <!-- 进度 -->
    <div class="absolute w-full h-1px bottom-0 left-0 opacity-50">
      <div class="h-full bg-red-600" :style="percentClass"></div>
    </div>
  </div>
</template>