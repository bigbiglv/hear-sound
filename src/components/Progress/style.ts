/**
 * progress class和style 的调整
*/
import { TMode } from '@/store/types';
import { computed } from "vue"
import type { Ref } from 'vue'
export function useStyle(orient: TMode, focused: Ref<Boolean>, hasPercent: Ref<number>){

  const orientClass = computed(() => {
    const orientClass = {
      horizontal: 'h-4 w-36',
      vertical: 'h-36 w-4',
    }
    return orientClass[orient]
  })
  const fullClass = computed(() => {
    const orientClass = {
      horizontal: 'w-full h-2 -translate-y-1/2 left-0 top-1/2',
      vertical: 'w-2 h-full -translate-x-1/2 bottom-0 left-1/2',
    }
    return orientClass[orient]
  })
  const hasClass = computed(() => {
    const orientClass = {
      horizontal: 'h-2 -translate-y-1/2 left-0 top-1/2',
      vertical: 'w-2 -translate-x-1/2 bottom-0 left-1/2',
    }
    return orientClass[orient]
  })
  const pointClass = computed(() => {
    // 方向样式
    const orientClass = {
      horizontal: 'left-0 -translate-x-1/2',
      vertical: 'bottom translate-y-1/2',
    }
    // 焦点样式
    const focusClass = focused.value ? 'shadow-md' : 'shadow'
    return `${orientClass[orient]} ${focusClass}`
  })

  // 交互圆点的left距离style
  const pointStyle = computed(() => {
    const orientStyle = {
      horizontal: `left: ${hasPercent.value * 100}%`,
      vertical: `bottom: ${hasPercent.value * 100}%`,
    }
    return orientStyle[orient]
  })
  // 已有距离 宽度style
  const hasStyle = computed(() => {
    const orientStyle = {
      horizontal: `width: ${hasPercent.value * 100}%`,
      vertical: `height: ${hasPercent.value * 100}%`,
    }
    return orientStyle[orient]
  })
  return {
    orientClass,
    fullClass,
    hasClass,
    pointClass,
    pointStyle,
    hasStyle,
  }
}