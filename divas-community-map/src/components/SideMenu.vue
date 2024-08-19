<style lang="scss" scoped>
aside {
  display: flex;
  position: absolute;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  background-color: var(--default-color);
  color: var(--white-color);
  width: calc(2rem + 32px);
  transition: 0.2s ease-out;
  z-index: 99;

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2s ease-out;

    .menu-toggle {
      transition: 0.2s ease-out;
      border: none;
      background: none;

      .material-symbols-outlined {
        transition: 0.2s ease-out;
        font-size: 2rem;
        color: var(--white-color);
      }

      &:hover {
        .material-symbols-outlined {
          color: var(--default-color);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  &.isExpanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      .menu-toggle {
        transform: scaleX(-1);
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { sideMenuStore } from '@/stores/sideMenuState'

const sideMenu = sideMenuStore()
const isExpanded = ref(false)

const ToggleMenu = () => {
  // isExpanded.value = !isExpanded.value
  sideMenu.$patch({
    isOpen: !sideMenu.$state.isOpen
  })
  isExpanded.value = sideMenu.$state.isOpen
}
</script>

<template v-model="store">
  <aside :class="`${isExpanded ? 'isExpanded' : ''}`">
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
      </button>
    </div>
    <div>
      <h1>{{ sideMenu.$state.title }}</h1>
      <p>{{ sideMenu.$state.description }}</p>
    </div>
  </aside>
</template>
