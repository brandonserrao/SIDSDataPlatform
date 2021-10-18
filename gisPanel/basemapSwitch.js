function basemapSwitch(object) {

    //var othe

    var selectedBase = Object.values(object)[0]
    var currentBase = map.getStyle().name;




    console.log(selectedBase);
    //console.log(currentBase);
    
    if (selectedBase === 'Mapbox Light') {
        console.log(basemapLabels);
        //basemapLabels = [];
        var thisStyle = _.find(styles, function (o) {
            return o.title === 'Light'
        })

        map.setStyle(thisStyle.uri)
        console.log(map.getStyle().sources)

    } else if(selectedBase === 'Mapbox Satellite Streets') {

        console.log(basemapLabels);
        
        var thisStyle = _.find(styles, function (o) {
            return o.title === 'Satellite With Labels'
        })

        map.setStyle(thisStyle.uri)


        map.once('idle', function(){

            map.removeLayer('admin-1-boundary')
            map.removeLayer('road-label')
            map.removeLayer('road-number-shield')
            map.removeLayer('road-exit-shield')
            map.removeLayer("admin-1-boundary-bg")
            map.removeLayer('airport-label')

        })



        console.log(map.getStyle().sources)
    } else if(selectedBase === 'Mapbox Dark') {

        console.log(basemapLabels);
        
        var thisStyle = _.find(styles, function (o) {
            return o.title === 'Mapbox Dark'
        })

        map.setStyle(thisStyle.uri)
        console.log(map.getStyle().sources)
    }
    

        map.once('idle', function () {

            basemapLabels = [];
            var layers = map.getStyle().layers;

            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    firstSymbolId = layers[i].id;
                    break;
                }
            }
            for (var x in layers) {

                if (layers[x].type === 'symbol'|| layers[x].type === 'line') {
                    basemapLabels.push(layers[x]);
                }
            }

            addHexSource();
            //console.log(map.getStyle().layers);
            var current = _.find(sourceData, function (o) {
                return o.name === currentGeojsonLayers.hexSize
            })

            console.log(current)
            if(current.name === 'ocean') {
                console.log('ocean')
            } else {

            
            map.addLayer({

                'id': currentGeojsonLayers.hexSize,
                'type': 'fill',
                'source': currentGeojsonLayers.hexSize,
                'source-layer': current.layer,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-opacity': 0.8,
                    'fill-color': [
              'interpolate',
              ['linear'],
              ['get', currentGeojsonLayers.dataLayer],
              currentGeojsonLayers.breaks[0], currentGeojsonLayers.color[0],
              currentGeojsonLayers.breaks[1], currentGeojsonLayers.color[1],
              currentGeojsonLayers.breaks[2], currentGeojsonLayers.color[2],
              currentGeojsonLayers.breaks[3], currentGeojsonLayers.color[3],
              currentGeojsonLayers.breaks[4], currentGeojsonLayers.color[4],
              ]
                }
            }, firstSymbolId)

            map.setFilter(currentGeojsonLayers.hexSize, ['>=', currentGeojsonLayers.dataLayer, 0])
            map.moveLayer('allsids', firstSymbolId)

        }
            //console.log(map.getStyle().layers);
        })



}