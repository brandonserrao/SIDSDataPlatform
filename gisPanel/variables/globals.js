var currentTimeLayer;
let minimap;
var legendControl;
var firstSymbolId; //used to get correct placement of our hex grids under the mapbox styles (layers)
var oldZoom;
var oldCenter;
var myHistogram;
var precision;
let layers;
var allLayers = [];
var basemapLabels = []; //all symbol and line layers to an object that it used to add or remove the labels
var yearList = [];

var isReachedToEnd = false; //??? APPARENTLY USED IN TIMELINE RELATED CODE IT SEEMS

let sources = {
  //{...ID:{SOURCE OBJECT}} USED WHEN ADDING LAYERSOURCES
  hex1: {
    type: "vector",
    promoteId: "hexid",
    //tiles: [hex1],
    tiles: [sourceURLs.hex1],
  },
  hex5: {
    type: "vector",
    promoteId: "hexid",
    tiles: [sourceURLs.hex5],
    //'minzoom': 3,
    maxzoom: 12,
  },
  hex5clipped: {
    type: "vector",
    tiles: [sourceURLs.hex5clipped],
    promoteId: "hexid",
  },
  hex10: {
    type: "vector",
    tiles: [sourceURLs.hex10],
    promoteId: "hexid",
  },
  admin1: {
    type: "vector",
    promoteId: "GID_1",
    tiles: [sourceURLs.admin1],
    //'minzoom': 3,
    maxzoom: 12,
  },
  admin2: {
    type: "vector",
    promoteId: "GID_2",
    tiles: [sourceURLs.admin2],
    //'minzoom': 3,
    maxzoom: 12,
  },
  ocean: {
    type: "vector",
    tiles: [sourceURLs.ocean],
    maxzoom: 10,
  },
  allsids: {
    type: "vector",
    //'url': ocean
    tiles: [sourceURLs.allSids],
    maxzoom: 12,
  },
};

//current layer state manager
var currentGeojsonLayers = {
  color: null,
  breaks: null,
  dataLayer: null,
  hexSize: "hex5",
};

//all source data info
var sourceData = {
  //managing state of all our data
  hex5Source: {
    name: "hex5",
    layer: "hex5",
    mainId: "hexid",
    data: null,
  },
  hex10Source: {
    name: "hex10",
    layer: "hex10",
    mainId: "hexid",
    data: null,
  },
  admin1Source: {
    name: "admin1",
    mainId: "GID_1",
    layer: "admin1",
    data: null,
  },
  admin2Source: {
    name: "admin2",
    mainId: "GID_2",
    layer: "admin2",
    data: null,
  },
  hex1Source: {
    name: "hex1",
    layer: "hex1",
    mainId: "hexid",
    data: null,
  },
  oceanSource: {
    name: "ocean",
    layer: "oceans",
    mainId: null,
    data: null,
  },
  hex5clippedSource: {
    name: "hex5clipped",
    layer: "hex5clipped",
    mainId: "hexid",
    data: null,
  },
};
