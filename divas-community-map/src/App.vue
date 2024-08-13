<template>
  <head>
    <title>DIVAS Map NYC</title>
    <meta property="og:description" content="A map of NYC" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.5.2/dist/maplibre-gl.css" />
  </head>

  <body>
    <div id="map" ref="map"></div>
  </body>
</template>

<script lang="ts">
import { Map, type LngLatBoundsLike } from 'maplibre-gl'

const bounds: LngLatBoundsLike | undefined = [
  [-74.04728500751165, 40.68392799015035], // Southwest coordinates
  [-73.91058699000139, 40.87764500765852] // Northeast coordinates
]

export default {
  mounted() {
    const map: Map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      // style: 'https://demotiles.maplibre.org/style.json',
      center: [-73.9978, 40.7209],
      zoom: 14,
      maxBounds: bounds
    })
  }
}
</script>

<style lang="scss" scoped>
#map {
  height: 100vh;
  width: 100vw;
}
</style>
