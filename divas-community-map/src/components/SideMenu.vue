<style lang="scss" scoped>
#info-popup {
  position: absolute;
  z-index: 50;
  width: var(--sidebar-width);
  min-width: var(--sidebar-min-width);
  color: var(--black-color);
  background-color: var(--sidebar-color);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  margin-left: 2.5rem;
  height: 95vh;
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 2rem;
}

h1 {
  font-weight: 750;
}

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
  margin-left: 2.5rem;
  background-color: var(--sidebar-color);
  transition: 0.2s ease-out;
  z-index: 10;
  color: var(--black-color);
  width: var(--sidebar-width);
  min-width: var(--sidebar-min-width);
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);

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

// neighborhood styling
.East {
  color: #3e7e77;
  border-color: #3e7e77;
}

.Laurelton {
  color: #5f9dd3;
  border-color: #5f9dd3;
}

.Eastchester {
  color: #daab3e;
  border-color: #daab3e;
}

.Hunts {
  color: #e05a42;
  border-color: #e05a42;
}
////

#menu-slideshow {
  color: var(--white-color);
  border: 4px solid var(--black-color);
}

#menu-slideshow:not(:hover) {
  .slide-button {
    width: auto;
    height: auto;
    display: none;
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
    padding: 0.5rem 0;
  }

  button {
    display: none;
  }
}

#dropdown {
  pointer-events: all;
  background: var(--sidebar-color);
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
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
const isInfoOpen = ref(false)

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

function toggleInfo(isOn: boolean) {
  if (isOn) isInfoOpen.value = true
  else isInfoOpen.value = false
}

function resetSlide() {
  let slides = slidesRef.value
  // for (let i = 0; i < slides.length; i++) {
  //   slides[i].style.display = 'none'
  // }
  activeSlideIndex.value = 0
  slides[0].style.display = 'block'
}

defineExpose({ toggleMenu, toggleInfo, resetSlide, UpdateSlide, loadSlides })
const emit = defineEmits(['travel', 'fly'])
</script>

<template v-model="store">
  <!-- neighbor navigation -->
  <div
    id="neighborhood"
    class="absolute z-20 flex flex-col justify-center items-center"
    :class="`${isMenuOpen ? '' : 'hidden'}`"
  >
    <div
      id="dropdown"
      class="inline-block w-[200px] text-center rounded-md"
      :class="`${sideMenu.$state.borough}`"
    >
      <div class="flex flex-row justify-center items-center space-x-1">
        <span class="material-symbols-outlined" :class="`${sideMenu.$state.neighborhood}`">
          location_on
        </span>
        <h1>{{ sideMenu.$state.neighborhood }}</h1>
        <span class="material-symbols-outlined" :class="`${sideMenu.$state.neighborhood}`">
          keyboard_arrow_down
        </span>
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
      <button class="absolute left-0 top-[50%] pl-2" @click="`${$emit('fly', false)}`">
        <span
          class="transition ease-in-out material-symbols-outlined rotate-180 font-bold text-4xl hover:opacity-50"
          :class="`${sideMenu.$state.neighborhood}`"
          >arrow_forward_ios</span
        >
      </button>
      <button class="absolute right-0 top-[50%] pr-2" @click="`${$emit('fly', true)}`">
        <span
          class="transition ease-in-out material-symbols-outlined font-bold text-4xl hover:opacity-50"
          :class="`${sideMenu.$state.neighborhood}`"
          >arrow_forward_ios</span
        >
      </button>
      <div class="flex flex-col items-center w-full py-4">
        <h1 class="grow text-4xl text-center">{{ sideMenu.$state.title }}</h1>
        <div
          class="w-[60%] border-solid border-2 mt-4 rounded"
          :class="`${sideMenu.$state.neighborhood}`"
        ></div>
      </div>

      <div class="h-full overflow-y-auto px-4">
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
            class="w-full"
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

  <!-- info popup -->
  <div id="info-popup" :class="`${isInfoOpen ? '' : 'hidden'}`">
    <div class="overflow-y-hidden h-[95%]">
      <h1 class="text-4xl text-center">Assets Sourced by and for Community</h1>
      <div class="h-full overflow-y-auto px-4 flex flex-col pb-4">
        <div class="w-[60%] border-solid border-2 my-4 rounded self-center"></div>
        <p class="text-lg pb-4">
          Students all over the city conducted community street audits of their neighborhoods and
          identified community assets to be featured on this interactive map!
          <span style="font-family: Merriweather; color: brown">Click on one of the markers</span>
          to see what they found, or learn more about The Anti-Gun Violence Mapping Project through
          the video below.
        </p>
        <iframe
          class="w-full h-96"
          src="https://www.youtube.com/embed/5hNYzMJha5Q?si=e6NKXZX2pkuDDrAg"
          frameborder="1"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  </div>
</template>
