<script setup lang="ts">
import { computed, ref } from 'vue'
import audioStore from '@/store/audioStore'
import appStore from '@/store/appStore'
import { storeToRefs } from 'pinia'
import { useElementSize } from '@vueuse/core'
const store = audioStore()
const storeApp = appStore()
const { currentTime, duration, playSong } = storeToRefs(store)
const { modal } = storeToRefs(storeApp)

// 当前modal是不是 normal
const isModalNormal = computed(() => {
  return modal.value === 'normal'
})

// 底部小的进度条显示
const percentStyle = computed(() => {
  let result = (currentTime.value / duration.value) * 100
  return `width: ${result ? result.toFixed(0) : 0 }%`
})
// modal不同状态的样式
const contentClass = computed(() => {
  if(modal.value === 'normal') {
    return 'bottom-0'
  } else if (modal.value === 'occupy') {
    return 'bottom-6'
  }
})

// 隐藏的状态下 监听播放列表的长度判断是否显示
store.$subscribe((mutation, state)=>{
  if (modal.value === 'hidden' && state.playList.length)
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

// 按钮样式
const btnClass = computed(() => {
  const btnClass = modal.value === 'occupy' ? 'w-full px-4' : 'w-20'
  return btnClass
})
</script>

<template>
  <div
    class="w-full h-56px px-4 absolute flex justify-between items-center box-border transition-all duration-300 z-10"
    :class="contentClass"
    @click="storeApp.setModal('occupy')"
  >
    <div class="w-10 h-10 flex-none mr-2 rounded-full overflow-hidden" v-show="isModalNormal">
      <img :src="store.albumCover" alt="封面">
    </div>
    <div class="w-3/5 mr-2 text-dark-600 overflow-hidden" v-show="isModalNormal">
      <!-- 歌曲名 -->
      <p class="text-base whitespace-nowrap" ref="nameBoxRef">
        <span class="inline-block" ref="nameRef">
          {{ playSong?.name }}
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
    <div
      class="h-full flex flex-none justify-between transition-all duration-150"
      :class="btnClass"
      >
      <button @click.stop="store.prev()" v-show="!isModalNormal">上一曲</button>
      <button @click.stop="store.isPlay ? store.pause() : store.play()">
        {{ store.isPlay ? '暂停' : '播放' }}
      </button>
      <button @click.stop="store.next()">下一曲</button>
    </div>
    <!-- 进度 -->
    <div class="absolute w-full h-1px bottom-0 left-0 opacity-50" v-show="isModalNormal">
      <div class="h-full bg-red-600" :style="percentStyle"></div>
    </div>
  </div>
</template>