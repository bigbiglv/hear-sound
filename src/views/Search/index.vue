<script setup lang="ts">
import { ref } from 'vue'
import audioStore from '@/store/audioStore';
import { NSearch } from '@/api/neteasy/types';
import { Search } from '@/api/neteasy';
const store = audioStore()
const keywords = ref<string>('赛博朋克')
const songList = ref<Array<NSearch.ISongs> | undefined>([])
async function search() {
  const { result } = await Search({keywords: keywords.value}) || {}
  songList.value = result?.songs
}
function addPlay(song: NSearch.ISongs) {
  store.addSong(song, true)
}
</script>

<template>
  <div>
    <input type="text" v-model="keywords">
    <button @click="search">搜索</button>
    <ul>
      <li v-for="song in songList" :key="song.id" class="mb-4" @click="addPlay(song)">
        <p>
          {{ song.name }} 
        </p>
        <p>
          <span v-for="art in song.artists">{{ art.name }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>