<style lang="scss">
:root {
  // make sidebar-width responsive
  --sidebar-width: 30vw;
  --default-color: rgb(35 55 75 / 90%);
  --sidebar-color: rgb(224 219 199 / 95%);
  --white-color: #fff;
  --black-color: rgb(28 25 23);
}

* {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

#layout {
  flex: 1;
  display: flex;
}
</style>

<template>
  <head>
    <title>DIVAS Map NYC</title>
    <meta property="og:description" content="A map of NYC" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.5.2/dist/maplibre-gl.css" />
  </head>
  <SplashScreen ref="splash" @home="onHome" />
  <SideMenu ref="menu" @fly="onFly" @travel="onChangeNeighborhood" />
  <div id="layout">
    <MapView ref="mapview" @openMenu="onOpenMenu" />
  </div>
</template>

<script lang="ts">
import SideMenu from './components/SideMenu.vue'
import MapView from './components/MapView.vue'
import SplashScreen from './components/SplashScreen.vue'
import { ref } from 'vue'

export default {
  components: { MapView, SideMenu, SplashScreen },
  setup() {
    const mapview = ref()
    const menu = ref()
    const splash = ref()
    return { mapview, menu, splash }
  },
  methods: {
    onFly(goNext: boolean) {
      const mapComponent: any = this.$refs.mapview
      const menuComponent: any = this.$refs.menu
      menuComponent.resetSlide()
      mapComponent.flyToNextMarker(goNext)
    },
    onChangeNeighborhood(neighborhood: string) {
      const mapComponent: any = this.$refs.mapview
      const menuComponent: any = this.$refs.menu
      menuComponent.loadSlides()
      menuComponent.resetSlide()
      mapComponent.changeToNeighborhood(neighborhood)
    },
    onHome() {
      const mapComponent: any = this.$refs.mapview
      const menuComponent: any = this.$refs.menu
      mapComponent.resetToHome()
      menuComponent.toggleMenu(false)
    },
    onOpenMenu() {
      const menuComponent: any = this.$refs.menu
      menuComponent.toggleMenu(true)
    }
  }
}
</script>
