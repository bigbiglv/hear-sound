<script setup lang="ts">
import { computed } from 'vue'
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

const onTime = computed(() => {
  const arr = lyricList.value?.filter(el => el.time <= currentTime.value)
  console.log(arr)
  return arr?.[arr.length - 1].time
})
</script>

<template>
  <div class="w-full h-3/4 overflow-y-auto flex justify-center">
    <ul class="w-3/4">
      <li 
        v-for="lrc in lyricList" 
        :key="lrc.time" 
        class="text-center"
        :class="{ 'text-yellow-300': onTime === lrc.time}"
        >
        {{ lrc.words }}
      </li>
    </ul>
  </div>
</template>