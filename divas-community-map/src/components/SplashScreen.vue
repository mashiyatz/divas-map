<template>
  <div class="panel" :class="`${isOnSplash ? 'isOnSplash' : ''}`">
    <div class="back w-full h-full backdrop-blur-sm backdrop-brightness-[60%]"></div>
    <div class="absolute w-[85%] self-center text-center">
      <p class="text-[9vw]/[11vw] text-left opacity-20 pb-20">
        by expanding to <br />
        what is good in the <br />
        community,<br />
        <span style="font-weight: 900; font-style: italic; font-family: Merriweather;">change </span>is possible.
      </p>
    </div>
    <div class="back absolute w-full h-full backdrop-brightness-[70%] pointer-events-none"></div>
    <div class="absolute w-[65%] self-center text-center">
      <p class="text-4xl pb-6 font-black">The Anti-Gun Violence Asset Mapping Project</p>
      <p class="text-xl">by DIVAS for Social Justice</p>
    </div>
    <button
      @click="ToggleSplash"
      class="absolute self-center bottom-20 bg-gray-900 rounded-full w-[120px] h-[50px]"
    >
      <p style="font-family: Roboto; font-weight: 700">Explore</p>
    </button>
  </div>

  <button
    class="absolute z-50 top-[156px] right-[10px]"
    :class="`${isOnSplash ? 'hidden' : ''}`"
    @click="ToggleSplash"
  >
    <span
      class="material-symbols-outlined bg-[--sidebar-color] rounded-md text-3xl"
      style="color: rgb(70, 70, 70)"
    >
      home
    </span>
  </button>

  <button
    class="absolute z-50 top-[108px] right-[10px]"
    :class="`${isOnSplash ? 'hidden' : ''}`"
    @click="$emit('home')"
  >
    <span
      class="material-symbols-outlined text-3xl bg-[--sidebar-color] rounded-md"
      style="color: rgb(70, 70, 70)"
    >
      zoom_out_map
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOnSplash = ref(true)
const emit = defineEmits(['home', 'info'])

function ToggleSplash() {
  isOnSplash.value = !isOnSplash.value
  if (isOnSplash.value) emit('home')
  else emit('info')
}
</script>

<style lang="scss" scoped>
.panel {
  text-shadow: var(---color) 1px 1px 5px;
  display: flex;
  flex-direction: column;
  place-content: center;
  position: fixed;
  color: antiquewhite;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.1);
  background-size: cover;
  opacity: 0;
  visibility: hidden;
  transition:
    visibility ease-in-out 1s,
    opacity ease-in-out 0.8s;

  .back {
    opacity: 0;
    transition: opacity ease-in-out 0.8s;
  }

  &.isOnSplash {
    visibility: visible;
    opacity: 1;

    .back {
      opacity: 1;
    }
  }
}

.material-symbols-outlined {
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
}
</style>
