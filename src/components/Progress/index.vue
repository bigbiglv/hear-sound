<script setup lang="ts">
import { TMode } from '@/store/types';
import { computed, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import useDrag from '@/hooks/useDrag'
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

// 已有距离 宽度style
const usedStyle = computed(() => {
  return `width: ${usedValue.value}px`
})

/**
 * 圆点移动
 */
const pointRef = ref<HTMLElement | null>(null)
// 滑动的距离
const { x } = useDrag(pointRef)
// 外部父元素的宽度
const contextRef = ref<HTMLElement | null>(null)
const { width: contextWidth } = useElementSize(contextRef)

// 根据滑动的距离来限制范围
const usedValue = computed(() => {
  if(x.value < 0) return 0
  if(x.value > contextWidth.value) return contextWidth.value
  return x.value
})
// 交互圆点的left距离style
const pointStyle = computed(() => {
  return `left: ${usedValue.value}px`
})
</script>

<template>
  <!-- <div class="transform origin-center flex justify-center items-center" :class="inputClass">
    <input type="range" v-model="value" :max="props.max" :min="props.min">
  </div> -->
  <div class="relative w-36 mx-10 h-4 leading-3" ref="contextRef">
    <!-- 总长度 --> 
    <div
      class="absolute bg-light-100 w-full h-2 left-0 top-1/2 transform -translate-y-1/2 leading-3"
    >
    </div>
    <!-- 已有长度 -->
    <div class="absolute bg-red-500 h-2 left-0 top-1/2 transform -translate-y-1/2 leading-3" :style="usedStyle"></div>
    <!-- 交互圆点 -->
    <div 
      class="absolute w-4 h-4 rounded-full left-0 transform -translate-x-1/2 bg-white shadow-md"
      :style="pointStyle"
      ref="pointRef"
      >
    </div>
  </div>
</template>