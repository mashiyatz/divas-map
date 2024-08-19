<script lang="ts">
// Following this example: https://maplibre.org/maplibre-gl-js/docs/examples/restrict-bounds/

import { Map, type LngLatBoundsLike } from 'maplibre-gl'
import { sideMenuStore } from '@/stores/sideMenuState'

const bounds: LngLatBoundsLike | undefined = [
  [-74.050696, 40.547044], // Southwest coordinates
  [-73.817894, 40.721256] // Northeast coordinates
]

export default {
  mounted() {
    const map: Map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      center: [-73.9978, 40.7209],
      pitch: 45,
      minPitch: 30,
      maxPitch: 60,
      zoom: 14,
      maxBounds: bounds
    })

    map.on('load', async (e) => {
      var markerImage = await map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/7/74/Location_icon_from_Noun_Project.png'
      )
      const storeSideMenu = sideMenuStore()

      map.addImage('marker', markerImage.data)
      map.addSource('point', {
        // can generate object with all relevant information, then search that object within properties
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                title: 'Somewhere A',
                foo: 'heee'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.97549301444425, 40.674121965974805]
              }
            },
            {
              type: 'Feature',
              properties: {
                title: 'Somewhere B',
                foo: 'hoo'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.94201080976683, 40.63684839590867]
              }
            },
            {
              type: 'Feature',
              properties: {
                title: 'Somewhere C',
                foo: 'haa'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.9978, 40.7209]
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
          'icon-image': 'marker',
          'icon-size': 0.1
        }
      })

      map.on('click', 'points', (e: any) => {
        map.flyTo({
          center: e.features[0].geometry.coordinates
        })
        storeSideMenu.$patch({
          isOpen: true,
          title: e.features[0].properties.title,
          description: e.features[0].properties.foo
        })
      })

      map.on('mouseenter', 'points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = ''
      })
    })
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
