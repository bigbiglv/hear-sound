<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import audioStore from '@/store/audioStore'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { storeToRefs } from 'pinia'

dayjs.extend(duration)
const storeAudio = audioStore()
const { currentTime, lyric } = storeToRefs(storeAudio)
// 时长转秒数 '00:01:00' => 60
function formatSeconds(time: string): number {
  const hasHour = time.split(":").length === 3
  let hours: number
  let minutes: number
  let seconds: number
  if(hasHour){
    hours = Number(time.split(":")?.[0])
    minutes = Number(time.split(":")?.[1])
    seconds = parseInt(time.split(":")?.[2])
  }else{
    hours = 0
    minutes = Number(time.split(":")?.[0])
    seconds = parseInt(time.split(":")?.[1])
  }
  // 转化之后的秒数
  const durationToseconds = dayjs.duration({
    hours,
    minutes,
    seconds,
  }).as('seconds')
  return durationToseconds
}
// 歌词数组转格式 [ {time, words} ]
const lyricList = computed(() => {
  return lyric.value.lrc?.split('\n').map(item => {
    const key = item && `${item.split(']')[0]}`.substring(1)
    const time = formatSeconds(key)
    const words = item && `${item.split(']')[1]}`
    return {
      time, words
    }
    // 过滤空字段
  }).filter(item => item['words'])
})

// 当前播放的时间对应lyricList的time
const onTime = computed(() => {
  const arr = lyricList.value?.filter(el => el.time <= currentTime.value)
  return arr?.[arr.length - 1]?.time
})

/**
 * 歌词变化时滚动
 */
// 最外层元素的Ref
const contextRef = ref<HTMLElement | null>(null)
// 里层ul元素
const ulRef = ref<HTMLElement | null>(null)
// 监听歌词位置变化
watch(onTime, () => {
  // 变化调整居中位置
  scrollCenter()
})

/**
 * 歌词滚动至居中位置
 */
// 是否正在手动拉动歌词
const isScroll = ref(false)
function scrollCenter() {
  // 手动拖动的时候不执行
  if (isScroll.value) return
  // 每一句的歌词dom的集合
  const liList = ulRef.value?.children
  // 当句歌词的下标
  const index = lyricList.value?.findIndex((lyr) => lyr.time === onTime.value) || 0
  // 当句歌词的dom
  const li = liList?.[index] as HTMLElement
  const ulTop = ulRef.value?.offsetTop
  // 当前歌词距离父元素 ul顶部的距离
  const liTop = ulTop ? li?.offsetTop - ulTop : 0
  const liHeight = li?.offsetHeight || 0
  // 最外层容器高度
  const contextHeight = contextRef.value?.offsetHeight || 0
  // 滚动距离顶部的距离 居中
  const top = liTop - contextHeight / 2 - liHeight / 2
  contextRef.value?.scrollTo({
    top,
    behavior: 'smooth'
  })
}
onMounted(() => {
  // 每次刚加载都刷新一次
  scrollCenter()
})


</script>

<template>
  <div
    class="w-full h-3/4 overflow-y-auto flex justify-center"
    ref="contextRef"
    @touchstart="isScroll = true"
    @touchmove="(e) => e.stopPropagation()"
    @touchend="isScroll = false"
    >
    <ul class="w-3/4" ref="ulRef">
      <li 
        v-for="lrc in lyricList" 
        :key="lrc.time" 
        class="text-center"
        :class="{'text-yellow-300': onTime === lrc.time}"
        >
        {{ lrc.words }}
      </li>
    </ul>
  </div>
</template>