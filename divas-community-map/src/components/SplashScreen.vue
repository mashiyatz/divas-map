<template>
  <div class="panel flex-column justify-center" :class="`${isOnSplash ? '' : 'isOnSplash'}`">
    <h1 class="absolute text-6xl top-1/3">This is the title</h1>
    <button class="absolute top-[45%]" @click="ToggleSplash">
      <span class="material-symbols-outlined text-8xl"> explore </span>
    </button>
  </div>
  <button
    class="absolute z-50 top-[100px] right-[1px]"
    :class="`${isOnSplash ? 'hidden' : ''}`"
    @click="ToggleSplash"
  >
    <span class="material-symbols-outlined text-5xl text-black"> home </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOnSplash = ref(true)
const emit = defineEmits(['home'])

function ToggleSplash() {
  isOnSplash.value = !isOnSplash.value
  if (isOnSplash.value) emit('home')
}
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(151, 151, 151, 0.9);
  transition: 0.4s ease-in-out;

  &.isOnSplash {
    display: none;
    transition: 0.4s ease-in-out;
  }
}
</style>
