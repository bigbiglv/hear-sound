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
  return dayjs.duration(time).format(forMat)
}
const currentTimeFormat = computed(() => {
  return forMatTime(currentTime.value)
})
const durationTimeFormat = computed(() => {
  return forMatTime(durationTime.value)
})
</script>

<template>
  <div class="w-full">
    <Progress :max="durationTime" :min="0" v-model="currentTime" />
    <div class="w-full flex justify-between items-center text-dark-50 text-xs">
      <span>{{ currentTimeFormat }}</span>
      <span>{{ durationTimeFormat }}</span>
    </div>
  </div>
</template>