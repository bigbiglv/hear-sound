/**
 * progress class和style 的调整
 */
import { computed, unref } from "vue"
import type { Ref } from 'vue'
export function useStyle(orient: string | Ref<string>, focused: boolean | Ref<Boolean>, hasPercent?: number | Ref<number>){
  const newOrient = unref(orient)
  const newFocused = unref(focused)
  const newHasPercent = unref(hasPercent)
  const orientClass = computed(() => {
    const orientClass = {
      horizontal: 'h-4 w-36',
      vertical: 'h-36 w-4',
    }
    return orientClass[newOrient]
  })
  const fullClass = computed(() => {
    const orientClass = {
      horizontal: 'w-full h-2 -translate-y-1/2 left-0 top-1/2',
      vertical: 'w-2 h-full -translate-x-1/2 bottom-0 left-1/2',
    }
    return orientClass[newOrient]
  })
  const hasClass = computed(() => {
    const orientClass = {
      horizontal: 'h-2 -translate-y-1/2 left-0 top-1/2',
      vertical: 'w-2 -translate-x-1/2 bottom-0 left-1/2',
    }
    return orientClass[newOrient]
  })
  const pointClass = computed(() => {
    // 方向样式
    const orientClass = {
      horizontal: 'left-0 -translate-x-1/2',
      vertical: 'bottom translate-y-1/2',
    }
    // 焦点样式
    const focusClass = newFocused ? 'shadow-md' : 'shadow'
    return `${orientClass[newOrient]} ${focusClass}`
  })

  // // 交互圆点的left距离style
  // const pointStyle = computed(() => {
  //   const orientStyle = {
  //     horizontal: `left: ${newHasPercent * 100}%`,
  //     vertical: `bottom: ${newHasPercent * 100}%`,
  //   }
  //   return orientStyle[newOrient]
  // })
  // // 已有距离 宽度style
  // const hasStyle = computed(() => {
  //   const orientStyle = {
  //     horizontal: `width: ${newHasPercent * 100}%`,
  //     vertical: `height: ${newHasPercent * 100}%`,
  //   }
  //   return orientStyle[newOrient]
  // })
  return {
    orientClass,
    fullClass,
    hasClass,
    pointClass,
    // pointStyle,
    // hasStyle,
  }
}