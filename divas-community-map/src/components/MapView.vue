<script lang="ts">
import { Map, type LngLatBoundsLike, NavigationControl, type Feature } from 'maplibre-gl'
import { sideMenuStore } from '@/stores/sideMenuState'
import { ref } from 'vue'
import untypedLandmarks from '../landmarks.json'

const landmarks: { [key: number]: any } = untypedLandmarks

// fix bounds around Queens
const bounds: LngLatBoundsLike | undefined = [
  [-74.4207, 40.38369], // Southwest coordinates
  [-73.165512, 41.11609] // Northeast coordinates
]

const storeSideMenu = ref()
const mapRef = ref()

export default {
  mounted() {
    const map: Map = new Map({
      container: 'map',
      style:
        'https://api.maptiler.com/maps/2b4ffeb2-c0c6-4892-9881-e78c2d8a6181/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      center: [-73.74959, 40.682273],
      pitch: 45,
      zoom: 12,
      minZoom: 12,
      bearing: 0,
      pitchWithRotate: false,
      maplibreLogo: false,
      maxBounds: bounds
    })

    storeSideMenu.value = sideMenuStore()
    mapRef.value = map

    map.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      })
    )

    map.on('load', async () => {
      var markerImage = await map.loadImage(
        //'https://upload.wikimedia.org/wikipedia/commons/9/9e/Pin-location.png'
        'src/assets/DIVASHighlightCoverHeal.png'
      )

      if (!map.hasImage('marker')) map.addImage('marker', markerImage.data)
      else {
        map.removeImage('marker')
        map.addImage('marker', markerImage.data)
      }

      const features = Object.values(landmarks).map((landmark) => {
        return {
          type: 'Feature',
          properties: landmark.properties,
          geometry: {
            type: 'Point',
            coordinates: landmark.coordinates
          }
        }
      })

      map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        },
        cluster: false
      })

      // map.addLayer({
      //   id: 'cluster-point',
      //   type: 'symbol',
      //   source: 'point',
      //   filter: ['has', 'point_count'],
      //   layout: {
      //     'icon-image': 'marker',
      //     'icon-size': 0.1
      //   }
      // })

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'title'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 2.5,
          'text-justify': 'auto',
          'text-size': 24,
          'icon-image': 'marker',
          'icon-size': 0.1,
          'icon-allow-overlap': true
        }
      })

      map.on('click', 'points', (e) => this.flyToSelectedMarker(e.features![0]))

      map.on('mouseenter', 'points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = ''
      })
    })
  },
  methods: {
    flyToSelectedMarker(event: any) {
      this.$emit('openMenu')
      storeSideMenu.value.$patch({
        id: event.properties.id,
        neighborhood: event.properties.neighborhood,
        borough: event.properties.borough,
        title: event.properties.title,
        description: event.properties.description,
        mediaType: event.properties.mediaType,
        url: event.properties.url,
        slideShow: landmarks[event.properties.id].properties.slideShow
        // slideShow: event.properties.slideShow // why doesn't this work?
      })
      mapRef.value.flyTo({
        center: event.geometry.coordinates,
        zoom: 18
      })
    },
    flyToNextMarker(goNext: boolean) {
      this.$emit('openMenu')
      var newID: number = goNext ? storeSideMenu.value.id + 1 : storeSideMenu.value.id - 1
      if (newID <= 0) newID = Object.keys(landmarks).length - 1
      else if (newID >= Object.keys(landmarks).length) newID = 1
      storeSideMenu.value.$patch({
        id: landmarks[newID].properties.id,
        neighborhood: landmarks[newID].properties.neighborhood,
        borough: landmarks[newID].properties.borough,
        title: landmarks[newID].properties.title,
        description: landmarks[newID].properties.description,
        mediaType: landmarks[newID].properties.mediaType,
        url: landmarks[newID].properties.url,
        slideShow: landmarks[newID].properties.slideShow
      })
      mapRef.value.flyTo({
        center: landmarks[newID].coordinates,
        zoom: 18
      })
    },
    changeToNeighborhood(name: string) {
      this.$emit('openMenu')
      var landmark = Object.values(landmarks).find((x) => x.properties.neighborhood === name)
      storeSideMenu.value.$patch({
        id: landmark.properties.id,
        neighborhood: landmark.properties.neighborhood,
        borough: landmark.properties.borough,
        title: landmark.properties.title,
        description: landmark.properties.description,
        mediaType: landmark.properties.mediaType,
        url: landmark.properties.url,
        slideShow: landmark.properties.slideShow
      })
      mapRef.value.flyTo({
        center: landmark.coordinates,
        zoom: 18
      })
    },
    resetToHome() {
      mapRef.value.flyTo({
        zoom: 12
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// div containing map has to have nonzero width and height
#map {
  height: 100vh;
  width: 100vw;
  flex: 1;
}
</style>

<template>
  <div id="map" ref="map"></div>
</template>

<!-- 
MapLibre API:  
  - https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
  - https://maplibre.org/maplibre-style-spec/sources/#image
  - https://maplibre.org/maplibre-gl-js/docs/examples/multiple-geometries/
  - https://jsfiddle.net/oh8Ld1ry/1/
  - https://github.com/mapbox/mapbox-gl-js/issues/4736
  - https://stackoverflow.com/questions/66210679/mapbox-gl-js-how-to-add-multiple-photo-sources-on-a-single-layer
-->
