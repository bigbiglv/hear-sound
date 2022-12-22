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


/**
 * 圆点移动
 */
const pointRef = ref<HTMLElement | null>(null)
// 滑动的距离
const { x } = useDrag(pointRef, { touchend: onEnd, touchmove: onMove })
// 外部父元素的宽度
const contextRef = ref<HTMLElement | null>(null)
const { width: contextWidth } = useElementSize(contextRef)

// 根据滑动的距离来限制范围
const hasValue = computed(() => {
  if(x.value < 0) return 0
  if(x.value > contextWidth.value) return contextWidth.value
  return x.value
})

// const hasValue = computed({
//   get(){
//     console.log('get')
//     // 限制props传递进来value值范围在 0~max
//     if(value.value > props.max) return contextWidth.value
//     if(value.value < 0) return 0
//     // 根据传入数值在视图的占比 hasPercent来得到对应的值
//     return hasPercent.value * contextWidth.value
//   },
//   set() {
//     console.log('set')
//     // if (x.value < 0) {
//     //   hasValue.value = 0
//     // }else if (x.value > contextWidth.value){
//     //   hasValue.value = contextWidth.value
//     // }else{
//     //   hasValue.value = x.value
//     // }
    
//   }
// })
  


/**
 * 一个value单位 在视图中的百分比占比
 */ 
const percentTovalue = computed(() => {
  return parseFloat((contextWidth.value / props.max).toFixed(2)) / contextWidth.value
})

/**
 * 已有值的百分比
 */
const hasPercent = computed<number>(() => {
  // 根据props传入的值 乘 一个value的百分比
  let percent: number = value.value * percentTovalue.value
  //限制百分比在 0 ~ 1
  percent > 1 && (percent = 1)
  percent < 0 && (percent = 0)
  return percent
})

/**
 * style
 */
// 交互圆点的left距离style
const pointStyle = computed(() => {
  // return `left: ${hasValue.value}px`
  return `left: ${hasPercent.value * 100}%`
})
// 已有距离 宽度style
const hasStyle = computed(() => {
  // return `width: ${hasValue.value}px`
  return `width: ${hasPercent.value * 100}%`
})

/**
 * 圆点结束触摸的事件
 */
function onEnd() {
  let newValue = x.value
  if (x.value < 0) newValue = 0
  if (x.value > contextWidth.value) newValue = contextWidth.value
  console.log('圆点', newValue * percentTovalue.value, x.value)
  // 触摸停止设置props传递的value值
  value.value = parseInt( (newValue * percentTovalue.value).toString())
  // value.value = newValue * percentTovalue.value

}

function onMove() {
  let newValue = x.value
  if (x.value < 0) newValue = 0
  if (x.value > contextWidth.value) newValue = contextWidth.value
  console.log('圆点', newValue * percentTovalue.value, x.value)
  // 触摸停止设置props传递的value值
  value.value = newValue * percentTovalue.value
}

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
    <div class="absolute bg-red-500 h-2 left-0 top-1/2 transform -translate-y-1/2 leading-3" :style="hasStyle"></div>
    <!-- 交互圆点 -->
    <div 
      class="absolute w-4 h-4 rounded-full left-0 transform -translate-x-1/2 bg-white shadow-md"
      :style="pointStyle"
      ref="pointRef"
      >
    </div>
  </div>
  <p>hasPercent = {{ hasPercent }}</p>
  <p>'max' = {{  max }}</p>
  <p>'hasPercent * max' = {{  hasPercent * max }}</p>
</template>