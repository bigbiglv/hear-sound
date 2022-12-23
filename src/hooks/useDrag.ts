/**
 * 返回出手指在输入元素的滑动方向的数值
 */
import { ref, unref, onMounted } from 'vue'
import type { Ref } from 'vue'
type TElement = Ref<HTMLElement | null> | HTMLElement | null
type TOptions = {
  touchstart?: (e: TouchEvent) => void
  touchmove?: (e: TouchEvent) => void
  touchend?: (e: TouchEvent) => void
}
export default function useDrag(el: TElement, options?: TOptions) {
  // 两个轴的滑动距离
  const x = ref(0)
  const y = ref(0)
  // 一开始点击的位置
  const startX = ref(0)
  const startY = ref(0)
  // touch的状态
  const isDrag = ref(false)
  onMounted(() => {
    const element = unref(el)
    element?.addEventListener('touchstart', (e:TouchEvent)=>{
      // 阻止默认行为
      e.preventDefault()
      // 获取当前位置 
      // clientX, clientY 分别为距离屏幕左边 上边的距离
      // 减去上一次触摸的最后停止位置 x.value y.value第二次触摸的起始位置才能正确
      // console.log(e)
      startX.value = e.touches[0].clientX - x.value
      startY.value = e.touches[0].clientY - y.value
      options?.touchstart?.(e)
    })
    element?.addEventListener('touchmove', (e)=>{
      e.stopPropagation()
      // 移动的时候将最初点击的位置作为基准 当前位置减去最初的值就是移动的距离
      let X = e.touches[0].clientX - startX.value
      let Y = e.touches[0].clientY - startY.value
      if(isDrag.value) {
        // 超出当前元素的范围阻止默认事件会报错
        if(e.cancelable) e.preventDefault()
        // 赋值给x y
        x.value = X
        y.value = Y
        options?.touchmove?.(e)
        return
      }
      //偏移量大于20才算滑动 事实上这里是先执行的
      if(Math.abs(X) > 20 || Math.abs(Y) > 20) {
        isDrag.value = true
      }
    })
    element?.addEventListener('touchend', (e)=>{
      // startX.value = 0
      // startY.value = 0
      isDrag.value = false
      options?.touchend?.(e)
    })
  })

  /*
  * 负数时向上/向左 
  * 正数时向下/向右
  */ 
  return{
    x,
    y,
    isDrag
  }
}