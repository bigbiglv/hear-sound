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
import { computed, ref, watch } from 'vue'
import { useElementSize, onClickOutside } from '@vueuse/core'
import { useStyle } from './style'
import { useKeyStroke } from './keyStroke'
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
const emit = defineEmits(['update:modelValue', 'update:drag'])
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

// 外部父元素的宽或者高度 取决于进度条orient是横向还是竖向
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
    // 将视图的值转成百分比再转成 props.modelValue
    let percent = val / context.value
    // 小数位数处理
    const newValue = formatDecimal(percent * props.max)
    progress.value = newValue
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
 * 样式
 */
const { orientClass, fullClass, hasClass, pointClass, pointStyle, hasStyle } = useStyle(props.orient, focused, hasPercent)

/**
 * 键盘监听
 */
useKeyStroke(focused, progress, props.max)

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
  hasValue.value = orient[props.orient]
}
const { isDrag } = useDrag(contextRef, true, {
  touchstart: (e) => {
    changeProgress(e)
    // 焦点
    focused.value = true
  },
  touchmove: changeProgress,
})
// 正在滑动
watch(isDrag, () => {
  emit('update:drag', isDrag.value)
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
    v-bind="$attrs"
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