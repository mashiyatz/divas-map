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
  width: var(--sidebar-width);
  transition: 0.2s ease-out;
  z-index: 10;
  color: var(--black-color);
  width: var(--sidebar-width);
  box-shadow: 2px 2px 10px 2px gray;

  .menu-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    top: -4rem;
    height: 100%;
  }

  &.menuNotOpen {
    display: none;
  }
}

#menu-slideshow {
  color: var(--white-color);
  border: 4px solid black;
}

#menu-slideshow:not(:hover) {
  .slide-button {
    display: none;
    width: auto;
    height: auto;
  }
}

#neighborhood {
  width: 70vw;
  height: auto;
  right: 0;
  padding-top: 2rem;
  color: var(--black-color);

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
  }

  button {
    display: none;
  }
}

#dropdown {
  background: var(--sidebar-color);
  box-shadow: 2px 2px 10px 2px gray;
}

#dropdown:hover {
  button {
    display: block;
  }
}
</style>

<script setup lang="ts">
import { sideMenuStore } from '@/stores/sideMenuState'
import { neighborhoodStore } from '@/stores/neighborhoodState'
import { onBeforeUnmount } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

const sideMenu = sideMenuStore()
const neighborhoods = neighborhoodStore()
const activeSlideIndex = ref(0)
const isMenuOpen = ref(false)

const intervalRef = ref()
const timeInterval = 3000

const progress = ref(0)
const progressBar = ref()
const progressBarInterval = ref()

const UpdateSlide = (goForward: boolean) => {
  // clearInterval(progressBarInterval.value)
  progress.value = 0
  if (sideMenu.$state.slideShow == undefined) return
  let slides = document.getElementsByClassName('slide-img') as HTMLCollectionOf<HTMLElement>
  slides[activeSlideIndex.value].style.display = 'none'
  if (goForward) {
    activeSlideIndex.value += 1
    if (activeSlideIndex.value >= sideMenu.$state.slideShow?.length) activeSlideIndex.value = 0
  } else {
    activeSlideIndex.value -= 1
    if (activeSlideIndex.value < 0) activeSlideIndex.value = sideMenu.$state.slideShow?.length - 1
  }
  slides[activeSlideIndex.value].style.display = 'block'
}

function updateProgressBar() {
  progressBar.value.style.width = (progress.value / timeInterval) * 180 + '%'
  if (progress.value + 10 > timeInterval) progress.value = timeInterval
  else progress.value += 10
}

onMounted(() => {
  progressBar.value = document.getElementById('progress-bar')
  progressBarInterval.value = setInterval(updateProgressBar, 10)
  intervalRef.value = setInterval(UpdateSlide, timeInterval)
})

onBeforeUnmount(() => {
  clearInterval(intervalRef.value)
})

function toggleMenu(isOn: boolean) {
  if (isOn) isMenuOpen.value = true
  else isMenuOpen.value = false
}

function resetSlide() {
  activeSlideIndex.value = 0
}

defineExpose({ toggleMenu, resetSlide, UpdateSlide })
const emit = defineEmits(['travel', 'fly'])
</script>

<template v-model="store">
  <!-- neighbor navigation -->
  <div
    id="neighborhood"
    class="absolute z-20 flex flex-column justify-center items-center"
    :class="`${isMenuOpen ? '' : 'hidden'}`"
  >
    <div
      id="dropdown"
      class="inline-block w-1/3 text-center rounded"
      :class="`${sideMenu.$state.borough}`"
    >
      <h1 class="pt-2">{{ sideMenu.$state.neighborhood }}</h1>
      <span class="material-symbols-outlined mt-[-18px]"> arrow_drop_down </span>

      <button
        class="dropdown-button w-full bg-white/20 opacity-80 transition ease-in-out duration-500 hover:opacity-100 hover:bg-white/0 py-2 rounded"
        v-for="(item, key) in neighborhoods.$state.neighborhoodList.filter(
          (x) => x != sideMenu.$state.neighborhood
        )"
        :key="key"
        @click="`${$emit('travel', item)}`"
      >
        <h1>
          {{ item }}
        </h1>
      </button>
    </div>
  </div>

  <!-- side menu -->
  <aside :class="`${isMenuOpen ? sideMenu.$state.borough : 'menuNotOpen'}`">
    <div class="menu-content" :class="`${sideMenu.$state.id}`">
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

      <div class="h-full overflow-y-auto">
        <p class="text-lg pb-4">{{ sideMenu.$state.description }}</p>

        <!-- Main Image
        <div id="menu-main-img" class="pt-6 w-full">
          <img
            loading="lazy"
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
        </div> -->

        <!-- Slide Show -->

        <div
          id="menu-slideshow"
          :class="`${sideMenu.$state.slideShow == undefined ? 'hidden' : ''}`"
          class="relative flex flex-row justify-center w-full h-2/5"
        >
          <button class="slide-button z-20" @click="`${UpdateSlide(false)}`">
            <span class="absolute material-symbols-outlined rotate-180 left-1"
              >arrow_forward_ios</span
            >
          </button>

          <div class="hidden flex z-20 h-1 w-4/5 bg-transparent rounded self-end mb-4">
            <div id="progress-bar" class="bg-gray-300 w-full rounded"></div>
          </div>

          <img
            v-for="(item, key) in sideMenu.$state.slideShow"
            :key="key"
            :src="item"
            class="slide-img absolute w-full h-full object-cover"
          />

          <button class="slide-button z-20" @click="`${UpdateSlide(true)}`">
            <span class="absolute material-symbols-outlined right-1">arrow_forward_ios</span>
          </button>
        </div>

        <!-- Other media, need to loop through sideMenu.$.state.allMedia -->
        <div id="menu-media" class="mt-6 w-full h-96">
          <!-- add border to media? border-4 border-black -->
          <img
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
          <iframe
            :class="`${sideMenu.$state.mediaType == 'embed' ? 'embed-media' : 'hidden'}`"
            class="w-full h-full"
            :src="`${sideMenu.$state.url}`"
            :title="`${sideMenu.$state.title}`"
            frameborder="1"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
          <video
            :class="`${sideMenu.$state.mediaType == 'video' ? 'video-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
            autoplay
            muted
            controls
          ></video>
          <audio
            :class="`${sideMenu.$state.mediaType == 'audio' ? 'audio-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          ></audio>
        </div>
      </div>
    </div>
  </aside>
</template>
