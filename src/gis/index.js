import "mapbox-gl/dist/mapbox-gl.css";
import "@/gis/styles/minimap.css";
import filepaths from "@/gis/static/filepaths.js";
// import constants from "@/gis/static/constants.js";
import globals from "@/gis/static/globals.js";

import constants from "@/gis/static/constants.js";
import colors from "@/gis/static/colors.js";

import * as d3 from "d3";
import chroma from "chroma-js";
import Chart from "chart.js"; //disabled temporarily because of myHistogram/Chart.js issue

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

    this.histogramCanvasElement = null; //storage for the html element that holds the target canvas for the histogram
    this.colors = null;
    this.breaks = null;
    this.precision = null;
    this.activeLayer = null;
    this.selectedData = null;

    this.map.on("load", () => {
      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      this._createMiniMap();

      // this._addSources();
      this._addPointSources();
      this._addVectorSources();
    });
    /* 
    //for debugging the northwards offset zoom issue
    this.map.on("click", (e) => {
      // console.log("A click event occurred.");
      let _debugMarker = new mapboxgl.Marker();
      _debugMarker.setLngLat(e.lngLat); //.addTo(map);
      console.log(`lngLat: ${e.lngLat} point: ${e.point}`);
      console.log("panning to marker location");
      this.map.panTo(e.lngLat);
    }); */
  }

  testMapMethod() {
    console.log("testMapMethod trigger");
    this.map.fitBounds([
      //using bahamas bbox for tesitng
      [-80.47598, 20.91208],
      [-72.71208, 27.27139],
    ]);
    // this.map.panTo([-74, 38]);
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

  makePopUp(options) {
    return new mapboxgl.Popup(options);
  }

  getSource(id) {
    return this.map.getSource(id);
  }

  zoomToCountry(country) {
    // var v2 = new mapboxgl.LngLatBounds([selection[0], selection[1]]);
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

  changeDataOnMap(id, activeDataset, activeLayer) {
    console.log(`changeDataOnMap fired: id = ${id}, activeLayer:`);
    console.log(activeLayer);
    let map = this.map;

    //TAKEN FROM OLDCODE changeDataOnMap
    /*     console.log(
      `changeDataOnMap( ${id} ); currentHexSize: ${globals.currentLayerState.hexSize}`
    ); */
    if (map.getLayer("ocean")) {
      console.log("ocean layer exists...");
      //if oceans already added:

      if (!id.includes("fl")) {
        //if fl inside of the id (i.e. it's a fishing/ocean related layer)
        console.log(
          `${id} is not fishing/ocean related; removing ocean layer and adding hex5 layer`
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
    }
    this.remove3d();
    console.log(
      `changeDataOnMap(Field_Name: ${id}, activeDataset?.name: ${activeDataset?.name}, activeLayer?.Name: ${activeLayer?.Name}) updating globals.currentLayerState.dataLayer to ${id}`
    );
    globals.currentLayerState.dataLayer = id; //update mapstate to reflect selected datalayer

    if (!map.getSource("hex5")) {
      //console.log('no source')
      console.log("UNEXPECTED ATTEMPTED FIRING OF ADDHEXSOURCE()");
      // addHexSource();
    } else {
      //console.log('source!')
    }
    if (!map.getLayer(globals.currentLayerState.hexSize)) {
      //if
      var currentSourceData = Vue._.find(globals.sourceData, function (o) {
        //get matching sourceData
        return o.name === globals.currentLayerState.hexSize;
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
        var selectedData = uniFeatures.map((x) => x.properties[id]);
        //console.log(selectedData);

        /*        //commented out to adapt to new code not tolerating these not being used 
        var max = Math.max(...selectedData);
        var min = Math.min(...selectedData); */

        //var colorz = chroma.scale(['lightyellow', 'navy']).domain([min, max], 5, 'quantiles');
        var breaks = chroma.limits(selectedData, "q", 4);
        //console.log("BREAK",breaks)
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

        if (id.substring(0, 2) === "1a") {
          colorRamp = colors.colorDiv.gdpColor;
        } else if (id.substring(0, 2) === "1c") {
          colorRamp = colors.colorSeq["pop"];
        } else if (id === "7d10") {
          colorRamp = colors.colorSeq["combo"];
        } else if (id === "7d5") {
          colorRamp = colors.colorSeq["minty"];
        } else if (id === "7d7") {
          colorRamp = colors.colorSeq["blues"];
        } else if (id === "7d4") {
          colorRamp = colors.colorSeq["pinkish"];
        } else if (id === "7d8") {
          colorRamp = colors.colorSeq["silvers"];
        } else if (id === "d") {
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
            ["get", id],
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

        //map.setFilter(globals.currentLayerState.hexSize,['>=',id, 0])
        if (isNaN(breaks[3]) || breaks[1] == 0) {
          //setTimeout(() => { map.setFilter(globals.currentLayerState.hexSize, null) }, 500);

          map.setPaintProperty(
            globals.currentLayerState.hexSize,
            "fill-opacity",
            0.0
          );
          setTimeout(() => {
            map.setFilter(globals.currentLayerState.hexSize, null);
          }, 100);
          console.log("changeDataOnMap calliing addNoDataLegend()");
          this.addNoDataLegend();
        } else {
          map.setFilter(globals.currentLayerState.hexSize, [">=", id, 0]);

          //console.log(selectedData)
          //console.log(max)

          console.log(`addLegend called in with intended id/Field_Name: ${id}`);
          // this.addLegend(colorRamp, breaks, precision, id, selectedData); //oldcode;
          /*            //commented out; uses the older form of addLegend
            this.addLegend(colorRamp,breaks,precision,id,activeDataset,activeLayer,selectedData); */
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
    let lay = map.getStyle().layers;
    //console.log(lay);
    let threedee = Vue._.find(lay, function (o) {
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

    /*     let element = document.getElementById("histogram");
    if (typeof element != "undefined" && element != null) {
      document.getElementById("histogram").remove();
    } */

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

  /*   setHistogramElement(histogramCanvasElement) {
    this.histogramCanvasElement = histogramCanvasElement;
  }
  getHistogramElement() {
    return this.histogramCanvasElement;
  } */

  updateHistogram( //called in addLegend; extracted for cleanliness
    colors,
    breaks,
    precision,
    activeLayer, //should eliminate need for id etc
    selectedData //i believe this is input from updatingMap based on whats features/data on screen
  ) {
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
    //old code, adapted; disabled because cannot figure out issue Chart.js has with it right now
    /*     console.log("myHistogram data: ");
    console.log(data);
    console.log("myHistogram options: ");
    console.log(option);
    console.log("myHistogram canvas: ");
    console.log(canvas); */
    globals.myHistogram = Chart.Bar(canvas, {
      data: data,
      options: option,
    });
  }

  //taken directly from oldcode
  oldaddLegend( //obsoleted by (new) addLegend
    colors,
    breaks,
    precision,
    id,
    activeDataset,
    activeLayer,
    dataset
  ) {
    // let activeLayer = Vue._.find(globals.allLayers, ["Field_Name", current]);
    console.log("addLegend called with: ");
    console.log("activeDataset");
    console.log(activeDataset);
    console.log("activeLayer");
    console.log(activeLayer);
    console.log("id");
    console.log(id);

    let legData = null;
    if (activeDataset) {
      //should be able to skip this by using activeLayer; activeLayer is the direct dataset
      if (activeDataset.type === "single") {
        //single layer dataset
      } else if (activeDataset.type === "layers") {
        //multiple layers (nontemporal)
        console.log("multiplelayers-type dataset");
      } else if (activeDataset.type === "temporal") {
        ///temporal dataset
        console.log("temporal-type dataset");
      } else {
        alert(`activeDataset.type ${activeDataset.type} unrecognized`);
      }
      console.log("activeDataset given: ");
      console.log(activeDataset);
      console.log("activeDataset.layers");
      console.log(activeDataset?.layers);
    }
    if (activeDataset) {
      for (let object of activeDataset.layers) {
        if (object.Field_Name === id) {
          legData = object;
          console.log(legData);
          break;
        }
      }
    } else {
      console.log(
        `activeDataset is: ${activeDataset}; cannot get legendData from it`
      );
    }

    // let legData = Vue._.find(globals.allLayers, ["Field_Name", current]); /

    // let legData = activeLayer; //passed from parameter;
    // console.log("legData from activeLayer passed in as parameter :");
    // console.log(legData);

    /* //the infobox is succeeded by the new vue-based one
    var infoBoxTitle = document.getElementById("infoBoxTitle");
    var infoBoxText = document.getElementById("infoBoxText");
    var infoBoxLink = document.getElementById("infoBoxLink");

    infoBoxTitle.innerHTML = "";
    infoBoxText.innerHTML = "";
    infoBoxLink.innerHTML = "";

    infoBoxTitle.innerHTML = legData.desc + " " + legData.time;
    infoBoxText.innerHTML = legData.desc_long;
    infoBoxLink.innerHTML =
      "<strong>Reference: </strong>" +
      legData.source_name +
      ' - <a href="' +
      legData.link +
      '" target="_blank">' +
      legData.link +
      "</a>";

      */
    var legendTitle = document.getElementById("legendTitle");
    var updateLegend = document.getElementById("updateLegend");
    updateLegend.innerHTML = "";
    legendTitle.innerHTML = "";
    console.log(`legData: ${legData}`);
    legendTitle.innerHTML = "<span>" + legData.Unit + "</span>";

    for (var x in colors) {
      var containerDiv = document.createElement("div");
      containerDiv.classList.add("col-flex");
      containerDiv.classList.add("align-items-center");

      var words = document.createElement("div");
      words.classList.add("population-per-km-text");
      //words.innerHTML = Number.parseFloat(breaks[x]).toFixed(3)
      words.innerHTML = this.nFormatter(breaks[x], precision);
      //words.innerHTML = Number(this.nFormatter(breaks[x], 2))
      var hexI = document.createElement("div");
      hexI.classList.add("population-per-km-img");
      hexI.style.backgroundColor = colors[x];

      containerDiv.appendChild(words);
      containerDiv.appendChild(hexI);
      updateLegend.appendChild(containerDiv);
    }

    //console.log("colors",colors)
    //console.log("breaks",breaks)
    //console.log("precision",precision)
    //console.log("current",current)
    //console.log("dataset",dataset)

    // histogram
    var element = document.getElementById("histogram");
    if (typeof element != "undefined" && element != null) {
      // $("#histogram").remove();
      document.getElementById("#histogram").remove();
    }
    /*     $("#histogram_frame").append(
      '<canvas id="histogram" width="320" height="115"><canvas>'
    ); */
    document
      .getElementById("histogram_frame")
      .append('<canvas id="histogram" width="320" height="115"><canvas>');
    // var canvas = document.getElementById("histogram"); //disabled temporarily because of myHistogram/Chart.js issue

    // break
    var nGroup = 200;
    var breaks_histogram = chroma.limits(dataset, "e", nGroup);
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
    for (let i = 0; i < dataset.length; i++) {
      for (let j = 0; j < nGroup - 1; j++) {
        if (
          dataset[i] >= breaks_histogram[j] &&
          dataset[i] < breaks_histogram[j + 1]
        ) {
          histogram_data[j] += 1;
        }
      }
      if (dataset[i] >= breaks_histogram[nGroup - 1]) {
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

    /*    //disabled temporarily because of myHistogram/Chart.js issue
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

              callback: function (value) {
                //params removed as unused and throws error in newcode //used to include index, values
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
              labelString: legData.units,
            },
            ticks: {
              maxTicksLimit: 10,
            },
          },
        ],
      },
    };
 */
    //Histogram in addLegend
    /* //old code, adapted; disabled because cannot figure out issue Chart.js has with it right now
    console.log(data);
    console.log(option);
    globals.myHistogram = Chart.Bar(canvas, {
      data: data,
      options: option,
    });
    */
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
    let map = this.map; //patching map reference
    console.log(`vector sources: ${Object.keys(globals.sources)}`);

    //LOAD SOURCES (VECTOR TILES)
    for (let idString of Object.keys(globals.sources)) {
      console.log("adding " + idString);
      map.addSource(idString, globals.sources[idString]);
    }

    if (!map.getLayer("allsids")) {
      console.log(`allsids not present->adding layer to map`);

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
    // hideSpinner();//TODO REIMPLEMENT SPINNER
  }
}
