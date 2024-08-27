<style lang="scss">
:root {
  // make sidebar-width responsive
  --sidebar-width: 30vw;
  --default-color: rgb(35 55 75 / 90%);
  --sidebar-color: rgb(196 109 94 / 95%);
  --white-color: #fff;
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
  <SideMenu ref="menu" @fly="onFly" />
  <div id="layout">
    <MapView ref="mapview" />
  </div>
</template>

<script lang="ts">
import SideMenu from './components/SideMenu.vue'
import MapView from './components/MapView.vue'
import { ref } from 'vue'

export default {
  components: { MapView, SideMenu },
  setup() {
    const mapview = ref()
    return { mapview }
  },
  methods: {
    onFly(goNext: boolean) {
      const mapComponent: any = this.$refs.mapview
      mapComponent.flyToNextMarker(goNext)
    }
  }
}
</script>
