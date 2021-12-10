//download button functions
function downloadData(obj) {
    map.setFilter(currentGeojsonLayers.hexSize, null)
    console.log(currentGeojsonLayers.hexSize)
    //openDownloadPage()


    console.log(obj)


    /*
    if (obj['File-type'] === 'geojson') {


        exportGeojson(obj)


    } else if(obj['File-type'] === 'csv') {

        //function to export csv here

    } else if(obj['File-type'] === 'shp') {

        exportShp(obj)
    }
    */

setTimeout(() => {


    if(hexes.includes(currentGeojsonLayers.hexSize)) {


        var features = map.queryRenderedFeatures({
            
            layers: [currentGeojsonLayers.hexSize]
        })

        if (features) {

            var uniFeatures;
            uniFeatures = getUniqueFeatures(features, 'hexid');
            

            //console.log(features)
            //console.log(uniFeatures);


            map.addSource('screen', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                
                'features': uniFeatures
            }
            }) 


            map.addLayer({
            'id': 'screenshot',
            'source': 'screen',
            'type': 'line',
            'paint': {
                'line-color': '#66ff00',
                'line-width': 3
            }
            })



            var gdata = uniFeatures//map.getSource('screen')._data;


            if (obj['File-type'] === 'geojson') {


                exportGeojson(obj, gdata)
    
    
            } else if(obj['File-type'] === 'csv') {
    
                //function to export csv here
    
            } else if(obj['File-type'] === 'shp') {
    
                exportShp(obj, gdata)
            }


    }


} else if(admins.includes(currentGeojsonLayers.hexSize)) {



    console.log('hi')
    var features = map.queryRenderedFeatures({
        layers: ['allsids']
    })

    console.log(features)
    var currentC = features.map(x => x.properties.NAME_0)

    console.log(currentC);

    var features1 = map.queryRenderedFeatures({
        layers: [currentGeojsonLayers.hexSize]
    })
    
    
    newOne = []

    var propers = {}

    features1.forEach(function(f){
        var geom = f.geometry
        var props = f.properties
        var id = f.id;
        propers[id] = props

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

    var fc = turf.featureCollection(newOne)
    console.log(fc);

    var propName = 'GID_2'

    if(currentGeojsonLayers.hexSize === 'admin1') {
        propName = 'GID_1'
    }
   
    var diss = turf.dissolve(fc, {propertyName: propName})
    
    
    

    for (var x in diss.features) {
        if(currentGeojsonLayers.hexSize === 'admin2') {
            var curr = diss.features[x].properties.GID_2;
        } else {
            var curr = diss.features[x].properties.GID_1;
        }
       

        console.log(curr)

        diss.features[x].properties = propers[curr]
    }

    console.log(diss)
   // openDownloadPage(currentGeojsonLayers.hexSize, diss);

   if (obj['File-type'] === 'geojson') {


            exportGeojson(obj, diss)


        } else if(obj['File-type'] === 'csv') {

            //function to export csv here

        } else if(obj['File-type'] === 'shp') {

            exportShp(obj, diss)
        }


    map.addSource('screen', {
        type: 'geojson',
        data: {
            'type': 'FeatureCollection',
            
            'features': []
        }
        }) 

        map.addLayer({
        'id': 'screenshot',
        'source': 'screen',
        'type': 'line',
        'paint': {
            'line-color': '#66ff00',
            'line-width': 3
        }
        })

        map.getSource('screen').setData(diss)



} },400)

 
};



function exportShp(hexsize,obj, removeOnes) {

    var fc = obj;


    if(hexes.includes(hexsize)) {
        fc = turf.featureCollection(obj)
    }

    //console.log(obj);

    var fc = turf.featureCollection(obj)

    for (var x in fc.features) {
        for (var y in removeOnes) {
            delete fc.features[x].properties[removeOnes[y]]
        }
    }

    console.log(fc)

    const options = {
        folder: 'SIDSshapefile',
        types: {
            polygon: currentGeojsonLayers.hexSize.toString()
        }
    }
    shpwrite.download(fc, options);
    map.setFilter(currentGeojsonLayers.hexSize, ['>=', currentGeojsonLayers.dataLayer, 0])
    //$('.modal').toggle();
    //$('body').css('overflow', '')
    map.removeLayer('screenshot')
    map.removeSource('screen');

}

function exportGeojson(obj, gdata) {

    
    console.log(obj)


    var fc = gdata;


    if(hexes.includes(obj['resolution'])) {
        fc = turf.featureCollection(gdata)
    }
      
    
        
       

    //var fc = turf.featureCollection(gdata)

    convertThis(fc, removeOnes);
    

function convertThis(fc, removeOnes) {

    console.log(removeOnes)

    //var fc = turf.featureCollection(feats)
    for (var x in fc.features) {

        for (var y in removeOnes) {

            delete fc.features[x].properties[removeOnes[y]]
        }

    }
   
    
    var datastring = "data:text/json;charset=utf-8, " + encodeURIComponent(JSON.stringify(fc))
    var link = document.createElement('a');
    link.download = 'download.geojson';
    link.href = datastring
    link.click();
    link.delete; 

    

}

    

  

    var datastring = '';
    //$('.modal').toggle();
    map.setFilter(currentGeojsonLayers.hexSize, ['>=', currentGeojsonLayers.dataLayer, 0])
    $('body').css('overflow', '')
    map.removeLayer('screenshot')
    map.removeSource('screen');
    
}

/* $('.close').click(function () {
    map.setFilter(currentGeojsonLayers.hexSize, ['>=', currentGeojsonLayers.dataLayer, 0])
    $('.modal').toggle();
    $('body').css('overflow', '')
   // map.setZoom(oldZoom);
    //map.setCenter(oldCenter)
    map.removeLayer('screenshot')
    map.removeSource('screen');
    

}) */
