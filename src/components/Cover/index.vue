<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import audioStore from '@/store/audioStore'
import { storeToRefs } from 'pinia'
import { rgbToHex } from '@/utils/index'
const storeAudio = audioStore()
const { albumCover, analyser, isPlay } = storeToRefs(storeAudio)

type Props = {
  radius: number,
  padding: number,
  dynamic: boolean,
}
type TContext = CanvasRenderingContext2D | null | undefined

const props = withDefaults(defineProps<Props>(), {
  radius: 80,
  padding: 10,
  dynamic: false,
})

// 图片宽高
const imgRadius = computed(() => {
  return props.radius - props.padding * 2
})
const canvas = ref<HTMLCanvasElement | null>(null)

const bufferLength = computed(() => {
  return analyser.value?.frequencyBinCount || 0
})

// 是否正在绘制
const isDraw = ref(false)
/**
 * 初始化图片
 */
const cover = ref<HTMLImageElement | null>(null)
function createCover(){
  if (!albumCover.value || drawId.value) return
  cover.value = new Image(imgRadius.value, imgRadius.value)
  cover.value.src = `${albumCover.value}`
  // 允许图片跨域
  cover.value.setAttribute('crossOrigin', '');
  cover.value?.addEventListener('load', () => {
    // 图片加载完成开始绘制canvas
    draw()
  })
  
}
const drawId = ref<number | null>(null)

// 监听图片链接来初始化绘制
watch(albumCover, () => {
  if (albumCover.value){
    createCover()
  }
})
// 监听播放状态改变绘制状态
watch(isPlay, () => {
  if (isPlay.value && !isDraw.value && drawId.value) {
    // 重新开始绘制
    draw()
  }
  if (!isPlay.value && isDraw.value) {
    // 停止绘制
    cancelDraw()
  }
})
/**
 * 绘制
 */
function draw() {
  if (!cover.value || !canvas.value) return
  const context = canvas.value.getContext('2d')
  // 是否绘制动效
  if (props.dynamic) {
    drawId.value = requestAnimationFrame(draw)
    // 清除画布
    context?.clearRect(0, 0, props.radius, props.radius)
    // 绘制圆形动效
    drawCircles(context) 
    // 绘制图片
    drawImage(context, cover.value)
    // 获取外圈颜色
    // getMainColor(context) 
    isDraw.value = true
  } else {
    drawImage(context, cover.value)
  }
}
/**
 * 绘制外围圆圈动效
 */
function drawCircles(context: TContext){
  // console.log('绘制外围圆圈动效')
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
    context!.strokeStyle = mainColor.value
    // context!.strokeStyle = '#000'
    context!.filter = 'blur(1px)'
    context!.globalAlpha  = 0.5
  }
  context?.stroke()
  context?.restore()
}
/**
 * 绘制图片并裁剪
 */
function drawImage(context: TContext, cover: HTMLImageElement) {
  // console.log('绘制图片并裁剪')
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
  context?.restore()
}
/**
 * 图片的主色调
 */
const mainColor = ref('#f0f')
function getMainColor(context: TContext) {
  console.log('图片的主色调')
  const data = context?.getImageData(props.padding, props.padding, imgRadius.value, imgRadius.value).data
  if (!data) return
  const colorList: { [key: string]: number } = {}
  let i = 0;
  while (i < data.length) {
    // 数据排列是 r g b a r g b a 四个一组的顺序
    const r: number = data[i];
    const g: number = data[i + 1];
    const b: number = data[i + 2];
    const a: number = data[i + 3];
    i = i + 4; // 最后 +4 比每次 i++ 快 10ms 左右性能
    const key = [r, g, b, a].join(',')
    key in colorList ? ++colorList[key] : (colorList[key] = 1)
  }
  let arr = [];
  for (let key in colorList) {
    arr.push({
      rgba: `rgba(${key})`,
      num: colorList[key]
    })
  }
  arr = arr.sort((a, b) => b.num - a.num)
  mainColor.value = rgbToHex(arr[0].rgba)
}

/**
 * 停止绘制
 */
function cancelDraw() {
  setTimeout(() => {
    drawId.value && cancelAnimationFrame(drawId.value)
    isDraw.value = false
  }, 800);
}
</script>

<template>
  <canvas ref="canvas" :width="radius" :height="radius"></canvas>
</template>