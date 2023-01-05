<script setup lang="ts">
import centerBox from '@/components/RouterBox/index.vue'
</script>

<template>
  <div class="h-1000px flex flex-wrap w-full justify-around">
    <router-link
      class="w-screen h-11 fixed top-0 left-0 flex justify-center items-center bg-white shadow-md rounded-b-lg z-10"
      to="/search">
      <div class=" w-13/14 h-4/5 bg-light-500 rounded-full"></div>
    </router-link>
    <centerBox v-for="item in 10" class="bg-light-600 w-100px h-9" to="/artist">
      <div>
        {{ item }}
      </div>
    </centerBox>
  </div>
</template>