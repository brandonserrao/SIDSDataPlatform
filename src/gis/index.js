import "mapbox-gl/dist/mapbox-gl.css";
import "@/gis/styles/minimap.css";
import filepaths from "@/gis/static/filepaths.js";
// import constants from "@/gis/static/constants.js";
import globals from "@/gis/static/globals.js";

import constants from "@/gis/static/constants.js";
import colors from "@/gis/static/colors.js";

import * as d3 from "d3";
import chroma from "chroma-js";
import Chart from "chart.js"; //testing replacement with older version used from CDN
// import Chart from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js";

import { featureCollection } from "@turf/helpers";
import dissolve from "@turf/dissolve";

//---------used to bring in lodash for oldcode
import Vue from "vue";
import VueLodash from "vue-lodash";
import lodash from "lodash";
Vue.use(VueLodash, { name: "custom", lodash: lodash });
//----------------------------------------------------

import mapboxgl from "@/gis/mapboxgl";
// eslint-disable-next-line no-unused-vars
import mapboxMinimap from "mapbox.minimap";

export default class Map {
  constructor(container) {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";
    this.map = new mapboxgl.Map({
      container, // container ID
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center: [-71.5, 19.0],
      zoom: 7,
      maxZoom: 14,
    });

    this.map.on("load", () => {
      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      this._createMiniMap();
      this._initOnClickControl();

      this._bindMapClickListeners(this); //attempt to pass class into this function, to allow access to class when mapbox map level events are called that can't see the class functions normally
      //========================================================================
      //----------------------------------------------------------------------------

      this._addPointSources();
      this._addVectorSources();
    });
  }

  on(type, layerIds, listenerFunction) {
    this.map.on(type, layerIds, listenerFunction);
  }

  addLayer(input) {
    this.map.addLayer(input);
  }
  removeLayer(input) {
    this.map.removeLayer(input);
  }
  getLayer(input) {
    this.map.getLayer(input);
  }
  removeSource(input) {
    this.map.removeSource(input);
  }

  makePopUp(options) {
    return new mapboxgl.Popup(options);
  }

  getSource(id) {
    return this.map.getSource(id);
  }

  zoomToCountry(country) {
    var v2 = new mapboxgl.LngLatBounds(country.bb);
    console.log(`zoomTo(${country.NAME_0}) calling map.fitBounds on .bb`);
    this.map.fitBounds(v2, {
      linear: true,
      padding: {
        top: 10,
        bottom: 25,
        left: 15,
        right: 5,
      },
      pitch: 0,
    });
  }
  zoomTo(selection) {
    var v2 = new mapboxgl.LngLatBounds([selection[0], selection[1]]);
    console.log(`zoomTo(${selection}) calling map.fitBounds`);
    this.map.fitBounds(v2, {
      linear: true,
      padding: {
        top: 10,
        bottom: 25,
        left: 15,
        right: 5,
      },
      pitch: 0,
    });
  }

  _createMiniMap() {
    this.minimap = new mapboxgl.Minimap({
      center: this.map.getCenter(),
      zoom: 6,
      togglePosition: "topleft",
      style: "mapbox://styles/mapbox/light-v10",
    });
    this.map.addControl(this.minimap, "bottom-right");
    this.minimap.toggle();
  }

  _removeUnusedLayers() {
    this.map.removeLayer("admin-1-boundary");
    this.map.removeLayer("road-label");
    this.map.removeLayer("road-number-shield");
    this.map.removeLayer("road-exit-shield");
    this.map.removeLayer("admin-1-boundary-bg");
    this.map.removeLayer("airport-label");
  }

  getUniqueFeatures(array, comparatorProperty) {
    //taken directly from old code
    var existingFeatureKeys = {};
    //function taken from mapbox that extracts unique features, see comment below
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

  showSpinner() {
    document.querySelector(".loader-gis").style.display = "block";
  }

  hideSpinner() {
    document.querySelector(".loader-gis").style.display = "none";
  }

  //taken from old code
  //manages the change when you chang the resolution
  changeHexagonSize(resolutionObject) {
    let map = this.map;
    console.log("resolutionObject: ");
    console.log(resolutionObject);
    let resolution = resolutionObject.resolution;
    console.log(
      `changeHexagonSize( ${resolution} ); currentHexSize: ${globals.currentLayerState.hexSize}`
    );

    if (map.getLayer("ocean")) {
      // $(".hexsize").toggle();
      let ele_display = document.querySelector(".hexsize")[0].style.display;

      if (ele_display === "none") {
        ele_display = "block";
      } else if (ele_display === "block") {
        ele_display = "none";
      } else alert("ocean has unexpected display type!! cannot toggle display");

      map.removeLayer("ocean");
    }

    this.remove3d();
    globals.currentLayerState.hexSize = resolution;

    for (var x in constants.userLayers) {
      //clear maplayers that are usercontrolled
      if (map.getLayer(constants.userLayers[x])) {
        map.removeLayer(constants.userLayers[x]);
      }
    }

    var currentSourceData = Vue._.find(globals.sourceData, function (o) {
      if (o.name == globals.currentLayerState.hexSize) {
        console.log(`matching sourceData name: ${o.name}`);
      }
      //find the name of sourceData which matches current hexSize
      return o.name === globals.currentLayerState.hexSize;
    });
    console.log("globals.currentLayerState : ");
    console.log(globals.currentLayerState);
    console.log("currentSourceData from in sourceData: ");
    console.log(currentSourceData);

    map.addLayer(
      {
        id: resolution,
        type: "fill",
        source: resolution,
        "source-layer": currentSourceData.layer,
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0,
        },
      },
      globals.firstSymbolId
    );

    if (resolution === "hex1") {
      //showing loader in expectation of hex1 taking longer to display
      // $(".loader-gis").show();
      // console.log("handling spinner for hex1 loading");
      // this.showSpinner();

      map.once("idle", () => {
        // $(".loader-gis").hide();
        // this.hideSpinner();
      });
    }

    if (map.getStyle().name === "Mapbox Satellite") {
      console.log(`map style is Mapbox Satellite; moveLayer to ${resolution}`);
      map.moveLayer(resolution);
    }

    /*     map.once("idle", function (e) {
      console.log(`map.once on idle triggered by ${e}`);
      console.log("map idle-> recoloring");
      this.recolorBasedOnWhatsOnPage();

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map.moveLayer(resolution, "allsids");
    }); */
    map.once("idle", () => {
      console.log("map idle-> recoloring");
      this.recolorBasedOnWhatsOnPage(); //as it's inside an arrow function this. should refer to the outer scope and should be able to find the function

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map.moveLayer(resolution, "allsids");
    });
  }
  changeBasemap(selectionObject) {
    let self = this;
    let map = this.map;
    console.log("selectionObject: ");
    console.log(selectionObject);
    let basemapName = selectionObject.name;
    let basemapIcon = selectionObject.icon;
    console.log(`changeBasemap( ${basemapName} ); icon: ${basemapIcon}`);

    ////adapting from old basemapSwitch.js
    //get the basemap names
    let currentBasemap = map.getStyle().name;
    let selectedBasemap = selectionObject.name;
    console.log(`${currentBasemap} -> ${selectedBasemap}`);

    //get the uri from the store of styles uri's, and set it
    let thisStyle = Vue._.find(constants.styles, function (style) {
      return style.name === selectedBasemap;
    });
    if (!thisStyle) {
      alert("thisStyle from Basemap not exist");
    }
    map.setStyle(thisStyle.uri);
    for (const i of constants.unwantedMapboxLayers) {
      if (map.getLayer(i)) {
        map.removeLayer(i);
      }
    }

    //when done, update: firstSymbolId, basemapLabels
    map.once("idle", function () {
      let layers = map.getStyle().layers;
      //get first symbol layer for insertion of layer under
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol") {
          globals.firstSymbolId = layers[i].id;
          break;
        }
      }
      for (var x in layers) {
        if (layers[x].type === "symbol" || layers[x].type === "line") {
          globals.basemapLabels.push(layers[x]);
        }
      }

      console.log(`firstSymbolId: ${globals.firstSymbolId}`);
      console.log(`basemapLabels: ${globals.basemapLables}`);

      //addHexSource(); //oldcode, would add all the sources like admin1 etc to the map as sources, then add the allsids layer in orange under the firstSymbolId
      self._addVectorSources();
      let currentSource = Vue._.find(globals.sourceData, function (o) {
        return o.name === globals.currentLayerState.hexSize;
      });
      if (!(globals.currentLayerState.hexSize === "ocean")) {
        let cls = globals.currentLayerState;
        map.addLayer(
          {
            id: cls.hexSize,
            type: "fill",
            source: cls.hexSize,
            "source-layer": currentSource.layer,
            layout: {
              visibility: "visible",
            },
            paint: {
              "fill-opacity": 0.8,
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", cls.dataLayer],
                cls.breaks[0],
                cls.color[0],
                cls.breaks[1],
                cls.color[1],
                cls.breaks[2],
                cls.color[2],
                cls.breaks[3],
                cls.color[3],
                cls.breaks[4],
                cls.color[4],
              ],
            },
          },
          globals.firstSymbolId
        );

        map.setFilter(cls.hexSize, [">=", cls.dataLayer, 0]);
        map.moveLayer("allsids", globals.firstSymbolId); //ensure allsids outline ontop
      } else {
        console.log("currentLayerState.hexSize = ocean; not adding layer");
      }
    });
  }

  addOcean(activeDataset, activeLayer) {
    if (!(activeDataset.name === "Ocean Data")) {
      alert("addOcean called with non-Ocean Data activeDataset!!!");
    }

    //update state
    globals.currentLayerState.dataLayer = activeLayer.Field_Name;
    globals.currentLayerState.hexSize = "ocean";
    //ocean-specific layer state values hardcoded
    //ocean data uses pre-decided breaks and color;
    globals.currentLayerState.breaks = [-4841, -3805, -2608, -1090, 0];
    globals.currentLayerState.color = [
      "#08519c",
      "#3182bd",
      "#6baed6",
      "#bdd7e7",
      "#eff3ff",
    ];

    //clear out all userLayers
    console.log(`removing all userLayers`);
    for (var layer in constants.userLayers) {
      if (this.map.getLayer(constants.userLayers[layer])) {
        this.map.removeLayer(constants.userLayers[layer]);
      }
    }

    //add the layer
    this.map.addLayer(
      {
        id: "ocean",
        type: "fill",
        source: "ocean",
        "source-layer": "oceans",
        layout: {
          visibility: "visible",
        },
        filter: ["<", "depth", 0],
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "depth"],
            -4841,
            "#08519c",
            -3805,
            "#3182bd",
            -2608,
            "#6baed6",
            -1090,
            "#bdd7e7",
            1322,
            "#eff3ff",
          ],
          "fill-opacity": 0.8,
        },
      },
      globals.firstSymbolId
    );

    setTimeout(() => {
      var features = this.map.queryRenderedFeatures({
        layers: ["ocean"],
      });

      if (features) {
        var uniFeatures;
        uniFeatures = this.getUniqueFeatures(features, "depth"); //depth is field_id for ocean depths layer
        var selectedData = uniFeatures.map((x) => x.properties["depth"]);
        this.addLegend(
          globals.currentLayerState.color,
          globals.currentLayerState.breaks,
          2,
          activeLayer,
          selectedData
        );
      }
    }, 600);

    this.addLegend();
  }

  changeDataOnMap(activeDataset, activeLayer) {
    let Field_Name = activeLayer.Field_Name; //get the selected layer's Field_Name
    console.log(`changeDataOnMap fired: ${Field_Name}, activeLayer:`);
    console.log(activeLayer);
    let map = this.map;

    //TAKEN FROM OLDCODE changeDataOnMap

    //------------------------------------------------------
    if (map.getLayer("ocean")) {
      console.log("ocean layer exists...");

      if (!Field_Name.includes("fl")) {
        //if fl inside of the Field_Name (i.e. it's a fishing/ocean related layer)
        console.log(
          `activeLayer ${Field_Name} is not fishing/ocean related; removing ocean layer and adding hex5 layer`
        );
        map.removeLayer("ocean");

        globals.currentLayerState.hexSize = "hex5";

        map.addLayer({
          id: "hex5",
          type: "fill",
          source: "hex5",
          "source-layer": "hex5",
          layout: {
            visibility: "visible",
          },
          paint: {
            "fill-color": "blue",
            "fill-opacity": 0.0,
          },
        });
      }
    } else {
      console.log("map has no 'ocean' layer");
    }
    //-------------------------------------------------------------

    this.remove3d();

    console.log(
      `changeDataOnMap(Field_Name: ${Field_Name}, 
        activeDataset?.name: ${activeDataset?.name}, 
        activeLayer?.Description: ${activeLayer?.Description}`
    );

    globals.currentLayerState.dataLayer = Field_Name; //update global to reflect selected datalayer

    //-------------------------------------------
    if (!map.getSource("hex5")) {
      //console.log('no source')
      console.log("no hex5 source; re-adding all vector sources");
      this._addVectorSources();
    } else {
      //console.log('source!')
    }
    //------------------------------------------

    //unsure the need for this, pay attention if obsolete
    if (!map.getLayer(globals.currentLayerState.hexSize)) {
      console.log(
        `MAP LACKING LAYER for ${globals.currentLayerState.hexSize}; adding layer;`
      );
      var currentSourceData = Vue._.find(globals.sourceData, function (source) {
        //get matching sourceData
        return source.name === globals.currentLayerState.hexSize;
      });

      map.addLayer({
        id: globals.currentLayerState.hexSize,
        type: "fill",
        source: globals.currentLayerState.hexSize,
        "source-layer": currentSourceData.layer,
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.0,
        },
      });

      if (globals.firstSymbolId) {
        //put the added layer behind mapbox symbology layers
        map.moveLayer(globals.currentLayerState.hexSize, globals.firstSymbolId);
      }
    }

    setTimeout(() => {
      console.log(
        `queryRenderedFeatures on layers: ${globals.currentLayerState.hexSize} `
      );
      var features = map.queryRenderedFeatures({
        layers: [globals.currentLayerState.hexSize],
      });

      if (features) {
        var uniFeatures;
        if (globals.currentLayerState.hexSize === "admin1") {
          uniFeatures = this.getUniqueFeatures(features, "GID_1");
        } else if (globals.currentLayerState.hexSize === "admin2") {
          uniFeatures = this.getUniqueFeatures(features, "GID_2");
        } else {
          uniFeatures = this.getUniqueFeatures(features, "hexid");
        }

        //console.log(uniFeatures);
        var selectedData = uniFeatures.map((x) => x.properties[Field_Name]);

        var breaks = chroma.limits(selectedData, "q", 4);
        var breaks_new = [];
        var precision = 1;
        do {
          precision++;
          for (let i = 0; i < 5; i++) {
            breaks_new[i] = parseFloat(breaks[i].toPrecision(precision));
          }
          //console.log(breaks_new);
        } while (this.checkForDuplicates(breaks_new) && precision < 10);
        breaks = breaks_new;

        var colorRamp = colors.colorSeq["yellow-blue"];

        if (Field_Name.substring(0, 2) === "1a") {
          colorRamp = colors.colorDiv.gdpColor;
        } else if (Field_Name.substring(0, 2) === "1c") {
          colorRamp = colors.colorSeq["pop"];
        } else if (Field_Name === "7d10") {
          colorRamp = colors.colorSeq["combo"];
        } else if (Field_Name === "7d5") {
          colorRamp = colors.colorSeq["minty"];
        } else if (Field_Name === "7d7") {
          colorRamp = colors.colorSeq["blues"];
        } else if (Field_Name === "7d4") {
          colorRamp = colors.colorSeq["pinkish"];
        } else if (Field_Name === "7d8") {
          colorRamp = colors.colorSeq["silvers"];
        } else if (Field_Name === "d") {
          breaks = [-4841, -3805, -2608, -1090, 1322];
          colorRamp = colors.colorSeq["ocean"];
        }

        globals.currentLayerState.breaks = breaks;
        globals.currentLayerState.color = colorRamp;

        map.setPaintProperty(globals.currentLayerState.hexSize, "fill-color", [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "yellow",
          [
            "interpolate",
            ["linear"],
            ["get", Field_Name],
            breaks[0],
            colorRamp[0],
            breaks[1],
            colorRamp[1],
            breaks[2],
            colorRamp[2],
            breaks[3],
            colorRamp[3],
            breaks[4],
            colorRamp[4],
          ],
        ]);

        console.log("validating breaks in data");
        if (isNaN(breaks[3]) || breaks[1] == 0) {
          console.log(
            `breaks are NaN, ${globals.currentLayerState.hexSize} set to transparent`
          );
          map.setPaintProperty(
            globals.currentLayerState.hexSize,
            "fill-opacity",
            0.0
          );
          setTimeout(() => {
            map.setFilter(globals.currentLayerState.hexSize, null);
          }, 100);
          this.addNoDataLegend();
        } else {
          map.setFilter(globals.currentLayerState.hexSize, [
            ">=",
            Field_Name,
            0,
          ]);
          console.log(
            `addLegend called in with intended Field_Name: ${Field_Name}`
          );

          this.addLegend(
            colorRamp,
            breaks,
            precision,
            activeLayer,
            selectedData
          );
          setTimeout(() => {
            map.setPaintProperty(
              globals.currentLayerState.hexSize,
              "fill-opacity",
              0.8
            );
          }, 100);
        }
      }
    }, 1000);

    map.moveLayer("allsids", globals.firstSymbolId);
    //END------------------------------------------
  }

  recolorBasedOnWhatsOnPage() {
    console.log(`recolorBasedOnWhatsOnPage()`);
    let map = this.map;
    var features = map.queryRenderedFeatures({
      layers: [globals.currentLayerState.hexSize],
    });

    if (features) {
      var uniFeatures;
      if (globals.currentLayerState.hexSize === "admin1") {
        uniFeatures = this.getUniqueFeatures(features, "GID_1");
      } else if (globals.currentLayerState.hexSize === "admin2") {
        uniFeatures = this.getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = this.getUniqueFeatures(features, "hexid");
      }

      var selectedData = uniFeatures.map(
        (x) => x.properties[globals.currentLayerState.dataLayer]
      );
      //console.log(selectedData);
      var breaks = chroma.limits(selectedData, "q", 4);
      console.log(breaks);
      map.setPaintProperty(globals.currentLayerState.hexSize, "fill-color", [
        "interpolate",
        ["linear"],
        ["get", globals.currentLayerState.dataLayer],
        breaks[0],
        globals.currentLayerState.color[0],
        breaks[1],
        globals.currentLayerState.color[1],
        breaks[2],
        globals.currentLayerState.color[2],
        breaks[3],
        globals.currentLayerState.color[3],
        breaks[4],
        globals.currentLayerState.color[4],
      ]);

      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)

      //addLegend(globals.currentLayerState.color, breaks, globals.currentLayerState.dataLayer)
      if (isNaN(breaks[3]) || breaks[1] == 0) {
        map.setPaintProperty(
          globals.currentLayerState.hexSize,
          "fill-opacity",
          0.0
        );
        setTimeout(() => {
          map.setFilter(globals.currentLayerState.hexSize, null);
        }, 1000);
        console.log("recoloring calliing addNoDataLegend()");
        this.addNoDataLegend();
      } else {
        map.setFilter(globals.currentLayerState.hexSize, [
          ">=",
          globals.currentLayerState.dataLayer,
          0,
        ]);
        console.log(`recoloring calling addLegend with: `);
        console.log(
          `currentLayerState.color: ${globals.currentLayerState.color}`
        );
        console.log(`breaks: ${breaks}`);
        console.log(
          `currentLayerState.dataLayer: ${globals.currentLayerState.dataLayer}`
        );
        // this.addLegend(
        //   //!! I added extra params to addLegend, so needs more i think
        //   globals.currentLayerState.color,
        //   breaks,
        //   globals.currentLayerState.dataLayer
        // );
        // this.addLegend()
        setTimeout(() => {
          map.setPaintProperty(
            globals.currentLayerState.hexSize,
            "fill-opacity",
            0.8
          );
        }, 400);
      }
    }
  }

  remove3d() {
    let map = this.map;
    //taken directly from old code
    console.log("removing 3d");

    let mapLayers = map.getStyle().layers;
    //console.log(lay);
    let threedee = Vue._.find(mapLayers, function (o) {
      return o.type === "fill-extrusion";
    });
    if (threedee) {
      map.removeLayer(threedee.id);
      map.easeTo({
        center: map.getCenter(),
        pitch: 0,
      });
    }
  }

  //adapted from oldcode
  addNoDataLegend() {
    console.log("!!ATTENTION!! addNoDataLegend called");

    let legendTitle = document.getElementById("legendTitle");
    let updateLegend = document.getElementById("updateLegend");
    updateLegend.innerHTML = "";
    legendTitle.innerHTML = "";

    //#clear old canvas
    let old_canvas = document.getElementById("histogram");
    if (typeof old_canvas != "undefined" && old_canvas != null) {
      old_canvas.remove();

      //#recreate an empty canvas element and add it to the frame
      let histogram_frame = document.getElementById("histogram_frame");
      let canvasNode = document.createElement("CANVAS");
      canvasNode.id = "histogram";
      canvasNode.classList.add("histogram_canvas");
      canvasNode.setAttribute("width", 320);
      canvasNode.setAttribute("height", 115);
      histogram_frame.appendChild(canvasNode);
      console.log("new canvasNode added to histogramFrame: ");
      console.log(canvasNode);
    }
  }

  addLegend(
    colors,
    breaks,
    precision,
    activeLayer, //should eliminate need for id etc
    selectedData //i believe this is input from updatingMap based on whats features/data on screen
  ) {
    // let activeLayer = activeLayer; //activeLayer is oldcode variable of the active layer from allLayers globalvariable

    //Debugging logs--------------------------------------
    console.log("addLegend called with: ");
    console.log("in addLegend activeLayer");
    console.log(activeLayer);
    console.log("in addLegend selectedData: ");
    console.log(selectedData);
    //END-Debugging logs-------------------------------------------------------------------------------

    //LEGEND SETUP------------------------------------------------
    let legendTitle = document.getElementById("legendTitle");
    let updateLegend = document.getElementById("updateLegend");

    //reset the legend elements
    updateLegend.innerHTML = "";
    legendTitle.innerHTML = "";
    console.log(`activeLayer: ${activeLayer}`);
    legendTitle.innerHTML = "<span>" + activeLayer.Unit + "</span>";
    //creating legend-hexagon colored symbols
    for (let x in colors) {
      let containerDiv = document.createElement("div");
      containerDiv.classList.add("col-flex");
      containerDiv.classList.add("align-items-center");

      let words = document.createElement("div");
      words.classList.add("population-per-km-text");
      //words.innerHTML = Number.parseFloat(breaks[x]).toFixed(3)
      words.innerHTML = this.nFormatter(breaks[x], precision);
      //words.innerHTML = Number(this.nFormatter(breaks[x], 2))
      let hexI = document.createElement("div");
      hexI.classList.add("population-per-km-img");
      hexI.style.backgroundColor = colors[x];

      containerDiv.appendChild(words);
      containerDiv.appendChild(hexI);
      updateLegend.appendChild(containerDiv);
    }
    //END-LEGEND SETUP -----------------------------------------------
    //HISTOGRAM-----------------------------------------------------
    console.log("addLegend calling updateHistogram");
    this.updateHistogram(colors, breaks, precision, activeLayer, selectedData);
    //-----------------------------------------------------------
  }

  updateHistogram( //called in addLegend; extracted for cleanliness
    colors,
    breaks,
    precision,
    activeLayer,
    selectedData //i believe this is input from updatingMap based on whats features/data on screen
  ) {
    console.log("updateHistogram params passed are:");
    console.log("colors:");
    console.log(colors);
    console.log("breaks:");
    console.log(breaks);
    console.log("precision:");
    console.log(precision);
    console.log("activeLayer:");
    console.log(activeLayer);
    console.log("selectedData:");
    console.log(selectedData);

    //old code

    // histogram-------------------------------------------
    //#clear old canvas
    let old_canvas = document.getElementById("histogram");
    if (typeof old_canvas != "undefined" && old_canvas != null) {
      old_canvas.remove();
      //#recreate an empty canvas element and add it to the frame
      let histogram_frame = document.getElementById("histogram_frame");
      let canvasNode = document.createElement("CANVAS");
      canvasNode.id = "histogram";
      canvasNode.classList.add("histogram_canvas");
      canvasNode.setAttribute("width", 320);
      canvasNode.setAttribute("height", 115);
      histogram_frame.appendChild(canvasNode);
      console.log("new canvasNode added to histogramFrame: ");
      console.log(canvasNode);
    }

    let canvas = document.getElementById("histogram");

    // break
    var nGroup = 200;
    // console.log(`in addHistogram: selectedData = ${selectedData}`);
    // console.log(selectedData);
    var breaks_histogram = chroma.limits(selectedData, "e", nGroup);
    //console.log("breaks_histogram",breaks_histogram);

    // new color
    var break_index = 0;
    var histogram_break_count = Array(4).fill(0);
    for (let i = 0; i < nGroup; i++) {
      if (breaks_histogram[i] > breaks[break_index + 1]) break_index += 1;
      histogram_break_count[break_index] += 1;
    }
    var colorRampNew = [];
    for (let i = 0; i < 4; i++) {
      //old code did not init with var/let anywhere i could find, so init'ing here
      let colorRampPart = chroma
        .scale([colors[i], colors[i + 1]])
        .mode("lch")
        .colors(histogram_break_count[i]);
      colorRampNew = colorRampNew.concat(colorRampPart);
      //console.log(colorRampNew);
    }

    // precision
    var breaks_precision = [];
    for (let i = 0; i < breaks_histogram.length; i++) {
      breaks_precision.push(this.nFormatter(breaks_histogram[i], precision));
    }
    //console.log("breaks_precision:",breaks_precision)

    var histogram_data = Array(nGroup).fill(0);
    for (let i = 0; i < selectedData.length; i++) {
      for (let j = 0; j < nGroup - 1; j++) {
        if (
          selectedData[i] >= breaks_histogram[j] &&
          selectedData[i] < breaks_histogram[j + 1]
        ) {
          histogram_data[j] += 1;
        }
      }
      if (selectedData[i] >= breaks_histogram[nGroup - 1]) {
        histogram_data[nGroup - 1] += 1;
      }
    }
    //console.log("histogram_data",histogram_data)

    //commented out as never used
    /*     var colorRampN = chroma
      .scale([colors[0], colors[4]])
      .mode("lch")
      .colors(nGroup); // yellow to dark-blue
 */
    chroma.scale([colors[0], colors[4]]).mode("lch").colors(nGroup);

    var data = {
      labels: breaks_precision.slice(0, -1),
      datasets: [
        {
          data: histogram_data,
          backgroundColor: colorRampNew,
        },
      ],
    };

    var maxY = Math.pow(10, Math.ceil(Math.log10(Math.max(...histogram_data))));
    var minY = Math.pow(10, Math.ceil(Math.log10(Math.min(...histogram_data))));

    //console.log(maxY,minY);
    //console.log(Math.min(...histogram_data));

    var option = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      updateLegend: {
        display: false,
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
              position: "center",
            },
          },
        ],
      },
      scales: {
        borderWidth: 0,
        yAxes: [
          {
            display: true,
            type: "logarithmic",

            ticks: {
              //scaleStepWidth: 10,
              maxTicksLimit: 4,
              //autoSkip: true,
              //stepSize:10,
              max: maxY,
              //min: 1,

              callback: function (value, index, values) {
                if (index || values) {
                  console.log(
                    `in scales>yAxes>ticks: index or values: ${index} ${values}`
                  );
                }
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
              },
            },
            afterBuildTicks: function (chartObj) {
              //Build ticks labelling as per your need
              chartObj.ticks = [];
              var ticksScale = maxY;
              while (ticksScale > minY && ticksScale >= 1) {
                //console.log(ticksScale);
                chartObj.ticks.push(ticksScale);
                ticksScale /= 10;
              }
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            gridLines: {
              display: true,
            },
            scaleLabel: {
              display: false,
              // labelString: activeLayer.units,
              labelString: activeLayer.Unit,
            },
            ticks: {
              maxTicksLimit: 10,
            },
          },
        ],
      },
    };

    //Histogram in addLegend
    //old code, adapted;
    console.log("myHistogram data: ");
    console.log(data);
    console.log("myHistogram options: ");
    console.log(option);
    console.log("myHistogram canvas: ");
    console.log(canvas);
    // console.log("in updateHistogram");
    console.log("in updateHistogram creating myHistogram");
    globals.myHistogram = Chart.Bar(canvas, {
      data: data,
      options: option,
    });
    console.log(globals.myHistogram);
  }

  //taken from old code
  //formats numbers -- function written by Ben
  nFormatter(num, digits) {
    var si = [
      {
        value: 1,
        symbol: "",
      },
      {
        value: 1e3,
        symbol: "K",
      },
      {
        value: 1e6,
        symbol: "M",
      },
      {
        value: 1e9,
        symbol: "B",
      },
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

  checkForDuplicates(array) {
    //taken directly from oldcode
    //taken from this example: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
    let valuesAlreadySeen = [];

    for (let i = 0; i < array.length; i++) {
      let value = array[i];
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        return true;
      }
      valuesAlreadySeen.push(value);
    }
    return false;
  }

  _addPointSources() {
    let map = this.map; //patching map reference
    //pulls in the pointdata about airports volcanoes etc
    console.log("d3.json fetching pointdata geojson file");

    d3.json(filepaths.pointdataFilePath).then(function (d) {
      map.addSource("points-source", {
        type: "geojson",
        data: d,
      });
    });
  }
  _addVectorSources() {
    console.log(`_addVectorSources()`);
    let map = this.map; //patching map reference
    console.log(`vector sources: ${Object.keys(globals.sources)}`);

    //LOAD SOURCES (VECTOR TILES)
    for (let idString of Object.keys(globals.sources)) {
      console.log("adding " + idString);
      map.addSource(idString, globals.sources[idString]);
    }

    //load the allsids outline onto the map as a layer, if not present
    if (!map.getLayer("allsids")) {
      map.addLayer(
        {
          id: "allsids",
          type: "line",
          source: "allsids",
          "source-layer": "allSids",
          layout: {
            visibility: "visible",
          },
          paint: {
            "line-color": "orange",
            "line-width": 1,
          },
        },
        globals.firstSymbolId
      );
    }

    //finished loading in so hide spinner
    // hideSpinner();//TODO: REIMPLEMENT SPINNER
  }

  logSources() {
    //for debugging
    console.log(this.map.style.sourceCaches);
    console.log(this.map.style._layers);
    console.log(globals);
  }

  _initOnClickControl() {
    console.log("InitOnClickControl");
    const toggleControl = new ToggleControl();
    this.map.addControl(toggleControl, "bottom-right");
  }

  ///onClickControl.js code for onclick querying of hexes
  clearOnClickQuery(mapClassInstance) {
    console.log("clearOnClickQuery");
    console.log("this is:");
    console.log(this);
    console.log("mapClassInstance:");
    console.log(mapClassInstance);

    /* for (let id of ["iso", "clickedone", "highlightS", "joined"]) {
        if (
          mapClassInstance.getLayer("iso") ||
          mapClassInstance.getSource(id)
        ) {
          mapClassInstance.removeLayer(id);
          mapClassInstance.removeSource(id);
        }
      }
 */
    //compressed version of oldcode
    if (
      //this.map.
      mapClassInstance.getLayer("iso")
    ) {
      console.log('removing existing source and layer for "iso"');
      /*         this.map.removeLayer("iso");
        this.map.removeSource("iso"); */
      mapClassInstance.removeLayer("iso");
      mapClassInstance.removeSource("iso");
    }
    for (let id of ["clickedone", "highlightS", "joined"]) {
      console.log(`removing existing source and layer for: ${id}`);
      if (
        //this.map.
        mapClassInstance.getSource(id)
      ) {
        /*           this.map.removeLayer(id);
          this.map.removeSource(id); */
        mapClassInstance.removeLayer(id);
        mapClassInstance.removeSource(id);
      }
    }

    //toggle the custom control displaying value display off
    var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    clickDiv.style.display = "none";
    clickDiv.innerHTML = "";
  }

  _bindMapClickListeners(mapClassInstance) {
    let instance = mapClassInstance;
    //listeners for the query-clicks
    //ISSUE: BINDS TO MAPBOX MAP, WHICH IS CONTAINED INSIDE THIS CUSTOM MAP CLASS THEREFORE LISTENER CALLS FROM MAPBOXMAP AND NOT THIS CLASS
    //IDEA: PASS IN THIS CLASS WITH THE LISTENER AND CALL OUR CLASS METHODS FROM THAT INSTEAD
    this.map.on("click", "hex5", function (e, mapClassInstance = instance) {
      console.log("map.on.click.hex5");
      console.log("this is:");
      console.log(this);
      console.log("mapClassInstance is:");
      console.log(mapClassInstance);

      //clear old selections presents
      mapClassInstance.clearOnClickQuery(mapClassInstance);

      // this.onDataClick(e);
      mapClassInstance.onDataClick(e);
    });

    this.map.on("click", "hex10", function (e, mapClassInstance = instance) {
      console.log("map.on.click.hex10");
      console.log("this is:");
      console.log(this);
      console.log("mapClassInstance is:");
      console.log(mapClassInstance);

      //clear old selections presents
      mapClassInstance.clearOnClickQuery(mapClassInstance);

      // this.onDataClick(e);
      mapClassInstance.onDataClick(e);
    });

    this.map.on("click", "hex1", function (e, mapClassInstance = instance) {
      console.log("map.on.click.hex1");
      console.log("this is:");
      console.log(this);
      console.log("mapClassInstance is:");
      console.log(mapClassInstance);

      //clear old selections presents
      mapClassInstance.clearOnClickQuery(mapClassInstance);

      // this.onDataClick(e);
      mapClassInstance.onDataClick(e);
    });

    this.map.on(
      "click",
      "hex5clipped",
      function (e, mapClassInstance = instance) {
        console.log("map.on.click.hex5clipped");
        console.log("this is:");
        console.log(this);
        console.log("mapClassInstance is:");
        console.log(mapClassInstance);

        //clear old selections presents
        mapClassInstance.clearOnClickQuery(mapClassInstance);

        // this.onDataClick(e);
        mapClassInstance.onDataClick(e);
      }
    );

    this.map.on("click", "admin1", function (e, mapClassInstance = instance) {
      console.log("map.on.click.admin1");

      //clear old selections presents
      mapClassInstance.clearOnClickQuery(mapClassInstance);

      // this.onDataClick(e);
      mapClassInstance.addAdminClick(e);
    });

    this.map.on("click", "admin2", function (e, mapClassInstance = instance) {
      console.log("map.on.click.admin2");

      //clear old selections presents
      mapClassInstance.clearOnClickQuery(mapClassInstance);

      // this.onDataClick(e);
      mapClassInstance.addAdminClick(e);
    });

    this.map.on("click", function () /* e, mapClassInstance = instance */ {
      /*       console.log("map.on.click.clearing-all");
      console.log("this is:");
      console.log(this);
      console.log("mapClassInstance:");
      console.log(mapClassInstance); */
      /* my reimplement
       for (let id of ["iso", "clickedone", "highlightS", "joined"]) {
        if (
          mapClassInstance.getLayer("iso") ||
          mapClassInstance.getSource(id)
        ) {
          mapClassInstance.removeLayer(id);
          mapClassInstance.removeSource(id);
        }
      }
 */
      //compressed version of oldcode
      /* if (
        //this.map.
        mapClassInstance.getLayer("iso")
      ) {
        console.log('removing existing source and layer for "iso"');
        //this.map.removeLayer("iso");
        //this.map.removeSource("iso"); 
        mapClassInstance.removeLayer("iso");
        mapClassInstance.removeSource("iso");
      }
      for (let id of ["clickedone", "highlightS", "joined"]) {
        console.log(`removing existing source and layer for: ${id}`);
        if (
          //this.map.
          mapClassInstance.getSource(id)
        ) {
          // this.map.removeLayer(id);
          // this.map.removeSource(id);
          mapClassInstance.removeLayer(id);
          mapClassInstance.removeSource(id);
        }
      } */
      /* //old code version
      if (this.map.getLayer("iso")) {
        this.map.removeLayer("iso");
        this.map.removeSource("iso");
      }

      if (this.map.getSource("clickedone")) {
        this.map.removeLayer("clickedone");
        this.map.removeSource("clickedone");
      }

      if (this.map.getSource("highlightS")) {
        this.map.removeLayer("highlight");
        this.map.removeSource("highlightS");
      }

      if (this.map.getSource("joined")) {
        this.map.removeLayer("joined");
        this.map.removeSource("joined");
      } */
      /* var clickDiv = document.getElementsByClassName("my-custom-control")[0];

      clickDiv.style.display = "none";
      clickDiv.innerHTML = ""; */
    });
  }

  onDataClick(clicked) {
    console.log(`onDataClick:`);
    console.log(clicked);

    var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    clickDiv.style.display = "block";
    clickDiv.style.height = "100px";
    clickDiv.style.width = "200px";

    clickDiv.innerHTML =
      "<h4><b>Value: </b>" +
      clicked.features[0].properties[
        globals.currentLayerState.dataLayer
      ].toLocaleString() +
      " " +
      document.getElementById("legendTitle").textContent +
      "</h4>";
    /* //was used with a console log for debugging
  var legData = Vue._.find(allLayers, [
    "field_name",
    // currentGeojsonLayers.dataLayer,
    globals.currentLayerState.dataLayer,
  ]); */

    if (this.map.getSource("highlightS")) {
      this.map.removeLayer("highlight");
      this.map.removeSource("highlightS");
    }

    if (this.map.getSource("clickedone")) {
      this.map.removeLayer("clickedone");
      this.map.removeSource("clickedone");
    }

    var currId = clicked.features[0].id;

    var feats = this.map.queryRenderedFeatures({
      layers: [globals.currentLayerState.hexSize],
      filter: ["==", "hexid", currId],
    });

    console.log("queryRenderedFeatures ret:");
    console.log(feats);

    //var testAdmin = map.querySourceFeatures()

    // var fc = turf.featureCollection(feats);
    var fc = featureCollection(feats);
    // console.log(fc);
    // var dis = turf.dissolve(fc);
    var dis = dissolve(fc);

    this.map.addSource("clickedone", {
      type: "geojson",
      data: dis,
    });

    this.map.addLayer({
      id: "clickedone",
      source: "clickedone",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });
  }

  addAdminClick(e) {
    var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    clickDiv.style.display = "block";
    clickDiv.style.height = "100px";
    clickDiv.style.width = "200px";

    console.log(e.features[0].properties);

    //map.on('click', currentGeojsonLayers.hexSize, function (e) {

    console.log(e.features[0].properties.GID_1);
    //console.log(e.features[0].geometry);

    /*var feats = map.queryRenderedFeatures({
          layers: ['admin1'],
          filter: ['==', 'GID_1', e.features[0].id]
          
        }) */

    var rendered = this.map.queryRenderedFeatures({
      layers: ["admin1"],
    });

    var feats;
    if (globals.currentLayerState.hexSize === "admin1") {
      feats = this.map.querySourceFeatures("admin1", {
        sourceLayer: ["admin1"],
        filter: ["==", "GID_1", e.features[0].id],
      });

      clickDiv.innerHTML =
        "<h4><b>" +
        e.features[0].properties.NAME_1 +
        " " +
        e.features[0].properties.TYPE_1 +
        "</b></h4>" +
        "<br><h4><b>Value: </b>" +
        e.features[0].properties[
          globals.currentLayerState.dataLayer
        ].toLocaleString() +
        " " +
        document.getElementById("legendTitle").textContent +
        "</h4>";
    } else if (globals.currentLayerState.hexSize === "admin2") {
      feats = this.map.querySourceFeatures("admin2", {
        sourceLayer: ["admin2"],
        filter: ["==", "GID_2", e.features[0].id],
      });

      clickDiv.innerHTML =
        "<h4><b>Value: </b>" +
        e.features[0].properties[
          globals.currentLayerState.dataLayer
        ].toLocaleString() +
        " " +
        document.getElementById("legendTitle").textContent +
        "</h4>";
    }

    //console.log(feats);
    var countries = [];
    rendered.map(function (x) {
      countries.push(x.properties.NAME_0);
    });

    //console.log(_.uniq(countries));

    if (this.map.getSource("highlightS")) {
      this.map.removeLayer("highlight");
      this.map.removeSource("highlightS");
    }

    if (this.map.getSource("joined")) {
      this.map.removeLayer("joined");
      this.map.removeSource("joined");
    }

    this.map.addSource("highlightS", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addLayer({
      id: "highlight",
      source: "highlightS",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });

    console.log(feats);
    if (feats.length > 1) {
      var newOne = [];

      feats.forEach(function (f) {
        var geom = f.geometry;
        var props = f.properties;
        var id = f.id;

        if (geom.type === "MultiPolygon") {
          console.log(f);
          for (var i = 0; i < geom.coordinates.length; i++) {
            var poly = {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: geom.coordinates[i],
              },
              id: id,
              properties: props,
            };
            newOne.push(poly);
          }
        } else {
          newOne.push(f);
        }
      });

      //var fc = turf.featureCollection(feats)
      // var fc = turf.featureCollection(newOne); //old code
      var fc = featureCollection(newOne);
      //console.log(fc);
      // var joined = turf.dissolve(fc); //old code
      var joined = dissolve(fc);
      //var joined = turf.union(...newOne);
      //console.log(joined);
      //map.getSource('highlightS').setData(joined)
      // var allGeos = []; //never used

      this.map.addSource("joined", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.map.addLayer({
        id: "joined",
        source: "joined",
        type: "line",
        paint: {
          "line-color": "purple",
          "line-width": 3,
        },
      });

      this.map.getSource("joined").setData(joined);
    } else {
      this.map.getSource("highlightS").setData(feats[0]);
    }

    // })
  }
}

// example mapbox control
class ToggleControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.id = "on-click-control";
    this._container.className = "mapboxgl-ctrl my-custom-control";
    this._container.textContent = "Hello, world";
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
