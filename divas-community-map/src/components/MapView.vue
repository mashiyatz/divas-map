<script lang="ts">
// Following this example: https://maplibre.org/maplibre-gl-js/docs/examples/restrict-bounds/

import { Map, type LngLatBoundsLike, NavigationControl } from 'maplibre-gl'
import { sideMenuStore } from '@/stores/sideMenuState'
import { ref } from 'vue'
import { setMapStoreSuffix, storeToRefs } from 'pinia'

// fix bounds around Queens
const bounds: LngLatBoundsLike | undefined = [
  [-74.050696, 40.547044], // Southwest coordinates
  [-73.817894, 40.721256] // Northeast coordinates
]

const loremIpsum =
  'Lorem ipsum odor amet, consectetuer adipiscing elit. Curae litora duis potenti elementum quam hac. Mollis fusce nisl purus lacinia tortor posuere rhoncus lacinia. Suscipit nascetur augue molestie faucibus facilisi habitasse. Euismod pellentesque turpis sed iaculis non adipiscing porttitor. Odio venenatis litora montes ad justo hendrerit.'

// define different landmarks here
// may need a better system where coords are also included
const landmarks: { [key: number]: any } = {
  0: {
    properties: {
      id: 0,
      neighborhood: 'New York City',
      title: 'DIVAS Community Assets',
      description:
        'Children from all over the city have gathered a list of resources in their neighborhood -- have you been to any of these places?',
      mediaType: 'image',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Prospect_Park_New_York_May_2015_008.jpg',
      slideShow: [
        'https://upload.wikimedia.org/wikipedia/commons/9/9f/New_York_City_%28New_York%2C_USA%29%2C_Central_Park_--_2012_--_6731.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/New_York_City_%28New_York%2C_USA%29%2C_Brooklyn_Bridge_--_2012_--_6630.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seagull%2C_Liberty_Island%2C_New_York_City%2C_20231003_1521_1980.jpg'
      ]
    },
    coordinates: [-73.742605, 40.676574]
  },
  1: {
    properties: {
      id: 1,
      neighborhood: 'Laurelton',
      title: 'A Live Kitchen',
      description:
        "Making Vegan Living Easy. Owner Steffen Alexander grew up in this neighborhood in Queens and struggled to find clean food with good taste. He didn't want to wait for the solution to come along - he wanted to BE the solution. Steffen opened A Live Kitchen to promote healthy living and offer an easy solution for customers to go vegan.",
      mediaType: 'video', // replace these tags?
      url: 'https://www.youtube.com/embed/UQUPEPOfczk?si=CWK09YE0ZtS5ngaL',
      slideShow: [
        'https://upload.wikimedia.org/wikipedia/commons/9/9f/New_York_City_%28New_York%2C_USA%29%2C_Central_Park_--_2012_--_6731.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/New_York_City_%28New_York%2C_USA%29%2C_Brooklyn_Bridge_--_2012_--_6630.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seagull%2C_Liberty_Island%2C_New_York_City%2C_20231003_1521_1980.jpg'
      ]
    },
    coordinates: [-73.742605, 40.676574]
  },
  2: {
    properties: {
      id: 2,
      neighborhood: 'Laurelton',
      title: 'P.S. 156',
      description: loremIpsum,
      mediaType: 'image',
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Laurelton_228at138.png',
      slideShow: [
        'https://upload.wikimedia.org/wikipedia/commons/9/9f/New_York_City_%28New_York%2C_USA%29%2C_Central_Park_--_2012_--_6731.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/New_York_City_%28New_York%2C_USA%29%2C_Brooklyn_Bridge_--_2012_--_6630.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seagull%2C_Liberty_Island%2C_New_York_City%2C_20231003_1521_1980.jpg'
      ]
    },
    coordinates: [-73.743378, 40.672576]
  },
  3: {
    properties: {
      id: 3,
      neighborhood: 'Laurelton',
      title: 'P.S. 132',
      description: loremIpsum,
      mediaType: 'image',
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Laurelton_228at138.png',
      slideShow: [
        'https://upload.wikimedia.org/wikipedia/commons/9/9f/New_York_City_%28New_York%2C_USA%29%2C_Central_Park_--_2012_--_6731.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/New_York_City_%28New_York%2C_USA%29%2C_Brooklyn_Bridge_--_2012_--_6630.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seagull%2C_Liberty_Island%2C_New_York_City%2C_20231003_1521_1980.jpg'
      ]
    },
    coordinates: [-73.74959, 40.682273]
  }
}

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
      zoom: 18,
      minZoom: 12,
      bearing: 0,
      pitchWithRotate: false,
      maplibreLogo: false
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
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Pin-location.png'
      )

      if (!map.hasImage('marker')) map.addImage('marker', markerImage.data)
      else {
        map.removeImage('marker')
        map.addImage('marker', markerImage.data)
      }
      map.addSource('point', {
        // can generate object with all relevant information, then search that object within properties
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: landmarks[1].properties,
              geometry: {
                type: 'Point',
                coordinates: landmarks[1].coordinates
              }
            },
            {
              type: 'Feature',
              properties: landmarks[2].properties,
              geometry: {
                type: 'Point',
                coordinates: landmarks[2].coordinates
              }
            },
            {
              type: 'Feature',
              properties: landmarks[3].properties,
              geometry: {
                type: 'Point',
                coordinates: landmarks[3].coordinates
              }
            }
          ]
        }
      })

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        layout: {
          'text-field': ['get', 'title'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 2.5,
          'text-justify': 'auto',
          'text-size': 24,
          'icon-image': 'marker',
          'icon-size': 0.5
        }
      })

      map.on('click', 'points', (e: any) => {
        // something weird happens when fly to at min zoom
        storeSideMenu.value.$patch({
          id: e.features[0].properties.id,
          neighborhood: e.features[0].properties.neighborhood,
          isOpen: true,
          title: e.features[0].properties.title,
          description: e.features[0].properties.description,
          mediaType: e.features[0].properties.mediaType,
          url: e.features[0].properties.url,
          // slideShow: e.features[0].properties.slideShow // why doesn't this work?
          slideShow: landmarks[e.features[0].properties.id].properties.slideShow
        })
        map.flyTo({
          center: e.features[0].geometry.coordinates,
          zoom: 18
        })
      })

      map.on('mouseenter', 'points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = ''
      })
    })
  },
  methods: {
    flyToNextMarker(goNext: boolean) {
      var newID: number = goNext ? storeSideMenu.value.id + 1 : storeSideMenu.value.id - 1
      if (newID <= 0) newID = Object.keys(landmarks).length - 1
      else if (newID >= Object.keys(landmarks).length) newID = 1
      storeSideMenu.value.$patch({
        id: landmarks[newID].properties.id,
        neighborhood: landmarks[newID].properties.neighborhood,
        isOpen: true,
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
  See: https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
  See: https://maplibre.org/maplibre-style-spec/sources/#image
  See: https://maplibre.org/maplibre-gl-js/docs/examples/multiple-geometries/
  Example: https://jsfiddle.net/oh8Ld1ry/1/
  Discussion: https://github.com/mapbox/mapbox-gl-js/issues/4736
  Discussion: https://stackoverflow.com/questions/66210679/mapbox-gl-js-how-to-add-multiple-photo-sources-on-a-single-layer
-->
