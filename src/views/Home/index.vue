<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import dynamics from 'dynamics.js'
const router = useRouter()
function go(event: Event) {
  const element = event.currentTarget as HTMLElement
  // 执行动画
  dynamics.animate(
    element,
    {
      position: 'fixed',
    },
    {
      type: dynamics.linear,
      duration: 10,
      complete: () => {
        dynamics.animate(
          element,
          {
            width: '375px',
            height: '800px',
            top: '0',
            left: '0',
          },
          {
            type: dynamics.linear,
            duration: 200,
            complete: () => {
              router.push('./artist')
            }
          }
        )
      }
    }
  )
}
</script>

<template>
  <div class="pt-11">
    <!-- 搜索 -->
    <router-link 
      class="w-screen h-11 fixed top-0 left-0 flex justify-center items-center bg-white shadow-md rounded-b-lg z-10"
      to="/search"
      >
      <div class=" w-13/14 h-4/5 bg-light-500 rounded-full"></div>
    </router-link>
    <div class="grid grid-flow-row grid-cols-2 gap-y-2 justify-around justify-items-center">
      <div class="w-20 h-20 z-20 overflow-hidden row-span-2" @click.stop="go($event)">
        <div class="bg-yellow-100 w-full h-80">1</div>
      </div>
      <div
        class="w-20 h-20 z-20 overflow-hidden"
        v-for="item in 10" 
        @click.stop="go($event)" 
      >
        <div class="bg-yellow-100 w-full h-80"></div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>

</style>