const button3dWrapper = document.getElementById('height')

button3dWrapper.addEventListener('click', (event) => {

    var id3d = currentGeojsonLayers.hexSize + '-3d'

    if (map.getLayer(id3d)) {
        //console.log('yooo')
        map.removeLayer(id3d);
        //map.setBearing(70)
        map.easeTo({
            center: map.getCenter(),
            pitch: 0,

        })
    } else {


        //rotateCamera(0)

        console.log(currentGeojsonLayers);
        var current = _.find(sourceData, function (o) {
            return o.name === currentGeojsonLayers.hexSize
        })

        map.addLayer({
            'id': id3d,
            'type': 'fill-extrusion',
            'source': currentGeojsonLayers.hexSize,
            //'source-layer': 'hex5_3857',
            'source-layer': current.layer,
            'layout': {
                'visibility': 'visible'
            },

            'paint': {
                'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', currentGeojsonLayers.dataLayer],
            currentGeojsonLayers.breaks[0], currentGeojsonLayers.color[0],
            currentGeojsonLayers.breaks[1], currentGeojsonLayers.color[1],
            currentGeojsonLayers.breaks[2], currentGeojsonLayers.color[2],
            currentGeojsonLayers.breaks[3], currentGeojsonLayers.color[3],
            currentGeojsonLayers.breaks[4], currentGeojsonLayers.color[4],
            ],
                'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['get', currentGeojsonLayers.dataLayer],
              currentGeojsonLayers.breaks[0], 0,
              currentGeojsonLayers.breaks[1], 500,
              currentGeojsonLayers.breaks[2], 5000,
              currentGeojsonLayers.breaks[3], 11000,
              currentGeojsonLayers.breaks[4], 50000,
              ],

                //'fill-opacity': 0.8,

            }
        }, firstSymbolId);

        map.setFilter(id3d, ['>=', currentGeojsonLayers.dataLayer, 0])
        map.easeTo({
            center: map.getCenter(),
            pitch: 55

        })
    }
}) //end 3d