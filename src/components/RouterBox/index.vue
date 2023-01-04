<script setup lang="ts">
/**
 * 路由跳转时有一个元素变大的过渡效果
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import dynamics from 'dynamics.js'
type Props = {
  to: string,
}
const props = withDefaults(defineProps<Props>(), {
  to: '/',
})
const router = useRouter()
const box = ref<HTMLElement | null>(null)
function startAnimation() {
  // 获取当前点击元素相对视口的位置以及宽高
  const rect = box.value?.getBoundingClientRect()
  // 元素与视口右边的距离
  const right = window.innerWidth - (rect?.right || 0)
  // 左右距离边距较短的距离
  const minMargin = (rect?.left || 0) > right ? right : (rect?.left || 0)
  console.log(minMargin)
  dynamics.animate(box.value, {
    position: 'fixed',
    left: `${rect?.left}px`,
    top: `${rect?.top}px`,
    zIndex: 1000,
  },
  {
    type: dynamics.linear,
    duration: 10,
    complete: () => {
      dynamics.animate(box.value, {
        /**
         * 先根据距离边距最小距离将宽度展开
         * 高度直接变化到一屏
         * top顶部距离取原先元素距离的一半
         */
        width: `${window.innerWidth - minMargin * 2}px`,
        left: `${minMargin}px`,
        top: `${(rect?.top || 0) / 2}px`,
        height: `${window.innerHeight}px`
      },
      {
        type: dynamics.linear,
        duration: 100,
        complete: () => {
          dynamics.animate(box.value, {
            width: `${window.innerWidth}px`,
            left: 0,
            top: 0,
            height: `${window.innerHeight}px`
          },
          {
            type: dynamics.spring,
            duration: 600,
            friction: 400,
            complete: () => {
              router.push(props.to)
            }
          })
        }
      })
    }
  })
}

</script>

<template>
  <div ref="box" @click="startAnimation">
    <slot />
  </div>
</template>