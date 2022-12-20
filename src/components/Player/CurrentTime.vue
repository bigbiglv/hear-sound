<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import Progress from '@/components/Progress/index.vue'
import audioStore from '@/store/audioStore'
import { storeToRefs } from 'pinia'
dayjs.extend(duration)
const { currentTime, duration: durationTime } = storeToRefs(audioStore())
// 时间戳格式化显示
function forMatTime(time: number) {
  const hasHour: boolean = dayjs.duration(time).asHours() >= 1
  const forMat: string = hasHour ? 'HH:mm:ss' : 'mm:ss'
  return dayjs.duration(Number(time.toFixed(0)) * 1000).format(forMat)
}
// 当前播放的时间
const currentTimeFormat = computed(() => {
  return forMatTime(currentTime.value)
})
// 音乐总时长
const durationTimeFormat = computed(() => {
  return forMatTime(durationTime.value)
})
// 当前进度
const progress = computed({
  get(){
    // 值来自audioStore的音乐进度
    return currentTime.value
  },
  set(val){
    // 改变的时候调用改变进度
    audioStore().setCurrentTime(Number(val))
  }
})
</script>

<template>
  <div class="w-full">
    <Progress :max="durationTime" :min="0" v-model="progress" />
    <div class="w-full flex justify-between items-center text-dark-50 text-xs">
      <span>{{ currentTimeFormat }}</span>
      <span>{{ durationTimeFormat }}</span>
    </div>
  </div>
</template>