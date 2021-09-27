function handleFileSelect(evt) {
    console.log(evt.target.files[0])
    evt.stopPropagation();
    evt.preventDefault();
    var file;
    //console.log(evt.dataTransfer)
    if(typeof evt.dataTransfer === 'undefined') {
        file = evt.target.files[0]
    } else {
        file = evt.dataTransfer.files[0]; // FileList object.
    }

    //console.log(file)
    //console.log(file.size);

    let last_dot = file.name.lastIndexOf('.')
    let ext = file.name.slice(last_dot + 1)
    
    //let name = filename.slice(0, last_dot)

    //console.log(file.type);
    var reader = new FileReader();
    reader.onloadend = function(e) {


       // console.log(this.result);
        console.log(ext)
       // var result = JSON.parse(this.result);
        //console.log(result);

        
            addUploadToMap(this.result, ext)
      
      /* if (file.size > 52428800) {
            alert('file is too big, aim for under 50mb!')
        } else {
            alert('this file is not an acceptable type');
        } */
    }

    reader.readAsText(file);
    
}




function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('map');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

document.getElementById('upload').addEventListener('change', handleFileSelect, false)


function addUploadToMap(res, ext) {

   // console.log(res);

    //remove an uploaded layer if there's already one
    if (map.getLayer('upload')) {
        map.removeLayer('upload')
        map.removeLayer('uploadline')
        map.removeSource('upload')
        $('#removeUpload').hide()
       // $('#draw-sidebar').hide();

    }

   /* var clickDiv = document.getElementsByClassName('my-custom-control')[0]
    clickDiv.style.display = 'block'
    clickDiv.style.height = '200px';
    clickDiv.style.width = '200px';
    clickDiv.innerHTML = '<h3>'+ res.name +'</h3>' */

    //show button to remove
    //$('#removeUpload').show()
    //$('#draw-sidebar').show();



    //if geojson do this
    if(ext === 'geojson' || ext === 'json') {


        res = JSON.parse(res)
        console.log(res);


        map.addSource('upload', {
            'type': 'geojson',
            'data': res
        })

        map.addLayer({
            'id': 'upload',
            'type': 'fill',
            'source': 'upload',
            'paint': {
               
                'fill-opacity': 0.0,
                

            }
        })

        map.addLayer({
            'id': 'uploadline',
            'type': 'line',
            'source': 'upload',
            'paint': {
                'line-color': 'red',
                'line-opacity': 0.7,
                'line-width': 4

            }
        })

        for (var x in res.features){
            //console.log(res.features[x].properties);
        }


        var uploadBbox = turf.bbox(res)
    // console.log(uploadBbox);

        map.fitBounds(uploadBbox, {
            linear: true,
            padding: {
                top: 10,
                bottom: 25,
                left: 15,
                right: 5
            }
                
        })
        $('#removeUpload').show()

        //console.log(map.getStyle().layers)
      /*  const newButton = document.createElement('BUTTON')
        newButton.innerHTML('change to outline')

        newButton.on('click', function(e) {
            console.log('howdy')
        })*/
        //clickDiv.appen
       

        map.on('click', 'upload', (e) => {

            console.log(e.lngLat)
            //console.log(e.features[0].properties.lngLat)
            var description = '';
            
            for (var x in e.features[0].properties) {
                console.log(x);
                

                
                description += x + ': ' + e.features[0].properties[x] + '<br>';
                console.log(e.features[0].properties[x])
                console.log('---')

                
            }

            new mapboxgl.Popup({
                className: 'upload-pop'
            })
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(map);


        })


    } else if (ext === 'csv') { //if csv, assume it's points

        console.log(res);
        console.log('its a csv')

        csv2geojson.csv2geojson(res, function(err, data) {

            if (err) throw err;
            //console.log(err);

            var uploadBbox = turf.bbox(data)
             console.log(uploadBbox[0]);

            if(uploadBbox[0] === Infinity) {
                alert('cannot detect latitude and longitude fields. Make sure data has a spatial component or that the latitude and longitude columns are named Lat and Lng')
            
            } else {

            $('#removeUpload').show()
            console.log(data)

            map.addSource('upload', {
                'type': 'geojson',
                'data': data
            })

            map.addLayer({
                'id': 'upload',
                'type': 'circle',
                'source': 'upload',
                'paint': {
                    'circle-color': 'red',
                    'circle-radius': 4
                }
            })

           /* var uploadBbox = turf.bbox(data)
             console.log(uploadBbox);*/

            map.fitBounds(uploadBbox, {
                linear: true,
                padding: {
                    top: 40,
                    bottom: 40,
                    left: 40,
                    right: 40
                }
                    
            })
        }

        });

        map.on('click', 'upload', (e) => {

            console.log(e.lngLat)
            //console.log(e.features[0].properties.lngLat)
            var description = '';
            
            for (var x in e.features[0].properties) {
                console.log(x);
                

                
                description += x + ': ' + e.features[0].properties[x] + '<br>';
                console.log(e.features[0].properties[x])
                console.log('---')

                
            }

            new mapboxgl.Popup({
                className: 'upload-pop'
            })
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(map);


        })

      








    } else {

        //?????????

        alert('oops we need a csv or geojson')
    }

}




$('#removeUpload').on('click', function() {


    map.removeLayer('upload')
    map.removeLayer('uploadline')
    map.removeSource('upload')
    $('#removeUpload').hide()
    //$('#draw-sidebar').hide();


})

