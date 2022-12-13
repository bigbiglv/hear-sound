<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import Volume from '@/components/Volume/index.vue'
import audioStore from '@/store/audioStore';
import { onMounted } from 'vue'
const store = audioStore()
onMounted(() => {
  // 创建audio web api
  store.createAudioContext()
})
</script>

<template>
  <RouterView />
  <Modal />
  <Volume />
</template>

