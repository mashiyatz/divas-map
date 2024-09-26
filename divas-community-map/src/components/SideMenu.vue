<style lang="scss" scoped>
aside {
  display: block;
  position: absolute;
  box-sizing: border-box;
  border-radius: 2rem;
  overflow: hidden;
  height: 95vh;
  max-height: 100vh;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  margin-left: 1.5rem;
  background-color: var(--sidebar-color);
  color: var(--white-color);
  transition: 0.2s ease-out;
  z-index: 10;
  color: var(--black-color);
  width: var(--sidebar-width);
  top: 50%;
  transform: translateY(-50%);
  // box-shadow: 2px 2px 10px 2px gray;

  .menu-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 95%;
  }

  &.menuNotOpen {
    display: none;
  }

  p {
    font-weight: 400;
  }
}

#menu-slideshow {
  color: var(--white-color);
  border: 4px solid var(--black-color);
}

#menu-slideshow:not(:hover) {
  .slide-button {
    width: auto;
    height: auto;
  }
}

#neighborhood {
  pointer-events: none;
  height: auto;
  right: 60px;
  padding-top: 0.75rem;
  color: var(--black-color);

  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    padding: 0.5rem 0;
  }

  button {
    display: none;
  }
}

#dropdown {
  pointer-events: all;
  background: var(--sidebar-color);
  box-shadow: 0px 3px 2px 0px gray;
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
import { onMounted } from 'vue'
import { ref } from 'vue'

const sideMenu = sideMenuStore()
const neighborhoods = neighborhoodStore()
const activeSlideIndex = ref(0)
const isMenuOpen = ref(false)

const slidesRef = ref()

const UpdateSlide = (goForward: boolean) => {
  if (sideMenu.$state.slideShow == undefined) return
  let slides = slidesRef.value
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

function loadSlides() {
  // consider adding preloading??
  slidesRef.value = document.getElementsByClassName('slide-img') as HTMLCollectionOf<HTMLElement>
}

onMounted(() => {
  loadSlides()
})

function toggleMenu(isOn: boolean) {
  if (isOn) isMenuOpen.value = true
  else isMenuOpen.value = false
}

function resetSlide() {
  let slides = slidesRef.value
  // for (let i = 0; i < slides.length; i++) {
  //   slides[i].style.display = 'none'
  // }
  activeSlideIndex.value = 0
  slides[0].style.display = 'block'
}

defineExpose({ toggleMenu, resetSlide, UpdateSlide, loadSlides })
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
      class="inline-block w-[200px] text-center rounded-md"
      :class="`${sideMenu.$state.borough}`"
    >
      <div class="flex flex-row justify-center items-center space-x-1">
        <span class="material-symbols-outlined"> location_on </span>
        <h1>{{ sideMenu.$state.neighborhood }}</h1>
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </div>
      <button
        class="dropdown-button w-full bg-white/20 opacity-80 transition ease-in-out duration-500 hover:opacity-100 hover:bg-white/0"
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
          <button class="slide-button z-50" @click="`${UpdateSlide(false)}`">
            <span class="absolute material-symbols-outlined rotate-180 left-1"
              >arrow_forward_ios</span
            >
          </button>

          <img
            v-for="(item, key) in sideMenu.$state.slideShow"
            :key="key"
            :src="item"
            :class="`${key == 0 ? '' : 'hidden'}`"
            class="slide-img absolute w-full h-full object-cover"
          />

          <button class="slide-button z-50" @click="`${UpdateSlide(true)}`">
            <span class="absolute material-symbols-outlined right-1">arrow_forward_ios</span>
          </button>
        </div>

        <!-- Other media, need to loop through sideMenu.$.state.allMedia -->
        <div id="menu-media" class="mt-6 w-full">
          <!-- add border to media? border-4 border-black -->
          <img
            class="h-96"
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
          <iframe
            :class="`${sideMenu.$state.mediaType == 'embed' ? 'embed-media' : 'hidden'}`"
            class="w-full h-96"
            :src="`${sideMenu.$state.url}`"
            :title="`${sideMenu.$state.title}`"
            frameborder="1"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
          <video
            class="h-96"
            :class="`${sideMenu.$state.mediaType == 'video' ? 'video-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
            autoplay
            muted
            controls
          ></video>
          <audio
            class="h-96"
            :class="`${sideMenu.$state.mediaType == 'audio' ? 'audio-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          ></audio>
        </div>
      </div>
    </div>
  </aside>
</template>
