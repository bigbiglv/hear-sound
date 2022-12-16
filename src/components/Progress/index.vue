<script setup lang="ts">
import { TMode } from '@/store/types';
import { computed } from 'vue'
type Props = {
  modelValue: number,
  max?: number,
  min?: number,
  position?: TMode
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 10,
  min: 0,
  position: 'horizontal' // 默认横向水平
})
const emit = defineEmits(['update:modelValue'])
// 通过 computed 来双向绑定
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', Number(val))
  }
})
// 通过传入的position来确定横向还是纵向
const inputClass = computed(() => {
  if (props.position === 'vertical') {
    return ' -rotate-90'
  }else{
    return ''
  }
})
</script>

<template>
  <div class="transform origin-center flex justify-center items-center" :class="inputClass">
    <input type="range" v-model="value" :max="props.max" :min="props.min">
  </div>
</template>