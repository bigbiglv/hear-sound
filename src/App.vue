<script setup lang="ts">
import Modal from '@/components/Player/Modal.vue';
import audioStore from '@/store/audioStore';
import { onMounted, ref } from 'vue'
const store = audioStore()
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  // 创建audio web api
  store.createAudioContext()
})
function play(){
  store.play().then(()=>{
    store.draw?.(canvas.value, 128)
  })
}
</script>

<template>
  <RouterView />
  <Modal />
  <div @click="play">播放</div>
  <div @click="store.pause">暂停</div>
  <div @click="store.prev">上一曲</div>
  <div @click="store.next">下一曲</div>
  <div @click="store.setCurrentTime(50)">50</div>
  <canvas ref="canvas"></canvas>
</template>

