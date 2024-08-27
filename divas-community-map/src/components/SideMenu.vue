<style lang="scss" scoped>
aside {
  display: flex;
  position: absolute;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  background-color: var(--sidebar-color);
  color: var(--white-color);
  width: calc(2rem + 32px);
  transition: 0.2s ease-out;
  z-index: 99;

  .menu-content {
    display: none;
  }

  &.isExpanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      .menu-toggle {
        transform: scaleX(-1);
      }
    }

    .menu-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      top: -4rem;
      height: 100%;
    }
  }
}
</style>

<script setup lang="ts">
import { sideMenuStore } from '@/stores/sideMenuState'
import { supported } from 'mapbox-gl'
import { onBeforeUnmount } from 'vue'
import { onMounted } from 'vue'
import { onBeforeMount } from 'vue'
import { ref } from 'vue'

const sideMenu = sideMenuStore()
const activeSlideIndex = ref(0)
const activeSlide = ref('')
const intervalRef = ref()

const UpdateSlide = () => {
  var newIndex = activeSlideIndex.value + 1
  if (newIndex >= sideMenu.$state.slideShow?.length) newIndex = 0
  console.log(sideMenu.$state.slideShow?.length)
  activeSlideIndex.value = newIndex
  activeSlide.value = sideMenu.$state.slideShow
    ? sideMenu.$state.slideShow[newIndex]
    : 'https://upload.wikimedia.org/wikipedia/commons/7/77/Prospect_Park_New_York_May_2015_008.jpg'
  // clearInterval(intervalRef.value)
  // intervalRef.value = setInterval(UpdateSlide, 1000)
}

onMounted(() => {
  intervalRef.value = setInterval(UpdateSlide, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalRef.value)
})
</script>

<template v-model="store">
  <aside class="isExpanded">
    <div class="menu-content" :class="`${sideMenu.$state.id} ease-in-out`">
      <div class="flex flex-row w-full">
        <button class="flex items-center">
          <span class="material-symbols-outlined">subway</span>
        </button>
        <h1 class="text-xl font-bold pl-2">{{ sideMenu.$state.neighborhood }}</h1>
      </div>

      <div class="flex flex-row items-baseline w-full py-4">
        <button>
          <span class="material-symbols-outlined rotate-180" @click="`${$emit('fly', false)}`"
            >arrow_forward_ios</span
          >
        </button>
        <h1 class="grow text-4xl font-semibold text-center">{{ sideMenu.$state.title }}</h1>
        <button>
          <span class="material-symbols-outlined" @click="`${$emit('fly', true)}`"
            >arrow_forward_ios</span
          >
        </button>
      </div>

      <div class="overflow-y-auto">
        <p class="text-lg">{{ sideMenu.$state.description }}</p>

        <!-- Main Image -->
        <div class="menu-main-image pt-6 w-full">
          <img
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
        </div>

        <!-- Slide Show -->
        <div class="menu-slideshow w-full relative" @click="`${UpdateSlide()}`">
          <img :src="`${activeSlide}`" class="pt-6" />
        </div>

        <!-- Other media, need to loop through sideMenu.$.state.allMedia -->
        <div class="menu-media pt-6 w-full">
          <img
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
          <iframe
            :class="`${sideMenu.$state.mediaType == 'video' ? 'video-media' : 'hidden'}`"
            class="w-full h-3/6"
            :src="`${sideMenu.$state.url}`"
            :title="`${sideMenu.$state.title}`"
            frameborder="1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <audio
            :class="`${sideMenu.$state.mediaType == 'audio' ? 'audio-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          ></audio>
        </div>
      </div>
    </div>
  </aside>
</template>
