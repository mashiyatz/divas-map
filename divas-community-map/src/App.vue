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
// Following this example: https://maplibre.org/maplibre-gl-js/docs/examples/restrict-bounds/

import { Map, MapMouseEvent, type LngLatBoundsLike } from 'maplibre-gl'

const bounds: LngLatBoundsLike | undefined = [
  [-74.050696, 40.547044], // Southwest coordinates
  [-73.817894, 40.721256] // Northeast coordinates
]

const landmarks = [
  {
    url: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd', 
    id: 'Place 1', 
    coords: [-73.9978, 40.7209]
  }, 
  {
    url: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd', 
    id: 'Place 2', 
    coords: [-73.9978, 40.7209]
  },
  {
    url: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd', 
    id: 'Place 3', 
    coords: [-73.9978, 40.7209]
  }
]

export default {
  mounted() {
    const map: Map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=vbWcEeVNDHjFUuEi2uGd',
      center: [-73.9978, 40.7209],
      pitch: 60,
      minPitch: 60,
      maxPitch: 60,
      zoom: 12,
      maxBounds: bounds
    })

    map.on('load', async () => {
        var image = await map.loadImage("https://upload.wikimedia.org/wikipedia/commons/7/74/Location_icon_from_Noun_Project.png");
        map.addImage("marker", image.data);
        // See: https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource
        // See: https://maplibre.org/maplibre-style-spec/sources/#image
        // See: https://maplibre.org/maplibre-gl-js/docs/examples/multiple-geometries/
        // Example: https://jsfiddle.net/oh8Ld1ry/1/
        // Discussion: https://github.com/mapbox/mapbox-gl-js/issues/4736
        // Discussion: https://stackoverflow.com/questions/66210679/mapbox-gl-js-how-to-add-multiple-photo-sources-on-a-single-layer
        map.addSource('point', { // creating a new type of source
              'type': 'geojson',
              'data': {
                  'type': 'FeatureCollection',
                  'features': [
                      {
                        'type': 'Feature',
                        "properties": {},
                        'geometry': {
                          'type': 'Point',
                          'coordinates': [-73.97549301444425, 40.674121965974805]
                        }
                      },
                      {
                        'type': 'Feature',
                        "properties": {},
                        'geometry': {
                          'type': 'Point',
                          'coordinates': [-73.94201080976683, 40.63684839590867]
                        }
                      },
                      {
                        'type': 'Feature',
                        "properties": {},
                        'geometry': {
                          'type': 'Point',
                          'coordinates': [-73.9978, 40.7209]
                        }
                      }
                  ]
              }
          });
        
          // want to keep images in a single layer
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point',
            'layout': {
              'icon-image': 'marker',
              'icon-size': 0.1
            }
          })

          map.on('click', 'points', (e: any) => {
            map.flyTo({
                center: e.features[0].geometry.coordinates
            });
          });

          // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
          map.on('mouseenter', 'points', () => {
              map.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to a pointer when it leaves.
          map.on('mouseleave', 'points', () => {
              map.getCanvas().style.cursor = '';
          });
        }
      )}
    }
</script>

<style lang="scss" scoped>
// div containing map has to have nonzero width and height
#map {
  height: 100vh;
  width: 100vw;
}
</style>
