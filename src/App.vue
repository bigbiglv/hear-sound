<script setup lang="ts">
import audioStore from '@/store/audioStore';
import { onMounted, ref } from 'vue'
const store = audioStore()
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  // 创建audio web api
  store.createAudioContext()
  store.setAudioSrc('http://127.0.0.1:5501/pink.flac')
})
async function play(){
  // 如果audioContext没有开启 先开启
  if ( store.audioContext?.state !== 'running') {
    await store.audioContext?.resume()
  }
  // 非暂停状态不触发draw事件 
  if (!store.mediaElement?.paused) return 
  store.mediaElement?.play()
  store.draw?.(canvas.value)
}
function pause(){
  if (store.mediaElement?.paused) return 
  store.mediaElement?.pause()
  // 停止绘制
  store.cancelDraw?.()
}
</script>

<template>
  <RouterView />
  <div @click="play">play</div>
  <div @click="pause">pause</div>
  <canvas ref="canvas"></canvas>
</template>

