<script lang="ts">
// Following this example: https://maplibre.org/maplibre-gl-js/docs/examples/restrict-bounds/

import { Map, type LngLatBoundsLike } from 'maplibre-gl'
import { sideMenuStore } from '@/stores/sideMenuState'

// fix bounds around Queens
const bounds: LngLatBoundsLike | undefined = [
  [-74.050696, 40.547044], // Southwest coordinates
  [-73.817894, 40.721256] // Northeast coordinates
]

const loremIpsum =
  'Lorem ipsum odor amet, consectetuer adipiscing elit. Curae litora duis potenti elementum quam hac. Mollis fusce nisl purus lacinia tortor posuere rhoncus lacinia. Suscipit nascetur augue molestie faucibus facilisi habitasse. Euismod pellentesque turpis sed iaculis non adipiscing porttitor. Odio venenatis litora montes ad justo hendrerit.'

export default {
  mounted() {
    const map: Map = new Map({
      container: 'map',
      style:
        'https://api.maptiler.com/maps/2b4ffeb2-c0c6-4892-9881-e78c2d8a6181/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      center: [-73.74959, 40.682273],
      pitch: 45,
      minPitch: 30,
      maxPitch: 60,
      zoom: 18
      // maxBounds: bounds
    })

    map.on('load', async () => {
      var markerImage = await map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Pin-location.png'
      )
      const storeSideMenu = sideMenuStore()

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
              properties: {
                id: 1,
                title: 'A Live Kitchen',
                description:
                  "Making Vegan Living Easy. Owner Steffen Alexander grew up in this neighborhood in Queens and struggled to find clean food with good taste. He didn't want to wait for the solution to come along - he wanted to BE the solution. Steffen opened A Live Kitchen to promote healthy living and offer an easy solution for customers to go vegan.",
                mediaType: 'video', // replace these tags?
                url: 'https://www.youtube.com/embed/UQUPEPOfczk?si=CWK09YE0ZtS5ngaL'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.742605, 40.676574]
              }
            },
            {
              type: 'Feature',
              properties: {
                id: 2,
                title: 'P.S. 156',
                description: loremIpsum,
                mediaType: 'image',
                url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Laurelton_228at138.png'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.743378, 40.672576]
              }
            },
            {
              type: 'Feature',
              properties: {
                id: 3,
                title: 'P.S. 132',
                description: loremIpsum,
                mediaType: 'image',
                url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Laurelton_228at138.png'
              },
              geometry: {
                type: 'Point',
                coordinates: [-73.74959, 40.682273]
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
          'icon-size': 0.5
        }
      })

      map.on('mouseenter', 'points', (e: any) => {
        map.flyTo({
          center: e.features[0].geometry.coordinates
        })
        storeSideMenu.$patch({
          id: e.features[0].properties.id,
          isOpen: true,
          title: e.features[0].properties.title,
          description: e.features[0].properties.description,
          mediaType: e.features[0].properties.mediaType,
          url: e.features[0].properties.url
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
