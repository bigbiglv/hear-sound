<script setup lang="ts">
import { computed } from 'vue'
import audioStore from '@/store/audioStore'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const storeAudio = audioStore()

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
const lyric = computed(() => {
  return storeAudio.lyric.lrc?.split('\n').map(item => {
    const key = `${item.split(']')[0]}`.substring(1)
    const time = formatSeconds(key)
    const words = `${item.split(']')[1]}`
    return {
      time, words
    }
    // 过滤空字段
  }).filter(item => item['words'])
})

const onIndex = computed(() => {

})
</script>

<template>
  <div class="w-full h-3/4 overflow-y-auto flex justify-center ">
    <ul class="w-3/4">
      <li v-for="(lrc,index) in lyric" :key="lrc.time" class="text-center">
        {{ lrc.words }}
      </li>
    </ul>
  </div>
</template>