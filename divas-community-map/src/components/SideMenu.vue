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

  // .menu-toggle-wrap {
  //   display: flex;
  //   justify-content: flex-end;
  //   margin-bottom: 1rem;
  //   position: relative;
  //   top: 0;
  //   transition: 0.2s ease-out;

  //   .menu-toggle {
  //     transition: 0.2s ease-out;
  //     border: none;
  //     background: none;

  //     .material-symbols-outlined {
  //       transition: 0.2s ease-out;
  //       font-size: 2rem;
  //       color: var(--white-color);
  //     }

  //     &:hover {
  //       .material-symbols-outlined {
  //         color: var(--default-color);
  //         transform: translateX(0.5rem);
  //       }
  //     }
  //   }
  // }

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

const sideMenu = sideMenuStore()

const ToggleMenu = () => {
  sideMenu.$patch({
    isOpen: !sideMenu.$state.isOpen
  })
}
</script>

<template v-model="store">
  <!-- <aside :class="`${sideMenu.$state.isOpen ? 'isExpanded' : ''}`"> -->
    <aside class="isExpanded">
    
    <!-- <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
      </button>
    </div> -->
    <!-- How can I ease in and out when content changes? -->
    <div class="menu-content" :class="`${sideMenu.$state.id} ease-in-out`">
      <div class="flex flex-row">
        <button>
          <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
        </button>
        <h1 class="text-xl font-bold">{{ sideMenu.$state.neighborhood }}</h1>
      </div>
      
      <h1 class="text-4xl/loose font-semibold">{{ sideMenu.$state.title }}</h1>
      <div class="overflow-y-auto">
      <!-- If menu closed, hide title, description, other media -->
      <!-- if menu open, set sideMenu params to current-->

      
      <p class="text-lg">{{ sideMenu.$state.description }}</p>

      <!-- Main Image -->
      <div class="menu-main-image pt-6 w-full">
        <img
            :class="`${sideMenu.$state.mediaType == 'image' ? 'image-media' : 'hidden'}`"
            :src="`${sideMenu.$state.url}`"
        />
      </div>
      <!-- Other media-->

      <!-- <div v-for="(item, index) in sideMenu.$state.allMedia!" :key="index" class="menu-media pt-6 w-full">
        <img
          :class="`${item.mediaType == 'image' ? 'image-media' : 'hidden'}`"
          :src="`${item.url}`"
        />
        <iframe
          :class="`${item.mediaType == 'video' ? 'video-media' : 'hidden'}`"
          class="w-full h-3/6"
          :src="`${item.url}`"
          frameborder="1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <audio
          :class="`${item.mediaType == 'audio' ? 'audio-media' : 'hidden'}`"
          :src="`${item.url}`"
        ></audio>
      </div> -->

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
