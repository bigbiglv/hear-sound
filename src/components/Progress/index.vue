<!-- 
  通过`v-model`双向绑定从组件外部传`props.modelValue`
  `modelValue`双向绑定是通过`computed`的`get`和`set`传递给`progress`
  `hasValue`: 是**实际**的滑动的距离（视图中的大小）
              通过`computed`的`get`和`set`将数据**转换**同步到`progress`
  `modelValue` => `progress` => `hasValue` => `progress` => `modelValue`
 -->
<script setup lang="ts">
import { TMode } from '@/store/types';
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import useDrag from '@/hooks/useDrag'
type Props = {
  modelValue: number,
  max?: number,
  min?: number,
  position?: TMode
  decimal?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 10,
  min: 0,
  position: 'horizontal', // 默认横向水平
  decimal: 2,  // 小数点位数
})
const emit = defineEmits(['update:modelValue'])
// 通过 computed 来对props.modelValue进行双向绑定
const progress = computed({
  get() {
    // 限制 modelValue 的范围在 0~max
    if (props.modelValue > props.max) return props.max
    if (props.modelValue < 0) return 0
    return props.modelValue
  },
  set(val) {
    // 将值赋通过emit事件传递到组件外的 v-model改变modelValue
    // modelValue一改变就会通过 get() 改变 progress的值
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
const { x } = useDrag(pointRef, { 
  // touchend: onEnd,
  touchmove: onMove 
})
// 外部父元素的宽度
const contextRef = ref<HTMLElement | null>(null)
const { width: contextWidth } = useElementSize(contextRef)

/**
 * 已有值对应视图中的实际数值
 */
const hasValue = computed({
  get(){
    // 计算当前progressToView对应视图中的大小
    return progressToView.value * progress.value
  },
  set(val) {
    // 赋值给 value 把值和value绑定 value又和modelValue绑定
    // hasValue => progress => modelValue
    progress.value = val
  }
})

/**
 * 一个progress值在视图中对应的值
 */
const progressToView = computed(() => {
  return contextWidth.value / props.max
})

/**
 * 已有值对应视图的百分比
 */
const hasPercent = computed<number>(() => {
  return hasValue.value / contextWidth.value
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
 * 圆点触摸的事件
 */
// function onEnd() {
//   let newValue = x.value
//   if (newValue > contextWidth.value) newValue = contextWidth.value
//   if (newValue < 0) newValue = 0
//   let percent = newValue / contextWidth.value
//   if (props.decimal === 0) {
//     hasValue.value = parseInt((percent * props.max).toString())
//   } else if (props.decimal > 0) {
//     hasValue.value = parseFloat((percent * props.max).toFixed(props.decimal))
//   } else {
//     hasValue.value = parseFloat((percent * props.max).toFixed(2))
//   }
// }

function onMove() {
  // 根据滑动距离占的百分比
  let percent = x.value / contextWidth.value
  // 值是否为小数
  if (props.decimal === 0){
    // 取整
    hasValue.value = parseInt((percent * props.max).toString())
  }else if(props.decimal > 0){
    // 取 decimal 位小数
    hasValue.value = parseFloat((percent * props.max).toFixed(props.decimal))
  }else{
    // 默认 2 位
    hasValue.value = parseFloat((percent * props.max).toFixed(2))
  }
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