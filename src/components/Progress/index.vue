<!-- 
  通过`v-model`双向绑定从组件外部传`props.modelValue`
  `modelValue`双向绑定是通过`computed`的`get`和`set`传递给`progress`
  `hasValue`: 是**实际**的滑动的距离（视图中的大小）
              通过`computed`的`get`和`set`将数据**转换**同步到`progress`
  `modelValue` => `progress` => `hasValue` => `progress` => `modelValue`
  垂直模式滑动距离的取值需要使用高度context减去y 因为默认是进度条顶部为0往下数值越大
  所以当进度条底部为基准0时就要使用高度context减去取得反转后的数值
 -->
<script setup lang="ts">
import { TMode } from '@/store/types';
import { computed, ref } from 'vue'
import { useElementSize, onKeyStroke, onClickOutside } from '@vueuse/core'
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
  // 方向样式
  const orient = {
    horizontal: 'left-0 -translate-x-1/2',
    vertical: 'bottom translate-y-1/2',
  }
  // 焦点样式
  const focusClass = focused.value ? 'shadow-md' : 'shadow'
  return `${orient[props.orient]} ${focusClass}`
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

// 外部父元素的宽高度
const contextRef = ref<HTMLElement | null>(null)
const { width: contextWidth, height: contextHeight } = useElementSize(contextRef)
// 根据组件 orient 判断使用 宽还是高
const context = computed(() => {
  const orient = {
    horizontal: contextWidth.value,
    vertical: contextHeight.value,
  }
  return orient[props.orient]
})

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
    console.log('set', val)
    progress.value = val
  }
})

/**
 * 一个progress值在视图中对应的值
 */
const progressToView = computed(() => {
  return context.value / props.max
})

/**
 * 已有值对应视图的百分比
 */
const hasPercent = computed<number>(() => {
  return hasValue.value / context.value
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


// 焦点
const focused = ref<boolean>(false)
/**
 * 键盘监听
 */
function addValue(e: Event) {
  if (!focused.value) return
  e.preventDefault()
  progress.value < props.max && (progress.value += 1)
}
function pausedValue(e: Event) {
  if (!focused.value) return
  e.preventDefault()
  progress.value > 0 && (progress.value -= 1)
}
onKeyStroke(['w', 'W', 'ArrowUp'], (e: KeyboardEvent) => {
  addValue(e)
})
onKeyStroke(['s', 'S', 'ArrowDown'], (e: KeyboardEvent) => {
  pausedValue(e)
})
onKeyStroke(['a', 'A', 'ArrowLeft'], (e: KeyboardEvent) => {
  pausedValue(e)
})
onKeyStroke(['d', 'D', 'ArrowRight'], (e: KeyboardEvent) => {
  addValue(e)
})

/**
 * 改变进度条进度
 */
function changeProgress(e: TouchEvent) {
  const orient = {
    // 减去父元素距离边界的距离 为当前位置相对父元素的距离
    horizontal: e.touches[0].clientX - (contextRef.value?.getBoundingClientRect().left || 0),
    // 还需要使用 context 减去 因为进度条底部为0 如果是顶部为0就不用
    vertical: context.value - (e.touches[0].clientY - (contextRef.value?.getBoundingClientRect().top || 0)),
  }
  let percent = orient[props.orient] / context.value
  // 小数位数处理
  hasValue.value = formatDecimal(percent * props.max)
}
useDrag(contextRef, {
  touchstart: (e) => {
    changeProgress(e)
    // 焦点
    focused.value = true
  },
  touchmove: changeProgress,
})
// 点击外部取消焦点
onClickOutside(contextRef, (event) => {
  focused.value = false
})
</script>

<template>
  <input type="range" v-model="progress" :max="props.max" :min="props.min" hidden>
  <div
    class="relative m-2"
    :class="orientClass"
    ref="contextRef"
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
      class="absolute w-4 h-4 rounded-full transform bg-white"
      :class="pointClass"
      :style="pointStyle"
      >
    </div>
  </div>
</template>