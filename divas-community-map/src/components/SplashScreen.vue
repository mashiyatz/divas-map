<template>
  <div class="panel" :class="`${isOnSplash ? 'isOnSplash' : ''}`">
    <div
      class="w-full h-full backdrop-blur-sm backdrop-sepia-[40%] backdrop-brightness-[70%]"
    ></div>
    <div class="absolute w-[80%] self-center text-center">
      <h1 class="text-6xl text-center pb-8">
        <b>Anti-Gun Violence Asset Mapping Project</b>
      </h1>
      <p class="text-xl text-left pb-8">
        DIVAS (Digital Interactive Visual Arts Science) for Social Justice was awarded funding in
        2020 from the Verizon Foundation to expand programming to South Jamaica and the Bronx by
        providing STEAM (science, technology, engineering, arts, math) learning at New York City
        Housing Authority (NYCHA) community centers. DIVAS was new to funding from the Verizon
        Foundation, which traditionally funded nonprofits with bigger budgets and which usually
        would have acquired local government funding to run a community center in a NYCHA complex.
        DIVAS was unique in that because of the nature of the funding, we would need to collaborate
        with a more established organization.
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
  background-image: url('files/bridges.jpg');
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
