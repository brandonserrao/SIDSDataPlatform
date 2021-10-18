var allLayers = [];
var firstSymbolId;
var oldZoom;
var oldCenter;
const userLayers = ['hex5', 'hex5clipped', 'hex10', 'admin1', 'admin2', 'hex1', 'ocean'];
var hexes = ['hex5', 'hex10', 'hex1', 'hex5clipped']
var admins = ['admin1', 'admin2']
var basemapLabels = [];
var myHistogram;
var precision;


//separate out master vs other
//delete non used code
//comment every function!!
//finish docs as well
//finish 



//object for all styles for basemap switch -- could be moved out
const styles = [
    {
        'title': "Satellite With Labels",
        'uri': "mapbox://styles/mapbox/satellite-streets-v11",
    },
    {
        'title': "Light",
        'uri': "mapbox://styles/mapbox/light-v10",
    },
    {
        'title': "Satellite Imagery",
        'uri': "mapbox://styles/mapbox/satellite-v9",
    },
    {
        'title': "Mapbox Dark",
        'uri': 'mapbox://styles/mapbox/dark-v10'
    }
];

//addButtons();


/*Initialize Map KEEP HERE IN THIS FILE*/

//get UNDP mapbox account
mapboxgl.accessToken = "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";

const map = new mapboxgl.Map({
    container: "map", // container ID
    //style: 'mapbox://styles/mapbox/light-v10?optimize=true', //?optimize=true
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [-71.5, 19.0], // starting position [lng, lat]
    zoom: 7,
    //preserveDrawingBuffer: true,
    maxZoom: 14,
    //minZoom: 
    //pitch: 55
});

//global variables for the time click through KEEP HERE for now
var yearList = [];
var currentTimeLayer;

  

  
//all source data info KEEP HERE
  var sourceData = {
      hex5Source: {
        name: 'hex5',
        layer: 'hex5',
        mainId: 'hexid',
        data: null
    },
    hex10Source: {
        name: 'hex10',
        layer: 'hex10',
        mainId: 'hexid',
        data: null
    },
    admin1Source: {
        name: 'admin1',
        mainId: 'GID_1',
        layer: 'admin1',
        data: null
    },
    admin2Source: {
        name: 'admin2',
        mainId: 'GID_2',
        layer: 'admin2',
        data: null
    },
    hex1Source: {
        name: 'hex1',
        layer: 'hex1',
        mainId: 'hexid',
        data: null
    },
    oceanSource: {
        name: 'ocean',
        layer: 'oceans',
        mainId: null,
        data: null
    },
    hex5clippedSource: {
        name: 'hex5clipped',
        layer: 'hex5clipped',
        mainId: 'hexid',
        data: null

    }

}


//current layer state manager KEEP HERE

var currentGeojsonLayers = {
    color: null,
    breaks: null,
    dataLayer: null,
    hexSize: 'hex5'
};
var legendControl;


//this is for the draw feature - can probably move
function closeSide() {
    $('#draw-sidebar').hide();
}



//initializes draw -- KEEP HERE for now
const Draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
    polygon: true,
    trash: true
    },
    //defaultMode: 'draw_polygon'
  });

//global variable for minimap
var minimap;


//IMPORTANT STARTING FUNCTION KEEP HERE
//on map load - bascially initialize everything
map.on("load", function () {

    //add scale bar
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    //initialize and add minimap
    minimap = new mapboxgl.Minimap({
        center: map.getCenter(),
        zoom: 6,
        togglePosition: 'topleft',
        style: "mapbox://styles/mapbox/light-v10",
        //minimized: true
      });

      map.addControl(minimap, 'bottom-right');

      //minimize it to start
      minimap.toggle();

    var layers = map.getStyle().layers;

    //console.log(layers);
    // Find the index of the first symbol layer in the map style
    // we put all hex/admin layers below the words
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }


    //random layers from mapbox basemaps -- basically mapbox basemaps aren't just one basemap, but a collection of usually 50+ different layers.
    //if you're interested, console.log(map.getStyle().layers) to see them all or google around
    map.removeLayer('admin-1-boundary')
    map.removeLayer('road-label')
    map.removeLayer('road-number-shield')
    map.removeLayer('road-exit-shield')
    map.removeLayer("admin-1-boundary-bg")
    map.removeLayer('airport-label')

    var layers = map.getStyle().layers;
    //console.log(layers);

    //this loop adds all symbol and line layers to an object that it used to add or remove the labels
    for (var x in layers) {

        if (layers[x].type === 'symbol' || layers[x].type === 'line') {
            basemapLabels.push(layers[x]);
        }
    }


    //the search for a country part
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Search for City or Country',
        //flyTo: false,
        types: 'country, place',
        clearOnBlur: true,
        marker: false,
        collapsed: true,

    })

    //geocoder.addTo('.search-icon')//add the search to the icon in the top right
    document.getElementById('drawControls').appendChild(Draw.onAdd(map))

    //the on click popup part - just adding it, but it is only filled in when something is selected, see onClickControl.js
    const toggleControl = new ToggleControl()
    map.addControl(toggleControl,'bottom-right')
   

    //adds the sources, populates drop downs, adds draw function listeners
    addButtons()
    addHexSource()
    drawListeners()

});


//map loads with a random country - outside of map.load
randomStart();


//function taken from mapbox that extracts unique features, see comment below
function getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function (el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });

    return uniqueFeatures;
}



//randomly loads a country to start with from sidsNames.js
//this has some issues I think, can be done better
function randomStart(){

    var nogos = [0, 1, 2, 4, 12, 16, 24, 25, 26, 27, 28, 29, 31,32, 41, 43, 45, 47, 48, 50, 52] // countries that it shouldn't start with - can be adjusted obvi
    var rando;

    function getRandomNumber(){
        return Math.round(Math.random() * (names.length - 0) + 0)
    }

    do {
        rando = getRandomNumber();
        var boun = new mapboxgl.LngLatBounds([names[rando].bb[0], names[rando].bb[1]])
        map.fitBounds(boun, {
            linear: true,
            padding: 100
        })

    } while (nogos.includes(rando)) {

        rando = getRandomNumber()

    }

    if(!nogos.includes(rando)) {
        
        console.log(names[rando]);
        console.log(rando);

        var boun = new mapboxgl.LngLatBounds([names[rando].bb[0], names[rando].bb[1]])
        map.fitBounds(boun, {
            linear: true,
            padding: 100
        })

    }
    
}



//can make own file -- adds/remove labels
function addLabels(object) {

    var sel = Object.values(object)[0]
    console.log(sel)
    console.log(basemapLabels)

   // console.log($('#addLabels')[0].innerText)
    if (sel === 'On') {
        basemapLabels.forEach(function (x) {
            //console.log(x);
            map.addLayer(x);
            if(x.type === 'line') {
                if(map.getLayer(currentGeojsonLayers.hexSize)) {
                    map.moveLayer(x.id, currentGeojsonLayers.hexSize)
                }
            
            }
            
        })
        //$('#addLabels').toggle();
        //$('#addLabels')[0].innerText = 'Remove Labels'
    } else {
        basemapLabels.forEach(function (x) {
            map.removeLayer(x.id);
        })

        //$('#addLabels')[0].innerText = 'Add Labels'
    }


}


//IMPORTANT KEEP HERE
function recolorBasedOnWhatsOnPage() {

    if(!map.getLayer(currentGeojsonLayers.hexSize)) {
      console.log('no layer')
      return;
    }

    var features = map.queryRenderedFeatures({
        layers: [currentGeojsonLayers.hexSize]
    })

    //createMask(features);

    //console.log(currentGeojsonLayers.hexSize);
    if(features.length > 0) {      

        var uniFeatures;
        if (currentGeojsonLayers.hexSize === 'admin1') {
            uniFeatures = getUniqueFeatures(features, 'GID_1');
        } else if (currentGeojsonLayers.hexSize === 'admin2') {
            uniFeatures = getUniqueFeatures(features, 'GID_2');
        } else {
            uniFeatures = getUniqueFeatures(features, 'hexid');
        }


        //console.log(uniFeatures.features);
        var selecteData = features.map(x => x.properties[currentGeojsonLayers.dataLayer])
        //console.log(selecteData);
        var breaks = chroma.limits(selecteData, 'q', 4);
        
        //console.log("BREAK5",breaks);
        var breaks_new = [];
        precision = 1;
        do {
            precision++;
            for (let i = 0; i < 5; i++) {
                breaks_new[i] = parseFloat(breaks[i].toPrecision(precision));                    
            }
            console.log(breaks_new);
        }    
        while (checkForDuplicates(breaks_new)&&(precision<10));
        breaks = breaks_new;          
        
        
        currentGeojsonLayers.breaks = breaks;
        //console.log(breaks)
        map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-color',
        [
          'interpolate',
          ['linear'],
          ['get', currentGeojsonLayers.dataLayer],
          breaks[0], currentGeojsonLayers.color[0],
          breaks[1], currentGeojsonLayers.color[1],
          breaks[2], currentGeojsonLayers.color[2],
          breaks[3], currentGeojsonLayers.color[3],
          breaks[4], currentGeojsonLayers.color[4],
          ]
        )
        



        //if the map can't make breaks, say there's no data
        //else, show data
        //DEF COULD BE IMRPOVED

        if (isNaN(breaks[3]) || breaks[1] == 0) {

            map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.0)
            setTimeout(() => {
                map.setFilter(currentGeojsonLayers.hexSize, null)
            }, 1000);
            addNoDataLegend();
        } else {
            map.setFilter(currentGeojsonLayers.hexSize, ['>=', currentGeojsonLayers.dataLayer, 0])
            addLegend(currentGeojsonLayers.color, breaks, precision, currentGeojsonLayers.dataLayer,selecteData)
            setTimeout(() => {
                map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.8)
            }, 400);
        }
    }


}



//can be made into own script
function zoomToCountry(selection) {

    console.log(selection)
    console.log(map.getZoom())
    
    var val = $('#country option:selected').attr('id');
    console.log(val);

    map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0)
    
    var currbb = _.find(names, ['GID_0', val])

    var v2 = new mapboxgl.LngLatBounds([currbb.bb[0], currbb.bb[1]])
    map.fitBounds(v2, {
        linear: true,
        padding: {
            top: 10,
            bottom: 25,
            left: 15,
            right: 5
        },
        pitch: 0
    });

    if (currentGeojsonLayers.hexSize === 'hex1') {
        $('.loader-gis').show()
    }

    map.once('idle', function (e) {

        if (!map.getLayer('ocean')) {
            recolorBasedOnWhatsOnPage();
            $('.loader-gis').hide()
        }

        console.log('country select');
    })

}


//listener -- could add all of the map.on() functions to a different file
//some listeners are in functions, keep those there for now

map.on('dragend', function (e) {
    console.log(map.getZoom())
    console.log('dragend');
    //console.log(map.getBounds());



    if (!(map.getLayer('ocean') || map.getLayer('hex1') || map.getZoom() > 9)) {
        console.log('recolor');
        recolorBasedOnWhatsOnPage();
    }

})

map.on("zoomend", function (e) {
  console.log(map.getZoom());
  //recolorBasedOnWhatsOnPage();  if you want the map to recolor on the end of zoom
});

map.on('zoom', function (e) {

    if (map.getZoom() < 5) {

        //console.log('hi')
        $('.hexbin-change option[value="hex1"]').prop('disabled', true);
    }


    if (map.getZoom() >= 5) {

        $('.hexbin-change option[value="hex1"]').prop('disabled', false);

    }


})

map.on('click', function(e) {


    if(map.getLayer('iso')) {
        map.removeLayer('iso')
        map.removeSource('iso')
    }

    
    if (map.getSource('clickedone')) {
        map.removeLayer('clickedone')
        map.removeSource('clickedone')
    }

    if (map.getSource('highlightS')) {
        map.removeLayer('highlight')
        map.removeSource('highlightS')
    }

    if (map.getSource('joined')) {
        map.removeLayer('joined')
        map.removeSource('joined')
    }

    var clickDiv = document.getElementsByClassName('my-custom-control')[0]

    /*clickDiv.style.height = '0px';
    clickDiv.style.width = '0px'; */
    clickDiv.style.display = 'none'
    clickDiv.innerHTML = ''

})

map.on('click', 'hex5', function (e) {

        onDataClick(e);

})

map.on('click', 'hex10', function (e) {

    onDataClick(e);

})

map.on('click', 'hex1', function (e) {

    onDataClick(e);

})

map.on('click', 'hex5clipped', function (e) {

    onDataClick(e);

})

map.on('click', 'admin1', function (e) {

    addAdminClick(e)

})

map.on('click', 'admin2', function (e) {

    addAdminClick(e)

})





//taken from this example: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/

function checkForDuplicates(array) {
  let valuesAlreadySeen = []

  for (let i = 0; i < array.length; i++) {
    let value = array[i]
    if (valuesAlreadySeen.indexOf(value) !== -1) {
      return true
    }
    valuesAlreadySeen.push(value)
  }
  return false
}


//IMPORTANT KEEP HERE
//manages the change when you chang the resolution
function changeHexagonSize(sel) {

    console.log(sel)
    console.log(currentGeojsonLayers.hexSize)

    //console.log(map.getStyle())
    if (map.getLayer('ocean')) {
        $('.hexsize').toggle()
        map.removeLayer('ocean');
    }

    remove3d()
    currentGeojsonLayers.hexSize = sel
    console.log(sel);

    //var slayer;

    for (var x in userLayers) {
        if (map.getLayer(userLayers[x])) {
            map.removeLayer(userLayers[x])
        }
    }



    var current = _.find(sourceData, function (o) {
        return o.name === currentGeojsonLayers.hexSize
    })


    console.log(current);
    map.addLayer({
        'id': sel,
        'type': 'fill',
        'source': sel,
        'source-layer': current.layer,
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': 'blue',
            'fill-opacity': 0,

        }
    }, firstSymbolId);



    if (sel === 'hex1') {
        $('.loader-gis').show()

        map.once('idle', function (e) {
            $('.loader-gis').hide()
        })

    }

    if (map.getStyle().name === 'Mapbox Satellite') {
        map.moveLayer(sel);
    }



    map.once('idle', function (e) {
        console.log('idle after hex change')
        recolorBasedOnWhatsOnPage();

        //console.log('change bins');
        //map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.7)
        map.moveLayer(sel,'allsids')

    })

}


function remove3d() {

    var lay = map.getStyle().layers;
    //console.log(lay);
    var threedee = _.find(lay, function (o) {
        return o.type === 'fill-extrusion'
    });
    if (threedee) {
        map.removeLayer(threedee.id);
        map.easeTo({
            center: map.getCenter(),
            pitch: 0

        })
    }

}


function addToLayersDrop(layers) {

    $('#layer-id').show()

    console.log(layers);
    //console.log()
    //console.log(yearList)
    var layersHolder = document.getElementById('layer-drop');
    var length = layersHolder.options.length;


    for (var i = length - 1; i >= 0; i--) {
        layersHolder.options[i] = null;
    }

    for (var x in layers) {
        //console.log(layers[x])
        var btn = document.createElement('option')
        btn.innerHTML = layers[x].desc + ' ' + layers[x].time;
        btn.setAttribute('id', layers[x].field_name)
        btn.setAttribute('value', 'hi')
        layersHolder.appendChild(btn);
    }
    //console.log(layers.map(x => x.time));
    yearList = layers.map(x => x.time)
    //console.log(layers);
    //updateTime(layers)
    if (layers[0].title === 'Ocean Data') {
        addOcean(layers[0].field_name)
    } else {
        changeDataOnMap(layers[0].field_name)
    }


}

function addOcean(layer) {
    $('#icon3d').hide()
    $('.hexsize').toggle()
    remove3d();

    const userLayers = ['hex5', 'hex5clipped', 'hex10', 'admin1', 'admin2', 'hex1'];

    for (var x in userLayers) {
        if (map.getLayer(userLayers[x])) {
            // map.setPaintProperty(userLayers[x], 'fill-opacity', 0)
            map.removeLayer(userLayers[x])
        }

    }

    currentGeojsonLayers.breaks = [-4841, -3805, -2608, -1090, 0];
    currentGeojsonLayers.color = ['#08519c', '#3182bd', '#6baed6', '#bdd7e7', '#eff3ff']
    currentGeojsonLayers.dataLayer = layer;
    currentGeojsonLayers.hexSize = 'ocean';
    map.addLayer({
        'id': 'ocean',
        'type': 'fill',
        'source': 'ocean',
        'source-layer': 'oceans',
        'layout': {
            'visibility': 'visible'
        },
        'filter': ['<', 'depth', 0],
        'paint': {
            'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'depth'],
            -4841, '#08519c',
            -3805, '#3182bd',
            -2608, '#6baed6',
            -1090, '#bdd7e7',
            1322, '#eff3ff',
          ],
            'fill-opacity': 0.8,
        }
    }, firstSymbolId)

    setTimeout(() => {
        var features = map.queryRenderedFeatures({
            layers: ['ocean']
        })

        if (features) {
            var uniFeatures;
            uniFeatures = getUniqueFeatures(features, 'depth');
            var selecteData = uniFeatures.map(x => x.properties['depth']);          
            addLegend(currentGeojsonLayers.color, currentGeojsonLayers.breaks, 2, layer,selecteData); 
        }

    }, 600)

}



function changeDataOnMap(selection) {

    console.log(selection)
    console.log(currentGeojsonLayers.hexSize)

    if (map.getLayer('ocean')) {
        //$('.hexsize').toggle()

        if(!selection.includes('fl') ) {

        
        map.removeLayer('ocean');

        currentGeojsonLayers.hexSize = 'hex5'

        map.addLayer({
            'id': 'hex5',
            'type': 'fill',
            'source': 'hex5',
            'source-layer': 'hex5',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': 'blue',
                'fill-opacity': 0.0,

            }
        });

    }


    }
    remove3d()

    //console.log(map.getStyle().layers)
    //console.log(selection);
    currentGeojsonLayers.dataLayer = selection;
    console.log(currentGeojsonLayers.dataLayer)

    if(!map.getSource('hex5')) {
        //console.log('no source')
        addHexSource();
    } else {
        //console.log('source!')
    }

    if (!map.getLayer(currentGeojsonLayers.hexSize)) {

        var current = _.find(sourceData, function (o) {
            return o.name === currentGeojsonLayers.hexSize
        })

        map.addLayer({
            'id': currentGeojsonLayers.hexSize,
            'type': 'fill',
            'source': currentGeojsonLayers.hexSize,
            'source-layer': current.layer,
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': 'blue',
                'fill-opacity': 0.0,

            }
        });

        
        if (firstSymbolId) {
            map.moveLayer(currentGeojsonLayers.hexSize, firstSymbolId);
        }


    }
    setTimeout(() => {
        var features = map.queryRenderedFeatures({
            layers: [currentGeojsonLayers.hexSize]
        })

        if (features) {

            var uniFeatures;
            if (currentGeojsonLayers.hexSize === 'admin1') {
                uniFeatures = getUniqueFeatures(features, 'GID_1');

            } else if (currentGeojsonLayers.hexSize === 'admin2') {
                uniFeatures = getUniqueFeatures(features, 'GID_2');
            } else {
                uniFeatures = getUniqueFeatures(features, 'hexid');
            }


            //console.log(uniFeatures);
            var selecteData = uniFeatures.map(x => x.properties[selection])
            //console.log(selecteData);
            var max = Math.max(...selecteData)
            var min = Math.min(...selecteData)


            //var colorz = chroma.scale(['lightyellow', 'navy']).domain([min, max], 5, 'quantiles');
            var breaks = chroma.limits(selecteData, 'q', 4);
            //console.log("BREAK",breaks)
            var breaks_new = [];
            var precision = 1;
            do {
                precision++;
                for (let i = 0; i < 5; i++) {
                    breaks_new[i] = parseFloat(breaks[i].toPrecision(precision));                    
                }
                //console.log(breaks_new);
            }    
            while (checkForDuplicates(breaks_new)&&(precision<10));
            breaks = breaks_new;                        


            var colorRamp = colorSeq["yellow-blue"];

            if (selection.substring(0, 2) === '1a') {
                colorRamp = colorDiv.gdpColor;
            } else if (selection.substring(0, 2) === '1c') {
                colorRamp = colorSeq['pop'];

            } else if (selection === '7d10') {
                colorRamp = colorSeq['combo']
            } else if (selection === '7d5') {
                colorRamp = colorSeq['minty']
            } else if (selection === '7d7') {
                colorRamp = colorSeq['blues'];
            } else if (selection === '7d4') {
                colorRamp = colorSeq['pinkish'];
            } else if (selection === '7d8') {
                colorRamp = colorSeq['silvers'];
            } else if (selection === 'd') {
                breaks = [-4841, -3805, -2608, -1090, 1322];
                colorRamp = colorSeq['ocean']

            }

            currentGeojsonLayers.breaks = breaks;
            currentGeojsonLayers.color = colorRamp;

            map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-color',
                ['case', ['boolean', ['feature-state', 'hover'], false],
                'yellow',
                [
                'interpolate',
                ['linear'],
                ['get', selection],
                breaks[0], colorRamp[0],
                breaks[1], colorRamp[1],
                breaks[2], colorRamp[2],
                breaks[3], colorRamp[3],
                breaks[4], colorRamp[4],
                ]
                ]
            )


            
            //map.setFilter(currentGeojsonLayers.hexSize,['>=',selection, 0])
            if (isNaN(breaks[3]) || breaks[1] == 0) {
                //setTimeout(() => { map.setFilter(currentGeojsonLayers.hexSize, null) }, 500);

                map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.0)
                setTimeout(() => {
                    map.setFilter(currentGeojsonLayers.hexSize, null)
                }, 100);
                addNoDataLegend();
            } else {
                map.setFilter(currentGeojsonLayers.hexSize, ['>=', selection, 0])
                
                //console.log(selecteData)
                //console.log(max)

                addLegend(colorRamp, breaks, precision, selection, selecteData)
                setTimeout(() => {
                    map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.8)
                }, 100);
            }

        }
        

    }, 1000)


    map.moveLayer('allsids', firstSymbolId)
}


//addLegend()
//add the legend

function addNoDataLegend() {

    var infoBoxTitle = document.getElementById("infoBoxTitle")
    var infoBoxText = document.getElementById("infoBoxText")
    var infoBoxLink = document.getElementById("infoBoxLink")

    infoBoxTitle.innerHTML = 'No Data for this Region';
    infoBoxText.innerHTML = '';
    infoBoxLink.innerHTML = '';

    var legendTitle = document.getElementById('legendTitle')
    var legend = document.getElementById('updateLegend')
    legend.innerHTML = '';
    legendTitle.innerHTML = ''

    var element = document.getElementById("histogram");
    if(typeof(element) != 'undefined' && element != null)
    {
        $('#histogram').remove(); 
    }    

}

function addLegend(colors, breaks, precision, current, dataset) {

    //console.log(allLayers)

    var legData = _.find(allLayers, ['field_name', current])

    var infoBoxTitle = document.getElementById("infoBoxTitle")
    var infoBoxText = document.getElementById("infoBoxText")
    var infoBoxLink = document.getElementById("infoBoxLink")

    infoBoxTitle.innerHTML = '';
    infoBoxText.innerHTML = '';
    infoBoxLink.innerHTML = '';

    infoBoxTitle.innerHTML = legData.desc + ' ' + legData.time;
    infoBoxText.innerHTML = legData.desc_long
    infoBoxLink.innerHTML = '<strong>Reference: </strong>' + legData.source_name + ' - <a href="' + legData.link + '" target="_blank">' + legData.link + '</a>'

    var legendTitle = document.getElementById('legendTitle')
    var legend = document.getElementById('updateLegend')
    legend.innerHTML = '';
    legendTitle.innerHTML = ''
    legendTitle.innerHTML = '<span>' + legData.units + '</span>';
    
    
    for (var x in colors) {

        var containerDiv = document.createElement('div')
        containerDiv.classList.add('col-flex')
        containerDiv.classList.add('align-items-center')

        var words = document.createElement('div')
        words.classList.add('population-per-km-text')
        //words.innerHTML = Number.parseFloat(breaks[x]).toFixed(3)
        words.innerHTML = nFormatter(breaks[x], precision)
        //words.innerHTML = Number(nFormatter(breaks[x], 2))
        var hexI = document.createElement('div')
        hexI.classList.add('population-per-km-img')
        hexI.style.backgroundColor = colors[x];

        containerDiv.appendChild(words)
        containerDiv.appendChild(hexI)
        legend.appendChild(containerDiv);

    }
    
    //console.log("colors",colors)
    //console.log("breaks",breaks)
    //console.log("precision",precision)
    //console.log("current",current)
    //console.log("dataset",dataset)    

    // histogram
    var element = document.getElementById("histogram");
    if(typeof(element) != 'undefined' && element != null)
    {
        $('#histogram').remove(); 
    }     
    $('#histogram_frame').append('<canvas id="histogram" width="320" height="115"><canvas>')
    var canvas = document.getElementById('histogram')    

    // break
    var nGroup=200
    var breaks_histogram = chroma.limits(dataset, 'e', nGroup);
    //console.log("breaks_histogram",breaks_histogram);

    // old color
    /*
    var histogram_color = Array(nGroup).fill("");
    var color_index=0;
    for (var i = 0; i < nGroup; i++)   
    {        
        if (breaks_histogram[i]>breaks[color_index+1])
            color_index+=1;    
        histogram_color[i]=colors[color_index];
    }
    */

    // new color
    var break_index=0;
    var histogram_break_count = Array(4).fill(0);  
    for (var i = 0; i < nGroup; i++)   
    {
        if (breaks_histogram[i]>breaks[break_index+1])
            break_index+=1;
        histogram_break_count[break_index]+=1;
    }    
    var colorRampNew=[];
    for (var i = 0; i < 4; i++)
    {           
        colorRampPart = chroma.scale([colors[i], colors[i+1]]).mode('lch').colors(histogram_break_count[i]);
        colorRampNew = colorRampNew.concat(colorRampPart);
        //console.log(colorRampNew);
    }   
   

    // precision
    var breaks_precision = []
    for (i = 0; i < breaks_histogram.length; i++) {        
        breaks_precision.push(nFormatter(breaks_histogram[i], precision))
    }
    //console.log("breaks_precision:",breaks_precision)

    var histogram_data = Array(nGroup).fill(0);    
    for (var i = 0; i < dataset.length; i++) {
        for (var j = 0; j < nGroup-1; j++)
        {
            if ((dataset[i]>=breaks_histogram[j])&&(dataset[i]<breaks_histogram[j+1]))
            {
                histogram_data[j]+=1                
            }            
        }
        if (dataset[i]>=breaks_histogram[nGroup-1])
        {
            histogram_data[nGroup-1]+=1
        }
    }
    //console.log("histogram_data",histogram_data)

    var colorRampN = chroma.scale([colors[0], colors[4]]).mode('lch').colors(nGroup) // yellow to dark-blue
            
    var data = {
            labels: breaks_precision.slice(0, -1),
            datasets: [{
                data: histogram_data,
                backgroundColor: colorRampNew,
            }]
        };

    var maxY=Math.pow(10,Math.ceil(Math.log10(Math.max(...histogram_data))));
    var minY=Math.pow(10,Math.ceil(Math.log10(Math.min(...histogram_data))));
    
    //console.log(maxY,minY);
    //console.log(Math.min(...histogram_data));
    var option = {
        responsive: true,
        tooltips: {
            enabled: false
        },
        legend: {
                display: false
        },
        annotation: {
            annotations: [
            {
                type: "line",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: "70%",
                borderColor: "black",
                label: {
                content: "Your Score",
                enabled: true,
                position: "center"
                }
            }]},
        scales: {
            borderWidth:0,
        yAxes:[{
                display:true,
                type: "logarithmic",

                ticks: {
                    //scaleStepWidth: 10,
                    maxTicksLimit: 4, 
                    //autoSkip: true,
                    //stepSize:10,                                     
                    max: maxY,
                    //min: 1,
                    callback: function (value, index, values) 
                    {                        
                            if (value === 100000000) return "100M";
                            if (value === 10000000) return "10M";
                            if (value === 1000000) return "1M";
                            if (value === 100000) return "100K";
                            if (value === 10000) return "10K";
                            if (value === 1000) return "1K";
                            if (value === 100) return "100";
                            if (value === 10) return "10";
                            if (value === 1) return "1";
                            return null;
                   
                }
            },
            afterBuildTicks: function (chartObj) { //Build ticks labelling as per your need
                chartObj.ticks = [];
                var ticksScale=maxY;
                while ((ticksScale>minY)&&(ticksScale>=1))
                {
                    //console.log(ticksScale);
                    chartObj.ticks.push(ticksScale);
                    ticksScale/=10;
                }
                
            }

        }],
        xAxes:[{            
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            gridLines: 
            {
                display:true
            },
            scaleLabel: 
            {
                display: false,
                labelString: legData.units
            },
            ticks: {
                maxTicksLimit: 10

            }
        }]
    }
    };

    myHistogram = Chart.Bar(canvas,{
        data:data,
    options:option
    });
}


/////ui js
var selection_scroller_options = {
    0: {
        'label': 'SIDS offer Pillars',
        'value': 'SIDS offer Pillars'
    },

    1: {
        'label': 'SDGs',
        'value': 'SDGs'
    },

    2: {
        'label': 'SAMOA Pathway',
        'value': 'SAMOA Pathway'
    }
};



$('#layer-id').hide()
$('.year-timeline-wrapper').hide()

//$(document).ready(function () {
/** Collapse/Expand for Box  */
$('.bottom-left').on('click', function () {
    $('.app-body').toggleClass('collapsed');
    $(this).toggleClass('collapsed');
});

// /** Select2 for drop downs */
//$('.form-select').select2();






/**
 * Tooltip for sdgs .carousel-item,
 * 
 * this section is moin's I didn't touch it too much - it's the sdg and samoa pathway filter stuff
 */
$(".sdgimg .carousel-item, .sdgs .icon-grid-item , .sdg-tool").mouseover(function () {
    $("#gridsdgs").removeClass("d-none");
    $("#samimg").removeClass("d-none");
    var index = $(this).data('imgid');
    $('.title-text').text(sdg[index-1].title);
    $('.title-text').css('color', sdgColorsSeb[index-1])
    $('.img-tooltip-content').html(sdg[index-1].content);
});

$(".sdgimg .carousel-item, .grid-container,.sdg-tool ").mouseout(function () {
    $("#gridsdgs").addClass("d-none");
    $("#samimg").addClass("d-none");
});

// samoa hover events
$(".samoa .carousel-item, .samoa-grid .icon-grid-item").mouseover(function () {
    $("#gridsamoa").removeClass("d-none");
    $("#samimg").removeClass("d-none");
    var index = $(this).data('imgid');
    $('.title-text').text(arrsamoa[index-1].title);
    $('.title-text').css('color', samoaColorsSeb[index-1])
    $('.img-tooltip-content').html(arrsamoa[index-1].content);

});

$(".samoa .carousel-item,.grid-container, .samoa-grid ").mouseout(function () {
    $("#gridsamoa").addClass("d-none");
    $("#samimg").addClass("d-none");
});

function resetData() {

    var w = $('#dataDrop')[0].options
    //console.log(w);
    for (var z in w) {
        //console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }

    $('#resetData').toggle();
    console.log('hi')

}
/**sdg grid hover */
$(".sdgs .icon-grid-item").click(function () {

    if(!$('#resetData').is(':visible')) {
        $('#resetData').toggle();

    }
    //$('#resetData').toggle();
    /*if($('#layer-id').is(':visible')) {
        $('#layer-id').hide()
    } */

    var w = $('#dataDrop')[0].options
    console.log(w);
    for (var z in w) {
        console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }

    $("#sdg_slider .carousel-item").removeClass("active");
    var index = $(this).data('imgid');
    console.log(index);
    var filtered = _.filter(allLayers, function(o) {return o.sdg.includes(index)})
    console.log(allLayers)
    var filteredSDG = filtered.map(x => x.field_name)
    console.log(filteredSDG)

   
    for (var x in w) {
        console.log(w[x].id)
        if(!filteredSDG.includes(w[x].id)) {
            if(w[x].id) {
                $('#dataDrop option[id=' + w[x].id + ']').hide()
            }
        }
    }

    $("#sdg_slider div[data-imgid='" + index + "']").addClass("active");
});


/**samoa grid hover */
$(".samoa-grid .icon-grid-item").click(function () {
    if(!$('#resetData').is(':visible')) {
        $('#resetData').toggle();

    }

    var w = $('#dataDrop')[0].options
    //console.log(w);
    for (var z in w) {
        //console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }

    $("#SAMOA_slider .carousel-item").removeClass("active");
    var index = $(this).data('imgid');
    $("#SAMOA_slider div[data-imgid='" + index + "']").addClass("active");
    var filtered = _.filter(allLayers, function(o) {return o.samoa_path.includes(index)})
    var filteredSamoa = filtered.map(x => x.field_name)
    //console.log(allLayers.length)
    console.log(filtered)
    console.log('add');
    console.log('remov');

    for (var x in w) {
        console.log(w[x].id)
        if(!filteredSamoa.includes(w[x].id)) {
            if(w[x].id) {
                $('#dataDrop option[id=' + w[x].id + ']').hide()
            }
        }
    }
});

// hover for economy
$(".BE, #tooleconnomy").mouseover(function () {
    $("#tooleconomy").removeClass("d-none");
});
$(".BE, #tooleconomy").mouseout(function () {
    $("#tooleconomy").addClass("d-none");
});

$('.BE').click(function() {
    if(!$('#resetData').is(':visible')) {
        $('#resetData').toggle();

    }
    var index = 1;
    var w = $('#dataDrop')[0].options
    //console.log(w);
    for (var z in w) {
        //console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }
    console.log('BE')

    var filtered = _.filter(allLayers, function(o) {return o.pillar.includes(index)})
    var filteredBE = filtered.map(x => x.field_name)

    for (var x in w) {
        console.log(w[x].id)
        if(!filteredBE.includes(w[x].id)) {
            if(w[x].id) {
                $('#dataDrop option[id=' + w[x].id + ']').hide()
            }
        }
    }





})
$('.CA').click(function() {
    if(!$('#resetData').is(':visible')) {
        $('#resetData').toggle();

    }
    var index = 2;
    var w = $('#dataDrop')[0].options
    //console.log(w);
    for (var z in w) {
        //console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }

    console.log('CA')

    var filtered = _.filter(allLayers, function(o) {return o.pillar.includes(index)})
    var filteredCA = filtered.map(x => x.field_name)

    for (var x in w) {
        console.log(w[x].id)
        if(!filteredCA.includes(w[x].id)) {
            if(w[x].id) {
                $('#dataDrop option[id=' + w[x].id + ']').hide()
            }
        }
    }
})



$('.DT').click(function() {
    if(!$('#resetData').is(':visible')) {
        $('#resetData').toggle();

    }
    var index = 3;
    var w = $('#dataDrop')[0].options
    //console.log(w);
    for (var z in w) {
        //console.log(w[z].id)
        if(w[z].id) {
            $('#dataDrop option[id=' + w[z].id + ']').show()
        }
        
    }
    console.log('DT')

    var filtered = _.filter(allLayers, function(o) {return o.pillar.includes(index)})
    var filteredDT = filtered.map(x => x.field_name)

    for (var x in w) {
        console.log(w[x].id)
        if(!filteredDT.includes(w[x].id)) {
            if(w[x].id) {
                $('#dataDrop option[id=' + w[x].id + ']').hide()
            }
        }
    }
})

// hover action for climate action 
$(".CA, #toolclimate").mouseover(function () {
    $("#tooleclimate").removeClass("d-none");
});
$(".CA, #tooleclimate").mouseout(function () {
    $("#tooleclimate").addClass("d-none");
});

// hover action for Digital	Transformation
$(".DT, #tooldigi").mouseover(function () {
    $("#tooldigi").removeClass("d-none");
});
$(".DT, #tooldigi").mouseout(function () {
    $("#tooldigi").addClass("d-none");
});


// Button click and select
$('.button-option-select-1').on('click', function (e) {
    var btnValue = $(this).data('value');
    
    $('.button-option-select-1.active').removeClass('active');

    $(this).addClass('active');
    // Button value 
    console.log('Button Value: ' + btnValue);

    e.preventDefault();
});


/*

end Moin's tooltip section


*/

///// DATASET SELECTION PART --- IMPORTANT! should stay in newgis.js
///// CAN ALSO DEFO BE REFACTORED
$('select[name="dataset-selection"]').on('change', function () {
    //console.log(': ' + $(this).val());
    //console.log(map.getStyle().layers)

    console.log(this.selectedOptions[0].innerHTML)

    var legendTitle = document.getElementById('legendTitle')
    var legend = document.getElementById('updateLegend')
    legend.innerHTML = '';
    legendTitle.innerHTML = ''
    var infoBoxTitle = document.getElementById("infoBoxTitle")
    var infoBoxText = document.getElementById("infoBoxText")
    var infoBoxLink = document.getElementById("infoBoxLink")
    infoBoxTitle.innerHTML = '';
    infoBoxText.innerHTML = '';
    infoBoxLink.innerHTML = '';
    //console.log(this.selectedOptions[0].className);

    if (this.selectedOptions[0].className === 'basemap') {
        $('#layer-id').hide()
        $('#icon3d').hide()
        $('.year-timeline-wrapper').hide()
        $('.opacityslider').hide()
        $('.download').hide()
        $('#color-switch').hide()
        map.removeControl(Draw);
        console.log('basemap')
        //console.log(map.getStyle().sources)
        //console.log(styles)
        if (map.getLayer(currentGeojsonLayers.hexSize)) {
            map.removeLayer(currentGeojsonLayers.hexSize)
        }

        var lyr = this.selectedOptions[0].innerHTML;
        legend.innerHTML = '';
        legendTitle.innerHTML = ''
        infoBoxTitle.innerHTML = lyr
        infoBoxText.innerHTML = 'Satellite Imagery from Mapbox, NASA MODIS, Landsat 5 & 7, and Maxar';
        infoBoxLink.innerHTML = '<a href="https://www.mapbox.com/maps/satellite" target="_blank">Source</a>';

        var element = document.getElementById("histogram");
        if(typeof(element) != 'undefined' && element != null)
        {
            $('#histogram').remove(); 
        }    

        //if (map.getStyle().name != 'Mapbox Satellite Streets') {
            
            var thisStyle = _.find(styles, function (o) {
                return o.title === 'Satellite With Labels'
            })
            map.setStyle(thisStyle.uri)
            //addHexSource()
            //addLabels();
            map.once('idle', function(){

                map.removeLayer('admin-1-boundary')
                map.removeLayer('road-label')
                map.removeLayer('road-number-shield')
                map.removeLayer('road-exit-shield')
                map.removeLayer("admin-1-boundary-bg")
                map.removeLayer('airport-label')
    
            })
            console.log('hi')
        //}

        
        //addLabels();
        var layers = map.getStyle().layers;
        
        if (layers.length <= 3) {
            firstSymbolId = null;
        } else {
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    firstSymbolId = layers[i].id;
                    break;
                }
            }
        } 

    } else if (this.selectedOptions[0].innerHTML === 'GDP per Capita' || this.selectedOptions[0].innerHTML === 'Population Density') {
        //map.setPaintProperty(currentGeojsonLayers.hexSize,'fill-opacity', 0.0)
        console.log(this.selectedOptions[0].innerHTML)
        $('.year-timeline-wrapper').show() //show the timeslider
        $('#layer-id').hide()
        //$('.opacityslider').show()
        //$('.download').show()
        //$('#color-switch').show()
        //$('#icon3d').show()

        if (this.selectedOptions[0].innerHTML === 'Population Density') {
            //$('#icon3d').show()
        }

        var layers = [];
        //console.log(this.selectedOptions[0])
        for (var x in allLayers) {
            if (allLayers[x].title === this.selectedOptions[0].innerHTML) {
                //console.log(allLayers[x]);
                layers.push(allLayers[x]);
            }
        }
        updateTime(layers)
        //addToLayersDrop(layers);

    } else if (this.selectedOptions[0].innerHTML === 'Food Insecurity' || this.selectedOptions[0].innerHTML === 'Water Use' || this.selectedOptions[0].innerHTML === 'Development Potential Index' || this.selectedOptions[0].innerHTML === 'Ocean Data') {
        //$('#icon3d').hide()


        $('.year-timeline-wrapper').hide()
        $('.year-timeline').empty();
        $('.opacityslider').show()
        $('.download').show()
        $('#color-switch').show()
        $('#icon3d').show()
        map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.0)

        var layers = [];
        //console.log(this.selectedOptions[0])
        for (var x in allLayers) {
            if (allLayers[x].title === this.selectedOptions[0].innerHTML) {
                //console.log(allLayers[x]);
                layers.push(allLayers[x]);
            }
        }

        addToLayersDrop(layers);

    } else {
        //$('#icon3d').hide()
        $('.opacityslider').show()
        $('.download').show()
        $('#color-switch').show()
        $('#icon3d').show()
        //map.addControl(Draw, 'bottom-right');
        var layersHolder = document.getElementById('layer-drop');
        var length = layersHolder.options.length;

        for (var i = length - 1; i >= 0; i--) {
            layersHolder.options[i] = null;
        }
        $('#layer-id').hide()
        $('.year-timeline-wrapper').hide()
        $('.year-timeline').empty();
        changeDataOnMap(this.selectedOptions[0].id);
    }

    //changeDataOnMap(this.selectedOptions[0].id);
});


//OLD HEXAGON CHANGE PART - NOT USED BUT SCARED TO DELETE
/*
$('select[name="hexbin-change"]').on('change', function () {

    console.log(this.selectedOptions[0].value);
    changeHexagonSize(this.selectedOptions[0].value)
}) */




//adds the voronoi layer, currently uses the chart button.
//to switch, just add the id 'voro' to any button
//currently has some issues around 180 meridian

$('#voro').on('click', function(){

    //removes voro and bbox layer if they're already on
    if(map.getLayer('vz')){
        map.removeLayer('vz')
        map.removeSource('vz')
        map.removeLayer('bbox13')
        map.removeSource('bbox13')
    } else {

    //gets sids layer that's visible
    var countryii = map.queryRenderedFeatures({
        layers: ['allsids']
    });

    var newOne1 = []
    var propers = {}


    //converts tiles to outline

    countryii.forEach(function(f){
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
                newOne1.push(poly);
            }
        } else {
            newOne1.push(f)
        }

        
    })

    var fc = turf.featureCollection(countryii);
    var thebbox = turf.bbox(fc);
    console.log(thebbox)


    //creates 25 random points within bbox

    var randoPoints = turf.randomPoint(25, {
        bbox: thebbox})
    console.log(randoPoints)

    //creates voronoi's off those points
    var voronoiz = turf.voronoi(randoPoints, { 
        bbox: thebbox    
    });
    console.log(voronoiz)


    //random colors for voronois if you want
    for (var x in voronoiz.features) {
       voronoiz.features[x].properties.color = '#' + (Math.random().toString(16) + "000000").substring(2, 8);
    }


    var thebboxActual = turf.bboxPolygon(thebbox);
    
    map.addSource('bbox13', {
        type: 'geojson',
        data: thebboxActual
    })

    map.addLayer({
        'id': 'bbox13',
        'source': 'bbox13',
        'type': 'line',
        'paint': {
            'line-color': 'red',
            'line-width': 3
        }
        })

    map.addSource('vz', {
         type: 'geojson',
         data: voronoiz
    })
    
    map.addLayer({
         'id': 'vz',
         'source': 'vz',
         'type': 'line',
         'paint': {
          //   'line-color': ['get', 'color'], if you want random colors
            'line-color': 'orange',
             'line-width': 3
          }
     })


     map.fitBounds(thebbox,{
         padding: 50
     });


    }
    


})
//objects for boundary layers
//sets colors for points
var pointColors = {
    'airports-extended': 'blue',
    'healthsites': 'red',
    'volcano_list': 'orange',
    'glopal_power_plant': 'green',
    'world_port_index': 'yellow'
}

//this is the id the popup uses to show the name
var pointDesc = {
    'airports-extended': 'Airport_Na',
    'healthsites': 'name', //conflicting with power plants in geojson, need to change name
    'volcano_list': 'Volcano_Na',
    'glopal_power_plant': 'name',
    'world_port_index': 'PORT_NAME'

}


//adds the overlays (in the top right menu, it the top most right button)
//should be it's own file

function addBoundaryLayer(object) {

    var points = ['airports-extended', 'healthsites', 'volcano_list', 'glopal_power_plant', 'world_port_index']


    var k = Object.keys(object); //what layer is being added
    var v = Object.values(object)[0]; //true or false if clicked

    var clicked = k[0]

    console.log(v)
    console.log(clicked)


    if(points.includes(clicked)) {

        if(map.getLayer(clicked)) {
            map.removeLayer(clicked)
        } else {


            map.addLayer({
                'id': clicked,
                'type': 'circle',
                'source': 'points-source',
                'filter': ['==', 'layer', clicked],
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-color': pointColors[clicked],
                    'circle-radius': 7,
                    'circle-opacity': 0.7
                }
            })

        }
        console.log(clicked)

        map.on('click', clicked, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties[pointDesc[clicked]];

            //console.log(coordinates);
            getIso(coordinates)

            new mapboxgl.Popup({
                className: 'popupCustom'
            })
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);

        })

    }
    else if (clicked === 'underwater-overlay') {
        addCables()

    } else if (!v) {
       
        map.removeLayer(clicked)
        console.log('uncheck: ' + clicked);
        
    } else {

        var slayer;
        var color;
        var source;

        if (clicked === 'admin1-overlay') {
            source = 'admin1'
            slayer = 'admin1'
            color = 'red'
        } else if (clicked === 'admin2-overlay') {
            source = 'admin2'
            slayer = 'admin2'
            color = '#003399'
        } else if (clicked === 'allsids') {
            //console.log('sids!')
            source = 'allsids'
            slayer = 'allSids'
            color = 'orange'
        } else {
            //source = 'pvaph'

            //layer == 'airports=extended', 'healthsites', 'volcano-list', 'glopal_power_plant', ''
            console.log($(this).val());
            //console.log($(this).id())
            console.log($(this))
        }

        map.addLayer({
            'id': clicked,
            'type': 'line',
            'source': source,
            'source-layer': slayer,
            'layout': {
                'visibility': 'visible'
            },

            'paint': {
                'line-color': color,
                'line-width': 1

            }
        }, firstSymbolId);

        if (map.getLayer('admin1-overlay')) {
            map.moveLayer(clicked, 'admin1-overlay')

        }

        map.on('mouseover', function () {



        })

    }


}

//add underwater cables
function addCables() {

    if (map.getLayer('underwater')) {
        map.removeLayer('underwater')
    } else if (!map.getSource('underwater-source')) {

        d3.json('gisPanel/cable-geo.json').then(function (d) {

            map.addSource('underwater-source', {
                'type': 'geojson',
                'data': d
            })

            map.addLayer({
                'id': 'underwater',
                'type': 'line',
                'source': 'underwater-source',

                'layout': {
                    'visibility': 'visible'
                },

                'paint': {
                    'line-color': ['get', 'color'],
                    'line-width': 2
                }
            }, firstSymbolId);

        })

    } else {


        map.addLayer({
            'id': 'underwater',
            'type': 'line',
            'source': 'underwater-source',

            'layout': {
                'visibility': 'visible'
            },

            'paint': {
                'line-color': ['get', 'color'],
                'line-width': 3
            }
        }, firstSymbolId);
    }



    map.on('click', 'underwater', function (e) {
        var popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true
        });


        popup.setLngLat(e.lngLat).setHTML('<b>' + e.features[0].properties['slug'] + '</b>').addTo(map);
    })

}


//if a layer is selected
$('select[name="layer-selection"]').on('change', function () {
    console.log('Layer: ' + $(this).val());
    //console.log('hi');
    changeDataOnMap(this.selectedOptions[0].id)
});

var isReachedToEnd = false;


/**
 * Dynamic year list creation 
 */

function updateTime(layers) {

    $('.year-timeline-wrapper').show()
    //console.log(yearList)
    //console.log(layers);
    //var currentLayer = {}
    currentTimeLayer = layers;
    var latestTime = currentTimeLayer.slice(-1);
    changeDataOnMap(latestTime[0].field_name);

    //var startLayer = find(currentTimeLayer, function(o) {return o.time === yearValue})
    //console.log(showLayer)
    //changeDataOnMap(showLayer.field_name);
    //console.log(currentLayer)
    var yearList = currentTimeLayer.map(x => x.time)
    var year_html = ''
    //$('.year-timeline').append(year_html);
    $('.year-timeline').empty();


    if (yearList.length == 1) {
        $('.year-timeline').html(`<p class='m-0'> Data only available for ${yearList}</p>`)
        $('.year-timeline-wrapper').addClass('single-year-only');
        return;
    }

    var last_percentage = 0;

    for (var i = 0; i < yearList.length; i++) {
        var class_for_year = "";
        if (i == 0) {
            class_for_year = "alpha";
        } else if (i == yearList.length - 1) {
            class_for_year = "omega";
        }


        // 
        var totalContainerWidth = $('.year-timeline').outerWidth();

        // Calculating the pecetange of this block
        var different_first_last = yearList[yearList.length - 1] - yearList[0];


        // Now calculate the distance between the current item and the next one
        var distance_to_next = yearList[i] - yearList[0];

        if (i == yearList.length - 1) {
            console.log('is omega');
        }

        var size_in_percentage = (distance_to_next / different_first_last) * 100;
        size_in_percentage = size_in_percentage.toFixed(2);

        var widthStyle = `width: ${size_in_percentage}%;`;

        var fromLeftPosition = 0;
        var fromLeftPixels = 0;
        var fromLeftStyle = ``;

        if (i > 0 && i < (yearList.length - 1)) {
            fromLeftPosition = parseInt(size_in_percentage);
            // convert from left position to pixels
            fromLeftPixels = (fromLeftPosition / 100) * totalContainerWidth;
            fromLeftStyle = `left: ${fromLeftPixels}px;`;
        } else {
            last_percentage = parseInt(size_in_percentage);
        }

        last_percentage = fromLeftPosition;


        year_html = `<div _style=' ${widthStyle}' data-width='${size_in_percentage}' class="year-timeline-block ${class_for_year}" data-year-idx="${i + 1}">
          <input type="radio" name="year-selected" value="${yearList[i]}" id="year-${yearList[i]}" ${(i == 0) ? 'checked' : ''}>
          <label for="year-${yearList[i]}">
          <span style='${fromLeftStyle}' class="label-value">${yearList[i]}</span>
          <span style='${fromLeftStyle}' class="circle-radio"></span>
          </label>
          </div>`;
        $('.year-timeline').append(year_html);

    }




    $('body').on('change click', 'input[name="year-selected"]', function (e) {
        //e.preventDefault() //so it doesn't run twice
        isReachedToEnd = false;
        var yearValue = $('[name="year-selected"]:checked').val();
        //$('.year-timeline-block.alpha input[type="radio"').prop('checked', true);
        //console.log('-----')
        //console.log(yearValue);
        //console.log(this)
        var check = $(this).prop('checked')
        //$(this).prop('checked',true) 
        //console.log(check);
        /*if(check){
          console.log('yo')
          $(this).prop('checked',false)
          console.log(this)
        } else {
          console.log('hi')
          $(this).prop('checked',true) 
        } */
        /*if (check) {$(this).removeAttr('checked').prop('checked',false)}
        else {$(this).attr('checked', true).prop('checked',true) } */
        //console.log(this)
        //console.log(currentTimeLayer);
        var showLayer = _.find(currentTimeLayer, function (o) {
            return o.time === yearValue
        })
        //console.log(showLayer)
        changeDataOnMap(showLayer.field_name);
        //console.log(yearValue);
    });


}
// }

// Year selection 

// play / pause
var playPauseInterval;

$('#year-play-pause').on('click', function (e) {
    var isPaused = $(this).hasClass('play');


    if (!isPaused) {
        clearInterval(playPauseInterval);
        $(this).removeClass('pause').addClass('play');
    } else {
        playPauseInterval = window.setInterval(function () {
            var $checkedBox = $('input[name="year-selected"]:checked');
            //console.log($checkedBox[0].value);
            if ($checkedBox.parent('.year-timeline-block').hasClass('omega') && isReachedToEnd) {
                $('.year-timeline-block.alpha input[type="radio"').prop('checked', true);
                isReachedToEnd = false; // Reset, once replayed 
            }
            // Reached to end 
            else if ($checkedBox.parent('.year-timeline-block').hasClass('omega')) {
                clearInterval(playPauseInterval);
                $('#year-play-pause').removeClass('pause').addClass('play');
                isReachedToEnd = true; // Flag that indicates to replay the year selection 
                return;
            }
            // Find the idx of checked item
            var currentIdx = $checkedBox.parent('.year-timeline-block').data('year-idx');

            var nextCheckedBoxIdx = currentIdx + 1;
            $('.year-selected[value=1990]').prop('checked', true)
            $('.year-timeline-block[data-year-idx="' + nextCheckedBoxIdx + '"]').find('input[name="year-selected"]').prop('checked', true);

            var currentYear = $('input[name="year-selected"]:checked').val()
            var display = _.find(currentTimeLayer, function (o) {
                return o.time === currentYear
            })
            console.log($('input[name="year-selected"]:checked').val());
            changeDataOnMap(display.field_name)


        }, 1600);

        $(this).addClass('pause').removeClass('play');
    }


    e.preventDefault();

});


/* Tabs */
$('.tab-nav').on('click', function () {

    $('.tab-nav').removeClass('active');
    $(this).addClass('active');

    var target = $(this).data('target');

    $('.tab').removeClass('active');
    $(target).addClass('active');

});


/**
 *  Top Toolip 
 */
$('.tab-nav').on('mouseover', function () {
    var $target = $(this).data('tooltip-target');
    $($target).show();
});

$('.tab-nav').on('mouseout', function () {
    var $target = $(this).data('tooltip-target');
    $($target).hide();
});
/* END TOP TOOLTIP */
$('.selection-dropdown-arrow').on('click', function () {
    // Get <select> tag  
    var $select = $(this).parent().find('select');
    // Count options 
    var totalOpts = $select.find('option').length;
    // Get current selection s
    var currentIndex = $select.prop('selectedIndex');


    if ($(this).hasClass('up')) {
        if (currentIndex === 0) {
            currentIndex = totalOpts - 1;
            $select.prop('selectedIndex', currentIndex);
        } else {
            $select.prop('selectedIndex', currentIndex - 1);
        }
    } else if ($(this).hasClass('down')) {
        if (currentIndex === totalOpts - 1) {
            currentIndex = 0;
            $select.prop('selectedIndex', currentIndex);
        } else {
            $select.prop('selectedIndex', currentIndex + 1);
        }
    }
});

/**
 * Function to check all the values
 */
function check_all_values() {
    var top_left_nav = $('.tab-nav.active span').text();
    var btnValue = $('.button-option-select-1.active').data('value');
    var datasetSelect = $('select[name="dataset-selection"]').val();
    var layerSelect = $('select[name="layer-selection"]').val();
    //var year = $('input[name="year-selected"]:checked').val();

    //console.log('Top left nav = ' + top_left_nav);
    //console.log('Top right Button = ' + btnValue);
    //console.log('DATASET selection = ' + datasetSelect);
    //console.log('Layer selection = ' + layerSelect);
    //console.log('Year selection = ' + year);
}

check_all_values()



//formats numbers -- function written by Ben
function nFormatter(num, digits) {
    var si = [
        {
            value: 1,
            symbol: ""
        },
        {
            value: 1E3,
            symbol: "K"
        },
        {
            value: 1E6,
            symbol: "M"
        },
        {
            value: 1E9,
            symbol: "B"
        }
  ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

