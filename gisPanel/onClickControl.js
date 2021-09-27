class ToggleControl {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = ' mapboxgl-ctrl my-custom-control';
  
      
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
    _createButton(className) {
      const el = window.document.createElement('div')
      el.className = className;
      el.setAttribute('id', 'clickInfo');
      el.textContent = 'toggleControl';
      el.addEventListener('click',(e)=>{
        e.style.display = 'none'
        console.log(e);
        // e.preventDefault()
        e.stopPropagation()
      },false )
      return el;
    }
  }



  function onDataClick(clicked) {
    console.log(clicked);

    var clickDiv = document.getElementsByClassName('my-custom-control')[0]
    clickDiv.style.display = 'block'
    clickDiv.style.height = '100px';
    clickDiv.style.width = '200px';

    clickDiv.innerHTML = '<h4><b>Value: </b>' + 
                            clicked.features[0].properties[currentGeojsonLayers.dataLayer].toLocaleString() + ' ' + 
                            document.getElementById("legendTitle").textContent + '</h4>';


    var legData = _.find(allLayers, ['field_name', currentGeojsonLayers.dataLayer])
    


    //console.log(legData);

    if (map.getSource('highlightS')) {
        map.removeLayer('highlight')
        map.removeSource('highlightS')
    }

    if (map.getSource('clickedone')) {
        map.removeLayer('clickedone')
        map.removeSource('clickedone')
    }

    var currId = clicked.features[0].id

    var feats = map.queryRenderedFeatures({
        layers: [currentGeojsonLayers.hexSize],
        filter: ['==', 'hexid', currId]
    })

    console.log(feats)


    //var testAdmin = map.querySourceFeatures()


    var fc = turf.featureCollection(feats);
   // console.log(fc);
    var dis = turf.dissolve(fc);


    map.addSource('clickedone', {
        'type': 'geojson',
        'data': dis

    })

    map.addLayer({
        'id': 'clickedone',
        'source': 'clickedone',
        'type': 'line',
        'paint': {
            'line-color': 'purple',
            'line-width': 3
        }
    })

  }

  function addAdminClick(e) {


    var clickDiv = document.getElementsByClassName('my-custom-control')[0]
    clickDiv.style.display = 'block'
    clickDiv.style.height = '100px';
    clickDiv.style.width = '200px';


    console.log(e.features[0].properties)

    

    //map.on('click', currentGeojsonLayers.hexSize, function (e) {

        console.log(e.features[0].properties.GID_1);
        //console.log(e.features[0].geometry);

        /*var feats = map.queryRenderedFeatures({
          layers: ['admin1'],
          filter: ['==', 'GID_1', e.features[0].id]
          
        }) */

        var rendered = map.queryRenderedFeatures({
            layers: ['admin1']
        })

        var feats;
        if(currentGeojsonLayers.hexSize === 'admin1') {

        
         feats = map.querySourceFeatures('admin1', {
            sourceLayer: ['admin1'],
            filter: ['==', 'GID_1', e.features[0].id]

          })
          
          clickDiv.innerHTML = '<h4><b>' + e.features[0].properties.NAME_1 + ' ' + e.features[0].properties.TYPE_1 +  '</b></h4>' + '<br><h4><b>Value: </b>' + 
                            e.features[0].properties[currentGeojsonLayers.dataLayer].toLocaleString() + ' ' + 
                            document.getElementById("legendTitle").textContent + '</h4>';
      
      
      }  else if (currentGeojsonLayers.hexSize === 'admin2') {

        
          feats = map.querySourceFeatures('admin2', {
             sourceLayer: ['admin2'],
             filter: ['==', 'GID_2', e.features[0].id]
 
         })

         clickDiv.innerHTML = '<h4><b>Value: </b>' + 
                            e.features[0].properties[currentGeojsonLayers.dataLayer].toLocaleString() + ' ' + 
                            document.getElementById("legendTitle").textContent + '</h4>';

      }

        //console.log(feats);
        var countries = []
        rendered.map(function (x) {
            countries.push(x.properties.NAME_0)
        })

        //console.log(_.uniq(countries));




        if (map.getSource('highlightS')) {
            map.removeLayer('highlight')
            map.removeSource('highlightS')
        }

        if (map.getSource('joined')) {
            map.removeLayer('joined')
            map.removeSource('joined')
        }

        map.addSource('highlightS', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': []
            }
        })

        map.addLayer({
            'id': 'highlight',
            'source': 'highlightS',
            'type': 'line',
            'paint': {
                'line-color': 'purple',
                'line-width': 3
            }
        })

        console.log(feats);
        if (feats.length > 1) {

            var newOne = []

            feats.forEach(function(f){
                var geom = f.geometry
                var props = f.properties
                var id = f.id;

                if(geom.type === 'MultiPolygon') {
                    console.log(f);
                    for (var i=0; i < geom.coordinates.length; i++) {
                        var poly = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': geom.coordinates[i]
                            },
                            'id': id,
                            'properties': props
                        }
                        newOne.push(poly);
                    }
                } else {
                    newOne.push(f)
                }

                
            })

            //var fc = turf.featureCollection(feats)
            var fc = turf.featureCollection(newOne);
            //console.log(fc);
            var joined = turf.dissolve(fc);
            //var joined = turf.union(...newOne);
            //console.log(joined);
            //map.getSource('highlightS').setData(joined)
            var allGeos = []

            map.addSource('joined', {
                type: 'geojson',
                data: {
                    'type': 'FeatureCollection',
                    'features': []
                }
            })


            map.addLayer({
                'id': 'joined',
                'source': 'joined',
                'type': 'line',
                'paint': {
                    'line-color': 'purple',
                    'line-width': 3
                }
            })

            map.getSource('joined').setData(joined)

      


        } else {
            map.getSource('highlightS').setData(feats[0])
        }

   // })

}
  