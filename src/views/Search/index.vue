<script setup lang="ts">
import { ref } from 'vue'
import { NSearch } from '@/api/neteasy/types';
import { Search } from '@/api/neteasy';  
const keywords = ref<string>('')
const songList = ref<Array<NSearch.ISongs> | undefined>([])
async function search() {
  const { result } = await Search({keywords: keywords.value}) || {}
  songList.value = result?.songs
}
</script>

<template>
  <div>
    <input type="text" v-model="keywords">
    <button @click="search">搜索</button>
    <ul></ul>
  </div>
</template>