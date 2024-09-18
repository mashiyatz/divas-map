<script lang="ts">
import { Map, type LngLatBoundsLike, NavigationControl, setRTLTextPlugin } from 'maplibre-gl'
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
    setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      true
    )
    const map: Map = new Map({
      container: 'map',
      style:
        //'https://api.maptiler.com/maps/2b4ffeb2-c0c6-4892-9881-e78c2d8a6181/style.json?key=vbWcEeVNDHjFUuEi2uGd',
        'https://api.maptiler.com/maps/f5163ed8-5757-449d-86a8-d873f6116318/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      center: [-73.74959, 40.682273],
      pitch: 45,
      zoom: 12,
      minZoom: 12,
      maxZoom: 16,
      bearing: 0,
      pitchWithRotate: false,
      maplibreLogo: false,
      maxBounds: bounds,
      attributionControl: false
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
      var markerImage = await map.loadImage('DIVASHighlightCoverHeal.png')

      if (!map.hasImage('marker')) map.addImage('marker', markerImage.data)
      else {
        map.removeImage('marker')
        map.addImage('marker', markerImage.data)
      }

      const layers = map.getStyle().layers
      // Find the index of the first symbol layer in the map style.
      let firstSymbolId
      for (const layer of layers) {
        if (layer.type === 'symbol') {
          firstSymbolId = layer.id
          break
        }
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

      map.addSource('borough', {
        type: 'geojson',
        data: 'geojson/borough-boundaries.geojson'
      })

      map.addSource('nta', {
        type: 'geojson',
        data: 'geojson/nyc_nta.geojson'
      })

      map.addLayer(
        {
          id: 'boroughs',
          type: 'fill',
          source: 'borough',
          paint: {
            'fill-color': '#e0cbc7',
            'fill-opacity': 0.5
          }
        },
        'park'
      )
      map.addLayer(
        {
          id: 'neighborhoods',
          type: 'fill',
          source: 'nta',
          paint: {
            'fill-color': [
              'match',
              ['get', 'ntaname'],
              'Laurelton',
              '#cead94',
              'East New York (North)',
              '#cfb1c0',
              'Eastchester-Edenwald-Baychester',
              '#a3c8f7',
              '#FFFFFF'
            ],
            'fill-opacity': 1
          }
        },
        'boroughs'
      )

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        paint: {
          'text-color': 'rgb(70, 70, 70)',
          'text-halo-color': 'rgba(70, 70, 70, 1)',
          'text-halo-width': 0.1
        },
        layout: {
          'text-field': ['get', 'title'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 1.25,
          'text-justify': 'auto',
          'text-size': 24,
          'text-font': ['literal', ['Metropolis Semi Bold']],
          'icon-image': 'marker',
          'icon-size': 0.1,
          'icon-allow-overlap': true,
          'text-optional': true
        }
      })

      map.setLayoutProperty('points', 'icon-size', [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        12,
        0.05,
        16,
        0.1
      ])

      // map.addControl(new AttributionControl({ compact: true }), 'bottom-left')

      map.setLayoutProperty('points', 'text-radial-offset', [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        12,
        1.25,
        16,
        2.5
      ])

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
        zoom: 16
      })
    },
    flyToNextMarker(goNext: boolean) {
      this.$emit('openMenu')
      var newID: number = goNext ? storeSideMenu.value.id + 1 : storeSideMenu.value.id - 1
      if (newID < 0) newID = Object.keys(landmarks).length - 1
      else if (newID >= Object.keys(landmarks).length) newID = 0
      storeSideMenu.value.$patch({
        id: landmarks[newID].properties.id,
        neighborhood: landmarks[newID].properties.neighborhood,
        borough: landmarks[newID].properties.borough,
        title: landmarks[newID].properties.title,
        description: landmarks[newID].properties.description,
        mediaType: '',
        url: '',
        slideShow: ''
      })
      storeSideMenu.value.$patch({
        mediaType: landmarks[newID].properties.mediaType,
        url: landmarks[newID].properties.url,
        slideShow: landmarks[newID].properties.slideShow
      })
      mapRef.value.flyTo({
        center: landmarks[newID].coordinates,
        zoom: 16
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
        mediaType: '',
        url: '',
        slideShow: ''
      })
      storeSideMenu.value.$patch({
        mediaType: landmark.properties.mediaType,
        url: landmark.properties.url,
        slideShow: landmark.properties.slideShow
      })
      mapRef.value.flyTo({
        center: landmark.coordinates,
        zoom: 16
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
