<style lang="scss">
:root {
  // make sidebar-width responsive
  --sidebar-width: 40vw;
  --default-color: rgb(35 55 75 / 90%);
  // --sidebar-color: rgb(224 219 199 / 95%);
  // --sidebar-color: rgb(250 250 250 / 95%);
  --sidebar-color: rgb(247 243 243 / 95%);
  --white-color: #fff;
  --black-color: rgb(70, 70, 70);
}

* {
  font-family: 'Nunito Variable', 'Roboto', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
    sans-serif;
}

p {
  font-family: 'Merriweather';
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
  <SplashScreen ref="splash" @home="onHome" @info="showInfo" />
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
      menuComponent.loadSlides()
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
      menuComponent.toggleInfo(false)
      menuComponent.toggleMenu(true)
    },
    showInfo() {
      const menuComponent: any = this.$refs.menu
      menuComponent.toggleInfo(true)
    }
  }
}
</script>
