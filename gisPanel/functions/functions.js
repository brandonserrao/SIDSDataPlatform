// note - functions from newgis.js being temporary migrated here
function enableGeocoder() {
  //the search for a country part
  //APPEARS OBSOLETE/INCOMPLETE
  /*
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search for City or Country",
    //flyTo: false,
    types: "country, place",
    clearOnBlur: true,
    marker: false,
    collapsed: true,
  });
  // geocoder.addTo(".search-icon"); //add the search to the icon in the top right //
  */
}

function enableDraw() {
  //ADDS THE DRAW CONTROLS INSIDE THE RIGHTSIDEBAR BUTTON
  document.getElementById("drawControls").appendChild(Draw.onAdd(map));
}
//

//--END - MY NEW FUNCTIONS------------------------------------//
//--END FUNCTIONS//
