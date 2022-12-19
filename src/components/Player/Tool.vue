<script setup lang="ts">
import { computed, ref } from 'vue'
import audioStore from '@/store/audioStore'
import appStore from '@/store/appStore'
import { useElementSize } from '@vueuse/core'
const store = audioStore()
const storeApp = appStore()
const percentClass = computed(() => {
  let result = (store.currentTime / store.duration) * 100
  return `width: ${result ? result.toFixed(0) : 0 }%`
})
// modal不同状态的样式
const contentClass = computed(() => {
  if(storeApp.modal === 'normal') {
    return 'bottom-0'
  }else if (storeApp.modal === 'occupy') {
    return 'bottom-6'
  }
})

// 隐藏的状态下 监听播放列表的长度判断是否显示
store.$subscribe((mutation, state)=>{
  if (storeApp.modal === 'hidden' && state.playList.length)
    storeApp.setModal('normal')
})

// 名称滚动
const nameBoxRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const { width: nameBoxWidth } = useElementSize(nameBoxRef)
const { width: nameWidth } = useElementSize(nameRef)
// 是否名字过长无法全部显示
const isLongName = computed(() => {
  return nameBoxWidth < nameWidth
})
</script>

<template>
  <div
    class="w-full h-16 px-4 absolute flex justify-between items-center box-border transition-all duration-300 z-10"
    :class="contentClass"
    @click="storeApp.setModal('occupy')"
  >
    <div class="w-10 h-10 flex-none mr-2 rounded-full overflow-hidden">
      <img src="" alt="封面">
    </div>
    <div class="w-3/5 mr-2 text-dark-600 overflow-hidden">
      <!-- 歌曲名 -->
      <p class="text-base whitespace-nowrap" ref="nameBoxRef">
        <span class="inline-block" ref="nameRef">
          {{ store.playSong?.name }}
        </span>
      </p>
      <!-- 歌手名 -->
      <!-- <p class="text-sm">
        <span 
          class="mr-1"  
          v-for="artist in store.playSong?.artists" 
          :key="artist.id"
        >
          {{ artist.name }}
        </span>
      </p> -->
    </div>
    <div class="w-20 h-full flex flex-none">
      <button @click.stop="store.isPlay ? store.pause() : store.play()">
        {{ store.isPlay ? '暂停' : '播放' }}
      </button>
      <button @click.stop="store.next()">下一曲</button>
    </div>
    <!-- 进度 -->
    <div class="absolute w-full h-1px bottom-0 left-0 opacity-50" v-show="storeApp.modal === 'normal'">
      <div class="h-full bg-red-600" :style="percentClass"></div>
    </div>
  </div>
</template>