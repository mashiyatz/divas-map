<template>
  <div class="panel" :class="`${isOnSplash ? 'isOnSplash' : ''}`">
    <div
      class="w-full h-full backdrop-blur-sm backdrop-sepia-[40%] backdrop-brightness-[70%]"
    ></div>
    <div class="absolute w-[65%] self-center text-center">
      <!-- <h1 class="text-2xl text-center pb-8">
        <b>The Anti-Gun Violence Asset Mapping Project</b>
      </h1> -->
      <p class="text-8xl text-left pb-8">
        <b
          >By expanding to what is good in the community,
          <span style="color: green"><b>change is possible</b></span
          >.</b
        >
      </p>
      <p class="text-2xl text-right pb-8">
        <em>The Anti-Gun Violence Asset Mapping Project</em><br /><em
          >by DIVAS for Social Justice</em
        >
      </p>
      <button @click="ToggleSplash">
        <span class="material-symbols-outlined text-8xl"> explore </span>
      </button>
    </div>
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
  text-shadow: black 1px 1px 5px;
  display: flex;
  flex-direction: column;
  place-content: center;
  position: fixed;
  font-family: Helvetica, sans-serif;
  color: antiquewhite;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-image: url('bridges.jpg');
  background-size: cover;
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
