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
  orient?: TMode
  decimal?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 10,
  min: 0,
  orient: 'horizontal', // 默认横向水平
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
/**
 * class样式 通过props.orient来确定样式
 */
const orientClass = computed(() => {
  const orient = {
    horizontal: 'h-4 w-36',
    vertical: 'h-36 w-4',
  }
  return orient[props.orient]
})
const fullClass = computed(() => {
  const orient = {
    horizontal: 'w-full h-2 -translate-y-1/2 left-0 top-1/2',
    vertical: 'w-2 h-full -translate-x-1/2 bottom-0 left-1/2',
  }
  return orient[props.orient]
})
const hasClass = computed(() => {
  const orient = {
    horizontal: 'h-2 -translate-y-1/2 left-0 top-1/2',
    vertical: 'w-2 -translate-x-1/2 bottom-0 left-1/2',
  }
  return orient[props.orient]
})
const pointClass = computed(() => {
  const orient = {
    horizontal: 'left-0 -translate-x-1/2',
    vertical: 'bottom translate-y-1/2',
  }
  return orient[props.orient]
})
/**
 * style样式
 */
// 交互圆点的left距离style
const pointStyle = computed(() => {
  const orient = {
    horizontal: `left: ${hasPercent.value * 100}%`,
    vertical: `bottom: ${hasPercent.value * 100}%`,
  }
  return orient[props.orient]
})
// 已有距离 宽度style
const hasStyle = computed(() => {
  const orient = {
    horizontal: `width: ${hasPercent.value * 100}%`,
    vertical: `height: ${hasPercent.value * 100}%`,
  }
  return orient[props.orient]
})


/**
 * 圆点移动
 */
const pointRef = ref<HTMLElement | null>(null)
// 滑动的距离
const { x, y } = useDrag(pointRef, { 
  // touchend: onEnd,
  touchmove: onMove 
})
// 根据方向 props.orient 来确定位移取x 还是 y
const slideValue = computed(() => {
  const orient = {
    horizontal: x.value,
    vertical: y.value,
  }
  return orient[props.orient]
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
 * 取值小数位数按props.decimal处理
 */
function formatDecimal(num: number): number{
  // 取整
  if (props.decimal === 0) return parseInt(num.toString())
  // 按 decimal取小数位数
  if (props.decimal > 0) return parseFloat(num.toFixed(props.decimal))
  // 默认是2
  return parseFloat(num.toFixed(2))
}

/**
 * 圆点触摸的事件
 */
// function onEnd() {
//   // 根据滑动距离占的百分比
//   let percent = slideValue.value / contextWidth.value
//   // 小数位数处理
//   hasValue.value = formatDecimal(percent * props.max)
// }

function onMove() {
  // 根据滑动距离占的百分比
  let percent = slideValue.value / contextWidth.value
  // 小数位数处理
  hasValue.value = formatDecimal(percent * props.max)
}

/**
 * 点击进度条
 */
function tabProgress(e: MouseEvent) {
  let percent = e.clientX / contextWidth.value
  // 小数位数处理
  hasValue.value = formatDecimal(percent * props.max)
}
</script>

<template>
  <input type="range" v-model="progress" :max="props.max" :min="props.min" hidden>
  <div
    class="relative m-2"
    :class="orientClass"
    ref="contextRef"
    @click.stop="tabProgress($event)"
  >
    <!-- 总长度 --> 
    <div
      class="absolute bg-light-100 transform rounded-full"
      :class="fullClass"
    >
    </div>
    <!-- 已有长度 -->
    <div
      class="absolute bg-red-500 transform rounded-full"
      :class="hasClass"
      :style="hasStyle"
    >
    </div>
    <!-- 交互圆点 -->
    <div 
      class="absolute w-4 h-4 rounded-full transform bg-white shadow-md"
      :class="pointClass"
      :style="pointStyle"
      ref="pointRef"
      >
    </div>
  </div>
  <p>hasValue: {{ hasValue }}</p>
  <p>progress: {{ progress }} </p>
</template>