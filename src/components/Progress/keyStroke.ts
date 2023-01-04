/**
 * 键盘监听
 */
import { onKeyStroke } from '@vueuse/core'
import type { Ref, WritableComputedRef } from 'vue'
export function useKeyStroke(focused: Ref<boolean>, progress: WritableComputedRef<number>, max: number) {
  function addValue(e: Event) {
    if (!focused.value) return
    e.preventDefault()
      progress.value < max && (progress.value += 1)
  }
  function pausedValue(e: Event) {
    if (!focused.value) return
    e.preventDefault()
    progress.value > 0 && (progress.value -= 1)
  }
  onKeyStroke(['w', 'W', 'ArrowUp'], (e: KeyboardEvent) => {
    addValue(e)
  })
  onKeyStroke(['s', 'S', 'ArrowDown'], (e: KeyboardEvent) => {
    pausedValue(e)
  })
  onKeyStroke(['a', 'A', 'ArrowLeft'], (e: KeyboardEvent) => {
    pausedValue(e)
  })
  onKeyStroke(['d', 'D', 'ArrowRight'], (e: KeyboardEvent) => {
    addValue(e)
  })
}