<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import useDrag from '@/hooks/useDrag'
import Tool from '@/components/Player/Tool.vue'
import LyricList from './Lyric/List.vue'
import CurrentTime from './Player/CurrentTime.vue'
import appStore from '@/store/appStore'
const store = appStore()
const ModalClass = computed(() => {
  let rounded = store.modal === 'normal' && 'rounded-t-2xl'
  return rounded
})
// 点击外部关闭弹窗
const appModal = ref<HTMLElement | null>(null)
onClickOutside(
  appModal,
  () => store.setModal('normal')
)

// 滑动底部关闭
const { y, isDrag } = useDrag(appModal)
const modalbottom = computed(() => {
  return `bottom: -${y.value}px`
})
watch(isDrag, () => {
  if(!isDrag.value) {
    y.value > 400 && store.setModal('normal')
    y.value = 0
  }
})
</script>

<template>
  <!-- 三个模式: 全不显示; 露出90px; 全遮挡 -->
  <div 
    id="appModal"
    ref="appModal"
    class="w-screen fixed bg-light-700 bottom-0 z-40"
    :style="[store.modalStyle, modalbottom]"
    :class="ModalClass"
    >
    <div class="h-full grid grid-cols-1 grid-rows-3" v-show="store.modal === 'occupy'">
      <LyricList />
      <CurrentTime />
    </div>
    <Tool />
  </div>
</template>


<style lang="scss" scoped>

</style>