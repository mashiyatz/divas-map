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
  // width: calc(2rem + 32px);
  width: var(--sidebar-width);
  transition: 0.2s ease-out;
  z-index: 10;

  width: var(--sidebar-width);

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

.Queens {
  background: brown;
}

.Brooklyn {
  background: burlywood;
}

.The.Bronx {
  background: chocolate;
}

#menu-slideshow:not(:hover) {
  .slide-button {
    display: none;
  }
}

#neighborhood {
  width: 70vw;
  height: auto;
  right: 0;
  padding-top: 2rem;

  h1 {
    color: whitesmoke;
    font-size: 2.25rem;
    font-weight: 700;
  }

  button {
    display: none;
  }
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
const activeSlide = ref('')
const intervalRef = ref()

const isMenuOpen = ref(false)
// const buttonRef = ref(null)

const UpdateSlide = () => {
  var newIndex = activeSlideIndex.value + 1
  if (newIndex >= sideMenu.$state.slideShow?.length) newIndex = 0
  activeSlideIndex.value = newIndex
  activeSlide.value = sideMenu.$state.slideShow ? sideMenu.$state.slideShow[newIndex] : ''
}

onMounted(() => {
  intervalRef.value = setInterval(UpdateSlide, 2000)
})

onBeforeUnmount(() => {
  clearInterval(intervalRef.value)
})

function toggleMenu(isOn: boolean) {
  if (isOn) isMenuOpen.value = true
  else isMenuOpen.value = false
}

function hideButtons() {
  var buttons = document.getElementsByClassName('dropdown-button') as HTMLCollectionOf<HTMLElement>
  for (let button of buttons) {
    button.style.display = 'none'
  }
  for (let button of buttons) {
    button.style.display = ''
  }
}

defineExpose({ toggleMenu })
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
      <h1 class="py-2">{{ sideMenu.$state.neighborhood }}</h1>

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
    <div class="menu-content" :class="`${sideMenu.$state.id} ease-in-out`">
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
        <div id="menu-main-img" class="pt-6 w-full">
          <img
            loading="lazy"
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
          />
        </div>

        <!-- Slide Show -->

        <div
          id="menu-slideshow"
          :class="`${activeSlide == '' ? 'hidden' : ''}`"
          class="relative flex flex-row w-full h-2/5"
          @click="`${UpdateSlide()}`"
        >
          <button class="slide-button" @click="`${UpdateSlide()}`">
            <span class="absolute material-symbols-outlined rotate-180 left-1"
              >arrow_forward_ios</span
            >
          </button>
          <img :src="`${activeSlide}`" class="w-full h-full object-cover" />
          <button class="slide-button" @click="`${UpdateSlide()}`">
            <span class="absolute material-symbols-outlined right-1">arrow_forward_ios</span>
          </button>
        </div>

        <!-- Other media, need to loop through sideMenu.$.state.allMedia -->
        <div id="menu-media" class="pt-6 w-full h-96">
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
