import constants from "@/gis/static/constants.js";

//taken from old code

const globals = {
  firstSymbolId: "tunnel-oneway-arrow-blue",
  basemapLabels: [], //current basemap labels, for use in addLabels -> the toggling of the labels of a current basemap style
  //current layer state manager
  precision: null, //modified in changeDataOnMap and recolor etc; TODO deglobalize this
  myHistogram: null,
  lastActive: { dataset: null, layer: null },
  opacity: 0.8,
  /* //were unused; obsoleted by passing these through emits when required
  activeDataset: null,
  activeLayer: null, */
  allLayers: [], //from old code; should be obsoleted by filteredDatasets/datasets made in MapDataController.vue;
  currentLayerState: {
    color: null,
    breaks: null,
    dataLayer: null,
    /**String; id of the current data layer;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    hexSize: "hex5",
  },
  sources: {
    //{...ID:{SOURCE OBJECT}} USED WHEN ADDING LAYERSOURCES
    hex1: {
      type: "vector",
      promoteId: "hexid",
      //tiles: [hex1],
      tiles: [constants.sourceURLs.hex1],
    },
    hex5: {
      type: "vector",
      promoteId: "hexid",
      tiles: [constants.sourceURLs.hex5],
      //'minzoom': 3,
      maxzoom: 12,
    },
    hex5clipped: {
      type: "vector",
      tiles: [constants.sourceURLs.hex5clipped],
      promoteId: "hexid",
    },
    hex10: {
      type: "vector",
      tiles: [constants.sourceURLs.hex10],
      promoteId: "hexid",
    },
    admin1: {
      type: "vector",
      promoteId: "GID_1",
      tiles: [constants.sourceURLs.admin1],
      //'minzoom': 3,
      maxzoom: 12,
    },
    admin2: {
      type: "vector",
      promoteId: "GID_2",
      tiles: [constants.sourceURLs.admin2],
      //'minzoom': 3,
      maxzoom: 12,
    },
    ocean: {
      type: "vector",
      tiles: [constants.sourceURLs.ocean],
      maxzoom: 10,
    },
    allsids: {
      type: "vector",
      //'url': ocean
      tiles: [constants.sourceURLs.allSids],
      maxzoom: 12,
    },
  },
  sourceData: {
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
      // mainId: null,
      mainId: "ocean",
      data: null,
    },
    hex5clippedSource: {
      name: "hex5clipped",
      layer: "hex5clipped",
      mainId: "hexid",
      data: null,
    },
  },
};
export default globals;
