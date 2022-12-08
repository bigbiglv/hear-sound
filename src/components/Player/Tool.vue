<script setup lang="ts">
import audioStore from '@/store/audioStore'
const store = audioStore()
</script>

<template>
  <div class="px-4 flex justify-between cursor-pointer">
    <div class="flex">
      <div class="mr-2">
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
  </div>
</template>