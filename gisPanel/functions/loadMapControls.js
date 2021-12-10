function loadMapControls() {
  //add scale bar
  map.addControl(new mapboxgl.ScaleControl(), "bottom-right");

  //initialize and add minimap
  let minimap = new mapboxgl.Minimap({
    center: map.getCenter(),
    zoom: 6,
    togglePosition: "topleft",
    style: "mapbox://styles/mapbox/light-v10",
    //minimized: true
  });
  map.addControl(minimap, "bottom-right");
  //minimize it to start
  minimap.toggle();

  //the on click popup part - just adding it, but it is only filled in when something is selected, see onClickControl.js
  //IMO SHOULD ONLY BE ADDED AS NEEDED
  const toggleControl = new ToggleControl();
  map.addControl(toggleControl, "bottom-right");
}

function removeUnwantedLayers() {
  console.log("unwanted Mapbox layers removed");
  for (let layer of unwantedMapboxLayers) {
    map.removeLayer(layer);
  }
}
