<script setup lang="ts">
import Progress from '@/components/Progress/index.vue'
import audioStore from '@/store/audioStore'
import { storeToRefs } from 'pinia'
const { currentTime, duration } = storeToRefs(audioStore())
</script>

<template>
  <div class="w-full">
    <Progress :max="10" :min="0" v-model="currentTime" />
    <div class="w-full flex justify-between items-center text-dark-50 text-xs">
      <span>{{ currentTime || '00:00' }}</span>
      <span>{{ duration || '00:00'}}</span>
    </div>
  </div>
</template>