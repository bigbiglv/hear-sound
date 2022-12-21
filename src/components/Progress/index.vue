<script setup lang="ts">
import { TMode } from '@/store/types';
import { computed, ref } from 'vue'
type Props = {
  modelValue: number,
  max?: number,
  min?: number,
  position?: TMode
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 10,
  min: 0,
  position: 'horizontal' // 默认横向水平
})
const emit = defineEmits(['update:modelValue'])
// 通过 computed 来双向绑定
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', Number(val))
  }
})
// 通过传入的position来确定横向还是纵向
const inputClass = computed(() => {
  if (props.position === 'vertical') {
    return ' -rotate-90'
  }else{
    return ''
  }
})

const percentStyle = computed(() => {
  let result = (value.value / props.max) * 100
  return `width: ${result ? result.toFixed(0) : 0}%`
})

const pointRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="transform origin-center flex justify-center items-center" :class="inputClass">
    <input type="range" v-model="value" :max="props.max" :min="props.min">
  </div>
  <div class="relative h-4 px-2 leading-3">
    <!-- 总长度 --> 
    <div class="absolute bg-light-100 w-full h-2 left-0 top-1/2 transform -translate-y-1/2 leading-3"></div>
    <!-- 已有长度 -->
    <div class="absolute bg-red-500 h-2 left-0 top-1/2 transform -translate-y-1/2 leading-3" :style="percentStyle"></div>
    <!-- 交互圆点 -->
    <div 
      class="absolute w-4 h-4 rounded-full left-0 transform -translate-x-1/2 bg-white shadow-md"
      ref="pointRef"
      >
    </div>
  </div>
</template>