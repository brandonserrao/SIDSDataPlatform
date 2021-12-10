// great tutorial here: https://docs.mapbox.com/help/tutorials/get-started-isochrone-api/
// TODO - allow users to change params -- see tutorial above



const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
//var lon = -77.034;
//const lat = 38.899;
const profile = 'walking'; // or cycling, driving
const minutes = 25; // minutes from point

// Create a function that sets up the Isochrone API query then makes an fetch call
async function getIso(coords) {

    var lon = coords[0];
    var lat = coords[1];


  const query = await fetch(
    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const data = await query.json();
  console.log(data);



  if(map.getLayer('iso')) {
      map.removeLayer('iso');
      map.removeLayer('iso')
  }


  map.addSource('iso', {
    type: 'geojson',
    data: {
    'type': 'FeatureCollection',
    'features': []
    }
    });
     
    map.addLayer(
    {
    'id': 'iso',
    'type': 'fill',
    'source': 'iso',
    'layout': {},
    'paint': {
    'fill-color': '#5a3fc0',
    'fill-opacity': 0.7
    }
    },
    'poi-label'
    );

    map.getSource('iso').setData(data);

    console.log(turf.bbox(data))


    map.fitBounds(turf.bbox(data), {
        linear: true,
        padding: 100
    })



}





