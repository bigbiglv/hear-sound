<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import useDrag from '@/hooks/useDrag'
import Tool from '@/components/Player/Tool.vue'
import LyricList from './Lyric/List.vue'
import CurrentTime from './Player/CurrentTime.vue'
import appStore from '@/store/appStore'
import audioStore from '@/store/audioStore'
const store = appStore()
const storeAudio = audioStore()
const ModalClass = computed(() => {
  let rounded = store.modal === 'normal' && 'rounded-t-2xl'
  return rounded
})
// 点击外部关闭弹窗
const appModalRef = ref<HTMLElement | null>(null)
onClickOutside(
  appModalRef,
  () => store.modal === 'occupy' && store.setModal('normal')
)

// 滑动底部关闭
const { y, isDrag } = useDrag(appModalRef, false)
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
    ref="appModalRef"
    class="w-screen fixed bg-light-700 bottom-0 z-40"
    :style="[store.modalStyle, modalbottom]"
    :class="ModalClass"
    >
    <div class="h-full flex flex-col" v-show="store.modal === 'occupy'">
      <nav class="w-full text-center py-4">
        {{ storeAudio.playSong?.name }}
      </nav>
      <LyricList />
      <CurrentTime />
    </div>
    <Tool />
  </div>
</template>


<style lang="scss" scoped>

</style>