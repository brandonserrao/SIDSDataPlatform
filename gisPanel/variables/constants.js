//temporary note - constants from newgis.js being migrated here

const UNDP_mapboxToken =
  "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";

const cableFilePath = "gisPanel/data/cable-geo.json"; //RELATIVE TO THE FUNCTION DIRECTORY FROM WHICH THEY'RE CALLED
const pointdataFilePath = "gisPanel/data/pvaph.geojson";

/* 
const userLayers = [
  "hex5",
  "hex5clipped",
  "hex10",
  "admin1",
  "admin2",
  "hex1",
  "ocean",
];
 */
const hexes = ["hex1", "hex5", "hex10", "hex5clipped"];
const admins = ["admin1", "admin2"];
const userLayers = [...hexes, ...admins, "ocean"];
const nogos = [
  //EXTRACTED FROM WITHIN randomStart()
  0, 1, 2, 4, 12, 16, 24, 25, 26, 27, 28, 29, 31, 32, 41, 43, 45, 47, 48, 50,
  52,
]; // countries that it shouldn't start with - can be adjusted obvi

//object for all styles for basemap switch -- could be moved out
const styles = [
  {
    title: "Satellite With Labels",
    uri: "mapbox://styles/mapbox/satellite-streets-v11",
  },
  {
    title: "Light",
    uri: "mapbox://styles/mapbox/light-v10",
  },
  {
    title: "Satellite Imagery",
    uri: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    title: "Mapbox Dark",
    uri: "mapbox://styles/mapbox/dark-v10",
  },
];

const sourceURLs = {
  hex1: "https://sebastian-ch.github.io/sidsDataTest/data/hex1/{z}/{x}/{y}.pbf",
  hex5: "https://sebastian-ch.github.io/sidsDataTest/data/hex5/{z}/{x}/{y}.pbf",
  hex10:
    "https://sebastian-ch.github.io/sidsDataTest/data/hex10/{z}/{x}/{y}.pbf",
  hex5clipped:
    "https://sebastian-ch.github.io/sidsDataTest/data/hex5clipped/{z}/{x}/{y}.pbf",
  admin1:
    "https://sebastian-ch.github.io/sidsDataTest/data/admin1/{z}/{x}/{y}.pbf",
  admin2:
    "https://sebastian-ch.github.io/sidsDataTest/data/admin2/{z}/{x}/{y}.pbf",
  ocean:
    "https://sebastian-ch.github.io/sidsDataTest/data/oceans/{z}/{x}/{y}.pbf",
  allSids:
    "https://sebastian-ch.github.io/sidsDataTest/data/allsids/{z}/{x}/{y}.pbf",
};

const selection_scroller_options = {
  //TODO RENAME KEYS MORE EXPLICILITY/VERBOSE
  0: {
    label: "SIDS offer Pillars",
    value: "SIDS offer Pillars",
  },

  1: {
    label: "SDGs",
    value: "SDGs",
  },

  2: {
    label: "SAMOA Pathway",
    value: "SAMOA Pathway",
  },
};

const unwantedMapboxLayers = [
  "admin-1-boundary",
  "admin-1-boundary-bg",
  "road-label",
  "road-number-shield",
  "airport-label",
];

//initializes draw -- KEEP HERE for now
const Draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
  //defaultMode: 'draw_polygon'
});
