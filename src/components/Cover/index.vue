<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import audioStore from '@/store/audioStore'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
const { albumCover, analyser } = storeToRefs(audioStore())

type Props = {
  radius: number,
  padding: number
}
const props = withDefaults(defineProps<Props>(), {
  radius: 80,
  padding: 10
})

// 图片宽高
const imgRadius = computed(() => {
  return props.radius - props.padding * 2
})
const canvas = ref<HTMLCanvasElement | null>(null)
// onMounted(() => {
//   createCover()
// })

audioStore().$subscribe((mutation, state) => {
  if (state.albumCover) createCover()
  if (state.isPlay){
    // 重新开始绘制
    isDraw.value && draw(cover) 
  }else{
    // 停止绘制
    cancelDraw(drawId.value)
  }
})

const bufferLength = computed(() => {
  return analyser.value!.frequencyBinCount
})

// 是否正在绘制
const isDraw = ref(false)
/**
 * 初始化图片
 */
let cover: HTMLImageElement
function createCover(){
  if (!albumCover.value) return
  cover = new Image(imgRadius.value, imgRadius.value)
  cover.src = `${albumCover.value}?${dayjs().unix()}`
  // 允许图片跨域
  cover.setAttribute('crossOrigin', '');
  cover.onload = () => {
    // 开始绘制
    draw(cover)
  }
}
const drawId = ref<number | null>(null)
/**
 * 绘制
 */
function draw(cover: HTMLImageElement) {
  const context = canvas.value?.getContext('2d')
  drawId.value = requestAnimationFrame(() => draw(cover))
  // 清除画布
  context?.clearRect(0, 0, props.radius, props.radius)
  // 绘制圆形动效
  drawCircles(context, cover)
  // 绘制图片
  drawImage(context, cover)

  isDraw.value = true
}
/**
 * 绘制外围圆圈动效
 */
function drawCircles(context: CanvasRenderingContext2D | null | undefined, cover: HTMLImageElement){
  analyser.value!.fftSize = 32
  const dataArray = new Uint8Array(bufferLength.value)
  analyser.value?.getByteFrequencyData(dataArray)

  context?.save()
  context?.beginPath();
  // 圆圈的圆心和半径
  const circleCenter: [number, number] = [props.radius / 2, props.radius / 2]
  const radius = props.radius / 2 - props.padding -2

  for (let i = 0; i < bufferLength.value; i++) {
    let p = dataArray[i] / 255
    let m = Math.round(p * props.padding)
    context?.arc(...circleCenter, radius + m, 0, 2 * Math.PI)
    context!.strokeStyle = getMainColor(context) ||'#000'
    context!.filter = 'blur(1px)'
    context!.globalAlpha  = 0.5
  }
  context?.stroke()
  context?.restore()
}
/**
 * 绘制图片并裁剪
 */
function drawImage(context: CanvasRenderingContext2D | null | undefined, cover: HTMLImageElement) {
  context?.save()
  // 画一个圆形裁剪
  context?.beginPath();
  // 裁剪的圆圈的圆心和半径
  const circleCenter: [number, number] = [props.radius / 2, props.radius / 2]
  const radius = props.radius / 2 - props.padding
  context?.arc(...circleCenter, radius, 0, 2 * Math.PI)
  context?.clip()
  // 在裁剪的范围内显示图片
  context?.drawImage(cover, props.padding, props.padding, imgRadius.value, imgRadius.value)
  // mainColor.value = getMainColor(context)
  context?.restore()
}
/**
 * 图片的主色调
 */
function getMainColor(context: CanvasRenderingContext2D | null | undefined) {
  const data = context?.getImageData(props.padding, props.padding, imgRadius.value, imgRadius.value).data
  let r = 0
  let g = 0
  let b = 0
  // 取所有像素的平均值
  for (let row = 0; row < imgRadius.value; row++) {
    for (let col = 0; col < imgRadius.value; col++) {
      r += data ? data[(imgRadius.value * row + col) * 4] : 0
      g += data ? data[(imgRadius.value * row + col) * 4 + 1] : 0
      b += data ? data[(imgRadius.value * row + col) * 4 + 2] : 0
    }
  }
  // 求取平均值
  r /= imgRadius.value * imgRadius.value
  g /= imgRadius.value * imgRadius.value
  b /= imgRadius.value * imgRadius.value

  // 将最终的值取整
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  return `rgb(${r},${g},${b})`
}

/**
 * 停止绘制
 */
function cancelDraw(drawId: number | null) {
  setTimeout(() => {
    drawId && cancelAnimationFrame(drawId)
  }, 800);
}
</script>

<template>
  <canvas ref="canvas" :width="radius" :height="radius"></canvas>
</template>