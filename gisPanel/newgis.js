"use strict";
//OWN NOTES - BRANDON
//TODO--BROKE THE ONCLICK DATA SHOWING IN TOGGLE CONTROL; NEED TO FIGURE OUT AND FIX THAT
//TODO-- MOVE CSS TO DEDICATED CSS DIR; SOLVE BREAKAGE THIS CAUSES
//TODO-- FINISH SORT THE FUNCTIONS FROM FUNCTIONS.JS
//--MAP INITIALIZE--//
mapboxgl.accessToken = UNDP_mapboxToken;
const map = new mapboxgl.Map(mapOptions);

map.on("load", function () {
  loadMapControls(); //scalebar, minimap, toggleControl for onclickdatainfo

  removeUnwantedLayers(); //unwated Mapbox Base layers;

  //------------------------------------------------------------------
  layers = map.getStyle().layers; //TODO EVALUATE NECESSITY (USED ELSEWHERE?)
  getFirstSymbolId(); //NEEDS REVIEW
  fillBasemapLabels(); //NEEDS REVIEW
  //---------------------------------------------------------------

  enableGeocoder(); //features not really used -brandon

  enableDraw(); //features not really used -brandon

  //adds the sources, populates drop downs, adds draw function listeners
  populateDropdowns(); //renaming and replacement for old addButtons();

  addSources(sourceURLs);

  drawListeners(); //FIND AND EVALUATE
});
//--END MAP INITIALIZE--//

focusRandomCountry(); // replaced randomStart();

bindMapListeners();

check_all_values(); //???
