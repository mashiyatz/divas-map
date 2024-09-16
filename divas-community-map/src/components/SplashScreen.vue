<template>
  <div class="panel flex-column justify-center" :class="`${isOnSplash ? 'isOnSplash' : ''}`">
    <h1 class="absolute text-6xl top-1/3">This is the title</h1>
    <button class="absolute top-[45%]" @click="ToggleSplash">
      <span class="material-symbols-outlined text-8xl"> explore </span>
    </button>
  </div>
  <button
    class="absolute z-50 bottom-[10px] right-[10px]"
    :class="`${isOnSplash ? 'hidden' : ''}`"
    @click="ToggleSplash"
  >
    <span class="material-symbols-outlined text-7xl text-stone-900"> home </span>
  </button>
  <button
    class="absolute z-50 top-[100px] right-[7px]"
    :class="`${isOnSplash ? 'hidden' : ''}`"
    @click="$emit('home')"
  >
    <span class="material-symbols-outlined text-4xl text-stone-900"> zoom_out_map </span>
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
  background: rgba(151, 151, 151, 1);
  opacity: 0;
  visibility: hidden;
  transition:
    visibility ease-out 2s,
    opacity ease-in-out 2s;

  &.isOnSplash {
    visibility: visible;
    opacity: 1;
  }
}
</style>
