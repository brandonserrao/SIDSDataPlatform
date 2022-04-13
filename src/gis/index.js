//local imports---------------------------------------
// import { gis_store } from "../gis/gis_store.js";
//import "@/gis/styles/minimap.css";
// import mapboxMinimap from "mapbox.minimap";
import filepaths from "@/gis/static/filepaths.js";
import globals from "@/gis/static/globals.js";
import constants from "@/gis/static/constants.js";
import colors from "@/gis/static/colors.js";
//----------------------------------------------------
//3rd party imports-----------------------------------
import mapboxgl from "@/gis/mapboxgl";
import "mapbox-gl/dist/mapbox-gl.css";
// eslint-disable-next-line no-unused-vars
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import Compare from "mapbox-gl-compare"; //https://github.com/mapbox/mapbox-gl-compare/issues/1
import "mapbox-gl-compare"; //expecting mapboxgl to be present on window object, result in Compare attached to window.mapboxgl.Compare
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";

import * as d3 from "d3";
import chroma from "chroma-js";
import Chart from "chart.js";
import { featureCollection } from "@turf/helpers";
import dissolve from "@turf/dissolve";
import bbox from "@turf/bbox";
import booleanIntersects from "@turf/boolean-intersects";
//----------------------------------------------------
//---------used to bring in lodash for oldcode
import Vue from "vue";
import VueLodash from "vue-lodash";
import lodash from "lodash";
Vue.use(VueLodash, { name: "custom", lodash: lodash });
//----------------------------------------------------

// eslint-disable-next-line no-unused-vars
// import map from "core-js/fn/array/map";

export default class Map {
  constructor(containerId, leftMapContainerId, rightMapContainerId) {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";

    /* this.map = new mapboxgl.Map({
      //main map currently used for all our usage
      containerId, // container ID
      ...constants.mapOptions,
    }); */

    //testing use of a store
    // this.gis_store = gis_store;

    //testing implementation of comparison swiper------------------------
    this.containerId = containerId; //containerId of the div that contains the primary map1 and the secondary map2; a necessary arg for the mapboxglCompare plugin
    //main map currently used for all our usage
    this.map = new mapboxgl.Map({
      container: leftMapContainerId,
      ...constants.mapOptions,
    });
    //adding the 2nd map instance used for comparison/swipe features
    this.map2 = new mapboxgl.Map({
      container: rightMapContainerId,
      ...constants.mapOptions,
    });
    /* 
    console.log("this.map");
    console.log(this.map);
    console.log("this.map2");
    console.log(this.map2);
    console.log("containerId");
    console.log(containerId);

    this.mapCompare = new Compare(this.map, this.map2, containerId, {
      mousemove: true,
      orientation: "vertical",
    }); */
    //---------------------------------------------------------------------

    //for the mapbox drawing functionality, used in region analysis/drawing polygons
    this.Draw = null; //storing the Draw Mode instance inside the Map class instance
    this.drawModeDisabled = false;
    //TODO : extract this creation to a function that fires on clickign the toolbar (and add one that removes it on close)
    /* if (!this.drawModeDisabled) {
      this.Draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
          polygon: true,
          // trash: true,
        },
      });
    } */

    this.map.on("load", () => {
      //this._bindMapDebugListeners(this.map); //adds lifecycle and data listeners for debugging to console
      // this._createMapComparison(this);

      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      // this._createMiniMap();
      this._initOnClickControl();

      this._bindMapClickListeners(this); //attempt to pass class into this function, to allow access to class when mapbox map level events are called that can't see the class functions normally
      this._bindRecolorListeners(this); //using this convention from _bindMapClickListeners; TODO review and rewrite these functions

      this._addPointSources();
      this._addVectorSources();
      this.getBasemapLabels();

      // this.map.addControl(this.Draw, "bottom-right"); //ui buttons for drawing//TESTING - reimplementing Draw functionality
      console.warn("disabled drawModeDisabled check for debugging");
      /* if (!this.drawModeDisabled) {
        document
          .getElementById("drawControls")
          .appendChild(this?.Draw.onAdd(this.map)); //

        this._initDrawInfoControl(); //display area for region analysis info //obsoleted by non-mapboxcontrol divs
        this._addDrawListeners(this);
      } */

      // this._setupComparison(containerId, this.map, this.map2);
      this.createComparison(containerId, this.map, this.map2);
      this.removeComparison(); //!! creating and immediately removing as my attempt to instantiate
      //  the comparison via the toolbar button later on (with toolbar button click) results in
      //  map2 having diferent dimensions for some reason not immediately apparent
      ////map2 having different dimensions somehow due to window resizing taking place between separate instantiations;
    });

    //for bivariate mode
    //create initial scatter plot legend to be mutated later
    globals.myBivariateScatterChart = new Chart(
      document.getElementById("bivariate_canvas"),
      {
        type: "scatter",
        data: {}, //empty data
        options: {},
      }
    );

    //for debugging--------------------
    let self = this.map;
    this.map.on("click", () => {
      // console.log(`A click event at ${e.lngLat}`);
      console.log("isStyleLoaded():", self.isStyleLoaded());
      console.log("areTilesLoaded():", self.areTilesLoaded());
      // console.log("getZoom():", self.getZoom());
      // console.log("getMinZoom():", self.getMinZoom());
      // console.log("getMaxZoom():", self.getMaxZoom());
    });

    window.myMapClass = this; //easy access for debugging purposes via the browser console
    //--------------------------------
  }

  //Map class methods:
  //A) map initialization methods----------------------------------------------------------------------------

  toggleBivariateComponents(debug = false) {
    if (globals.compareMode) {
      console.warn("compareMode active; doing nothing;");
      return;
    }
    if (debug) {
      console.log("bivariateMode:", globals.bivariateMode);
    }
    if (!globals.bivariateMode) {
      document
        .querySelector(".v-card.histogram_frame")
        .classList.add("display-none"); //toggle display of histogram information
      if (debug) {
        console.warn("show Bivariate, turn main layer transparent");
      }
      document.querySelector(".tab-system-box").classList.add("display-none");

      document
        .querySelector(".v-card.bivariate_frame")
        .classList.remove("display-none"); //toggle display of histogram information
      // this.createBivariate();
      //set opacity of main mode data layer to full transparent
      this.changeOpacity({ opacity: 0.0 });
    } else {
      document
        .querySelector(".v-card.histogram_frame")
        .classList.remove("display-none"); //toggle display of histogram information
      if (debug) {
        console.warn("hide Bivariate, increase main layer opacity");
      }
      document
        .querySelector(".tab-system-box")
        .classList.remove("display-none");

      document
        .querySelector(".v-card.bivariate_frame")
        .classList.add("display-none"); //toggle display of histogram information
      this.removeBivariateLayer();
      //set opacity of main mode data layer to full transparent
      this.changeOpacity({ opacity: 40.0 });
    }

    globals.bivariateMode = !globals.bivariateMode; //toggle the value
  }
  createBivariate(
    firstDataset,
    firstLayer,
    secondDataset,
    secondLayer,
    debug = true
  ) {
    if (debug) {
      console.log(
        "createBivariate()",
        "firstDataset",
        firstDataset,
        "firstLayer",
        firstLayer,
        "secondDataset",
        secondDataset,
        "secondLayer",
        secondLayer
      );
    }

    let mapClassInstance = this;
    let map = this.map;
    let cls = globals.currentLayerState;
    let bvls = globals.bivariateLayerState;
    //updating bivariate global state variables, to inform other functions like onBivariateClick
    bvls.dataLayer[0] = firstLayer;
    bvls.dataLayer[1] = secondLayer;
    console.log(
      "updated globals.bivariateLayerState.dataLayer with firstLayer and secondLayer: ",
      bvls.dataLayer
    );

    //adapted from oldcode createBivar() from bivariate.js
    // if (map.getLayer(cls.hexSize)) {
    //   map.setPaintProperty(cls.hexSize, "fill-opacity", 0.0);
    // }

    // if (!(secondLayer == null) && !(firstLayer == null)) {
    // } else
    if (secondLayer == null || firstLayer == null) {
      if (debug) {
        console.warn(
          "bivariate mode passed incomplete pair of layers:",
          firstLayer,
          secondLayer,
          "doing nothing"
        );
      }
      return;
    } else if (
      [firstLayer.Name, secondLayer.Name].includes("Ocean Data") &&
      firstLayer.Name !== secondLayer.Name
    ) {
      if (debug) {
        console.warn(
          "bivariate mode passed incompatible pair of ocean+land layers:",
          firstLayer.Name,
          secondLayer.Name,
          "doing nothing"
        );
      }
      return;
    } else {
      if (debug) {
        console.log("bivariate passed layers:", firstLayer, secondLayer);
      }
      //a pair of datalayers passed so proceed to create bivariate
      //check for a pair of ocean and land data, which would lead to fatal crash

      //obsolete //remove existing bivariate map layer
      // if (debug) {
      //   console.log("removing preexisting bivariate layer");
      // }
      // if (map.getLayer("bivariate")) {
      //   map.removeLayer("bivariate");
      //   map.removeSource("bivariate");
      // }

      //get map features //TODO refactor to account for future vector tiles being not aggregated; will to fetch multiple tiles; likely better to query sources instead of rendered
      // let features = map.queryRenderedFeatures({ layers: [cls.hexSize] });

      let features = map.querySourceFeatures(cls.hexSize, {
        //sourceLayer: [cls.hexSize],
        sourceLayer: [cls.hexSize === "ocean" ? "oceans" : cls.hexSize], //TODO improve ocean source naming consistency so can eliminate this quick hack
      });
      if (debug) {
        console.log("querying souurcefeatures/layer for:", cls.hexSize);
      }
      if (features?.length != 0) {
        // eslint-disable-next-line no-unused-vars
        let uniqueFeatures; //unused; originally used instead of duplicate source features but runs into issue of cutting off features crossing tile boundaries;
        //TODO improve handling of features crossing tile boundaries, perhaps using ID or something; BUG banding of features buffered on tile boundaries, likely due to tile buffering and visible due to a slightly transparent layer paint property of output bivariate layer
        let idProperty = null; //to use as promoteId for the output bivariate geojson source that powers the bivariate layer
        if (cls.hexSize === "admin1") {
          uniqueFeatures = this.getUniqueFeatures(features, "GID_1");
          idProperty = "GID_1";
        } else if (cls.hexSize === "admin2") {
          uniqueFeatures = this.getUniqueFeatures(features, "GID_2");
          idProperty = "GID_2";
        } else {
          uniqueFeatures = this.getUniqueFeatures(features, "hexid");
        }
        // let featuresUsed = uniqueFeatures;
        let featuresUsed = features; //vs using uniqueFeatures, since i'm trying to solve the issue of losing features at the maptile border lines
        //data ids for the two layers of interest
        let attrId_1 = firstLayer.Field_Name;
        let attrId_2 = secondLayer.Field_Name;
        //isolate values from the aggregated property values in the features
        //and make values absolute if appropriate (eg. ocean depth being negative values)
        let negativeAttrIds = ["depth"]; //TODO extract this to some settings
        if (debug) {
          console.log("attr1Id:", attrId_1, "attr2Id:", attrId_2);
          if (
            negativeAttrIds.includes(attrId_1) ||
            negativeAttrIds.includes(attrId_2)
          )
            console.log(
              "negativeIds present Id1: ",
              negativeAttrIds.includes(attrId_1),
              "Id2",
              negativeAttrIds.includes(attrId_2)
            );
        }
        let data_1 = featuresUsed.map((x_feat) => {
          let isNegative = negativeAttrIds.includes(attrId_1) ? -1 : 1;
          let propertyValue = x_feat.properties[attrId_1];
          return propertyValue * isNegative;
          // x_feat.properties[attrId_1] *
          //   negativeAttrIds.includes(attrId_1)
          //   ? -1
          //   : 1;
        });
        let data_2 = featuresUsed.map((y_feat) => {
          let isNegative = negativeAttrIds.includes(attrId_2) ? -1 : 1;
          let propertyValue = y_feat.properties[attrId_2];
          return propertyValue * isNegative;
          // y_feat.properties[attrId_2] *
          //   negativeAttrIds.includes(attrId_2)
          //   ? -1
          //   : 1;
        });
        if (debug) {
          console.log("data_1: ", data_1, "data_2", data_2);
        }
        //check for case where no data for one of the selected data layers (field ID/name)
        let hasData = {
          data_1: data_1.some((x) => !Number.isNaN(x)),
          data_2: data_2.some((y) => !Number.isNaN(y)),
        };
        if (debug) {
          console.log("bivariate selections hasData:", hasData);
        }
        if (!hasData.data_1 || !hasData.data_2) {
          console.warn(
            "!! a selected datalayer has no data for this region: ",
            hasData
          );

          //remove preexisting bivariate layer
          if (map.getLayer("bivariate")) {
            map.removeLayer("bivariate");
            map.removeSource("bivariate");
          }

          return;
        }

        //compute breakpoint values in these datasets, and update them in state
        let X_breaks = chroma.limits(data_1, "q", 3);
        let Y_breaks = chroma.limits(data_2, "q", 3);
        bvls.breaks.X = X_breaks;
        bvls.breaks.Y = Y_breaks;
        //choice of bivariate color palette
        let bivar_colors = colors.colorSeqSeq3["blue-pink-purple"];
        bvls.color = bivar_colors; //updating state
        if (debug) {
          console.log(
            "bivariate color palette: ",
            bivar_colors,
            "X_breaks:",
            X_breaks,
            "Y_breaks: ",
            Y_breaks
          );
        }

        //containers for tracking class of each feature, and for counting for scatter plot
        let bivarClass = Array(featuresUsed.length).fill(0);
        let bivarScatter = new Array(10);
        for (let i = 0; i < 10; i++) {
          bivarScatter[i] = [];
        }

        //start computing features' bivarclasses and filling scatter counter
        for (let i = 0; i < featuresUsed.length; i++) {
          //get the values of concern from that shared feature
          let x_val = data_1[i];
          let y_val = data_2[i];
          //he was using a low/med/high scale so 3x3 grid of classes //TODO generalize and refactor to allow custom scaling
          //determine class
          let range_1, range_2;
          if (x_val < X_breaks[1]) range_1 = 1;
          //check range in x
          else if (x_val < X_breaks[2]) range_1 = 2;
          else range_1 = 3;
          if (y_val < Y_breaks[1]) range_2 = 1;
          //check range in y
          else if (y_val < Y_breaks[2]) range_2 = 2;
          else range_2 = 3;
          var coord = String(range_1) + String(range_2);
          //account for data property values for a feature not being defined
          if (Number.isNaN(x_val) || Number.isNaN(y_val)) {
            //(typeof x_val == "undefined" || typeof y_val == "undefined")
            coord = null; //"Null";
          }
          //assign class to that feature //TODO can be refactored into two consequtive loops that count (along the axis bsaically) and add index to a final counter indicating class
          switch (coord) {
            case "11":
              bivarClass[i] = 0;
              break; //LL
            case "12":
              bivarClass[i] = 1;
              break; //LM
            case "13":
              bivarClass[i] = 2;
              break; //LH
            case "21":
              bivarClass[i] = 3;
              break; //ML
            case "22":
              bivarClass[i] = 4;
              break; //MM
            case "23":
              bivarClass[i] = 5;
              break; //MH
            case "31":
              bivarClass[i] = 6;
              break; //HL
            case "32":
              bivarClass[i] = 7;
              break; //HM
            case "33":
              bivarClass[i] = 8;
              break; //HH
            case null: //"Null":
              bivarClass[i] = 9;
              break; //NULL
          }
          bivarScatter[bivarClass[i]].push({ x: x_val, y: y_val }); //assign the bivarPairValues object to the counter of the scatterObject for hte appropriate class
          featuresUsed[i]["properties"]["bivarClass"] = bivarClass[i]; //adding a property to the hex features; //TODO needs a better way especially for after switch to non-aggregated features
        }
        //convert the unique features into a feature collection for addition to the map as a geojson layer
        var fc = featureCollection(featuresUsed);
        if (debug) {
          console.warn(
            "featuresUsed: ",
            featuresUsed,
            "featureCollection",
            fc,
            "bivarScatter",
            bivarScatter
          );
        }
        //remove preexisting bivariate layer
        if (map.getLayer("bivariate")) {
          map.removeLayer("bivariate");
          map.removeSource("bivariate");
        }
        //removing the data-carrying layer from the map, in order to avoid firing onClick events for it, and we've already queried it for the features necessary to calculate the bivariate values
        // if (map.getLayer(cls.hexSize)) {
        //   map.removeLayer(cls.hexSize);
        //   map.removeSource(cls.hexSize);
        // }
        //add new source
        map.addSource("bivariate", {
          type: "geojson",
          data: fc, //data is the new geojson
          promoteId: idProperty,
        });
        map.addLayer({
          id: "bivariate",
          source: "bivariate",
          type: "fill",
          paint: {
            "fill-color": [
              "step", //step operator
              ["get", "bivarClass"], //the input;retreive a number literal ie. the bivariate class;
              //values changed from Atlases code, the first output value is used if the input value is less than the first numeric-stop value i.e 1
              //his code had the first as 0, which was wrong
              bivar_colors[0],
              1,
              bivar_colors[1],
              2,
              bivar_colors[2],
              3,
              bivar_colors[3],
              4,
              bivar_colors[4],
              5,
              bivar_colors[5],
              6,
              bivar_colors[6],
              7,
              bivar_colors[7],
              8,
              bivar_colors[8],
              9,
              "rgba(255,255,255,0)",
            ],
            "fill-opacity": debug ? 0.9 : 1,
          },
        });

        if (!cls.hexSize === "bivariate") {
          cls.hexSize = "bivariate";
        }

        // let instance = mapClassInstance;
        // this.map.on(
        //   "click",
        //   "bivariate",
        //   function (e, mapClassInstance = instance) {
        //     mapClassInstance.clearOnClickQuery(mapClassInstance);
        //     mapClassInstance.onBivariateClick(e);
        //   }
        // );

        //bivariate legend code
        //hide histogram stuff legend and title
        //remove preexisting bivar plot and selector eleements

        // let element = document.getElementById("bivarPlot");
        // if (typeof element != "undefined" && element != null) {
        //   $("#bivarPlot").remove();
        //   $("#bivarSwitcher").remove();
        // }
        // let element = document.getElementById("histogram");
        // if (typeof element != "undefined" && element != null) {
        //   $("#histogram").remove();
        // }

        // let bivarFrameElement = document.getElementById("bivariate_frame");
        // bivarFrameElement.append(
        //   '<canvas id="bivariate_canvas" ref="canvas_bivariate" width="320" height="200"><canvas>'
        // );
        // $("#histogram_frame").append(
        //   '<select id="bivarSwitcher" onChange="bivarScaleSwitch(this.value);"><option value="logarithmic">logarithmic</option><option value="linear">linear</option></select>'
        // );
        // dynamic point size
        let firstLabel = firstLayer.Unit;
        // new DOMParser().parseFromString(
        //   firstLayer.Unit,
        //   "text/html"
        // ).body.innerHTML;
        let secondLabel = secondLayer.Unit;
        // new DOMParser().parseFromString(
        //   secondLayer.Unit,
        //   "text/html"
        // ).body.innerHTML;
        let point_radius;
        if (featuresUsed.length < 100) {
          point_radius = 3.3;
        } else if (featuresUsed.length > 1000) {
          point_radius = 1.5;
        } else {
          point_radius = ((featuresUsed.length - 100) / 100) * 0.2;
        }
        // eslint-disable-next-line no-unused-vars
        let bivar_option = {
          scales: {
            xAxes: [
              {
                display: true,
                type: "logarithmic",
                scaleLabel: {
                  display: true,
                  //labelString: Vue._.find(allLayers, ["field_name", attrId_1])["title"], //adapted from oldcode, i presume was looking for the title/name of the dataset in order to label axes
                  labelString: firstLabel, //firstLayer.Unit,
                },
                ticks: {
                  min: X_breaks[0], //minimum tick
                  max: X_breaks[3], //maximum tick
                  //maxTicksLimit: 4,
                  maxRotation: 45,
                  minRotation: 45,

                  callback: function (
                    valueX
                    //index,
                    //values
                  ) {
                    if (valueX === 100000000) return "100M";
                    if (valueX === 10000000) return "10M";
                    if (valueX === 1000000) return "1M";
                    if (valueX === 100000) return "100K";
                    if (valueX === 10000) return "10K";
                    if (valueX === 1000) return "1K";
                    if (valueX === 100) return "100";
                    if (valueX === 10) return "10";
                    if (valueX === 1) return "1";
                    if (valueX === 0.1) return "0.1";
                    if (valueX > 10)
                      return mapClassInstance.nFormatter(valueX, 1);
                    else return mapClassInstance.nFormatter(valueX, 2);
                  },
                },

                afterBuildTicks: function (chartObjX) {
                  chartObjX.ticks = [];
                  chartObjX.ticks.push(X_breaks[3]);
                  chartObjX.ticks.push(X_breaks[2]);
                  chartObjX.ticks.push(X_breaks[1]);
                  chartObjX.ticks.push(X_breaks[0]);
                },
              },
            ],
            yAxes: [
              {
                display: true,
                type: "logarithmic",
                scaleLabel: {
                  display: true,
                  //labelString: Vue._.find(allLayers, ["field_name", attrId_2])["title"],
                  labelString: secondLabel, //secondLayer.Unit,
                },
                ticks: {
                  min: Y_breaks[0], //minimum tick
                  max: Y_breaks[3], //maximum tick
                  //maxTicksLimit: 4,
                  maxRotation: 45,
                  minRotation: 45,

                  callback: function (
                    valueY
                    //index,
                    //values
                  ) {
                    if (valueY === 100000000) return "100M";
                    if (valueY === 10000000) return "10M";
                    if (valueY === 1000000) return "1M";
                    if (valueY === 100000) return "100K";
                    if (valueY === 10000) return "10K";
                    if (valueY === 1000) return "1K";
                    if (valueY === 100) return "100";
                    if (valueY === 10) return "10";
                    if (valueY === 1) return "1";
                    if (valueY === 0.1) return "0.1";
                    if (valueY > 10)
                      return mapClassInstance.nFormatter(valueY, 1);
                    else return mapClassInstance.nFormatter(valueY, 2);
                  },
                },

                afterBuildTicks: function (chartObjY) {
                  chartObjY.ticks = [];
                  chartObjY.ticks.push(Y_breaks[3]);
                  chartObjY.ticks.push(Y_breaks[2]);
                  chartObjY.ticks.push(Y_breaks[1]);
                  chartObjY.ticks.push(Y_breaks[0]);
                },
              },
            ],
          },

          legend: {
            position: "top",
            display: false,
          },
          tooltips: false,
        };

        let bivarClasses = [
          "L-L",
          "L-Mid",
          "L-H",
          "Mid-L",
          "Mid-Mid",
          "Mid-H",
          "H-L",
          "H-Mid",
          "H-H",
        ];
        let bivarDatasets = [];
        for (let i = 0; i < 9; i++) {
          bivarDatasets.push({
            label: bivarClasses[i],
            data: bivarScatter[i],
            pointRadius: point_radius,
            pointHoverRadius: 3,
            backgroundColor: bivar_colors[i],
            hoverBorderColor: "rgba(0,0,0,1)",
            pointHoverBorderWidth: 2,
            borderWidth: 1.5,
          });
        }
        //add the chart
        //get the target canvas element
        if (debug) {
          console.log("adding bivariate to canvas");
        }
        // let canvas = document.getElementById("bivariate_canvas");
        // eslint-disable-next-line no-unused-vars
        // globals.myBivariateScatterChart = new Chart(canvas, {
        //   type: "scatter",
        //   data: { datasets: bivarDatasets },
        //   options: bivar_option,
        // }); //to be obsoleted by updating an existing chart instance instead

        //testing updating chart //from https://www.chartjs.org/docs/2.9.4/developers/updates.html
        let chart = globals.myBivariateScatterChart; //get scatter chart instance
        //remove old data
        // chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
        });
        //add newly determined data for this createBivariate run
        // let label = "# of Votes";
        // chart.data.labels.push(label);
        chart.data.datasets = bivarDatasets;
        //update chart
        chart.update(0); //no-animation update
        //mutate options
        chart.options = bivar_option; //no-animation update
        //update chart
        chart.update(0);
        console.log("updating chart");
        //--end test updating
      } else {
        if (debug) {
          console.warn("no features returned for bivariate mode", features);
        }
        if (debug) {
          console.log("doing nothing");
        }
        return;
      }
    }
  }

  //taken from https://www.chartjs.org/docs/2.9.4/developers/updates.html
  //https://www.chartjs.org/samples/2.9.4/scales/toggle-scale-type.html
  toggleScaleType(chart, axes = ["X", "Y"], debug = true) {
    if (debug) {
      console.log("togglScaleType", chart, axes);
    }
    if (!axes.includes("X") && !axes.includes("Y")) {
      console.warn("toggleScaleType passed invalid axes; doing nothing");
      return;
    }
    let mapClassInstance = this;
    let bvls = globals.bivariateLayerState;
    let X_breaks = bvls.breaks.X;
    let Y_breaks = bvls.breaks.Y;
    //updating bivariate global state variables, to inform other functions like onBivariateClick
    let firstLayer = bvls.dataLayer[0];
    let secondLayer = bvls.dataLayer[1];
    let firstLabel = firstLayer.Unit;
    let secondLabel = secondLayer.Unit;

    let XType = null;
    let YType = null;
    if (axes.includes("X")) {
      // eslint-disable-next-line no-unused-vars
      XType =
        chart.options.scales.xAxes[0].type === "linear"
          ? "logarithmic"
          : "linear";
      document.getElementById("XType").innerText = XType; //update text showing scale type

      // let xAxis = { display: true, type: XType };
      let xAxis = {
        display: true,
        type: XType,
        scaleLabel: {
          display: true,
          //labelString: Vue._.find(allLayers, ["field_name", attrId_1])["title"], //adapted from oldcode, i presume was looking for the title/name of the dataset in order to label axes
          labelString: firstLabel, //firstLayer.Unit,
        },
        ticks: {
          min: X_breaks[0], //minimum tick
          max: X_breaks[3], //maximum tick
          //maxTicksLimit: 4,
          maxRotation: 45,
          minRotation: 45,

          callback: function (
            valueX
            //index,
            //values
          ) {
            if (valueX === 100000000) return "100M";
            if (valueX === 10000000) return "10M";
            if (valueX === 1000000) return "1M";
            if (valueX === 100000) return "100K";
            if (valueX === 10000) return "10K";
            if (valueX === 1000) return "1K";
            if (valueX === 100) return "100";
            if (valueX === 10) return "10";
            if (valueX === 1) return "1";
            if (valueX === 0.1) return "0.1";
            if (valueX > 10) return mapClassInstance.nFormatter(valueX, 1);
            else return mapClassInstance.nFormatter(valueX, 2);
          },
        },

        afterBuildTicks: function (chartObjX) {
          chartObjX.ticks = [];
          chartObjX.ticks.push(X_breaks[3]);
          chartObjX.ticks.push(X_breaks[2]);
          chartObjX.ticks.push(X_breaks[1]);
          chartObjX.ticks.push(X_breaks[0]);
        },
      };
      chart.options.scales.xAxes[0] = xAxis;
    }
    if (axes.includes("Y")) {
      // eslint-disable-next-line no-unused-vars
      YType =
        chart.options.scales.yAxes[0].type === "linear"
          ? "logarithmic"
          : "linear";
      document.getElementById("YType").innerText = YType; //update text showing scale type
      // let yAxis = { display: true, type: YType };
      let yAxis = {
        display: true,
        type: YType,
        scaleLabel: {
          display: true,
          //labelString: Vue._.find(allLayers, ["field_name", attrId_1])["title"], //adapted from oldcode, i presume was looking for the title/name of the dataset in order to label axes
          labelString: secondLabel, //secondLayer.Unit,
        },
        ticks: {
          min: Y_breaks[0], //minimum tick
          max: Y_breaks[3], //maximum tick
          //maxTicksLimit: 4,
          maxRotation: 45,
          minRotation: 45,

          callback: function (
            valueY
            //index,
            //values
          ) {
            if (valueY === 100000000) return "100M";
            if (valueY === 10000000) return "10M";
            if (valueY === 1000000) return "1M";
            if (valueY === 100000) return "100K";
            if (valueY === 10000) return "10K";
            if (valueY === 1000) return "1K";
            if (valueY === 100) return "100";
            if (valueY === 10) return "10";
            if (valueY === 1) return "1";
            if (valueY === 0.1) return "0.1";
            if (valueY > 10) return mapClassInstance.nFormatter(valueY, 1);
            else return mapClassInstance.nFormatter(valueY, 2);
          },
        },

        afterBuildTicks: function (chartObjY) {
          chartObjY.ticks = [];
          chartObjY.ticks.push(Y_breaks[3]);
          chartObjY.ticks.push(Y_breaks[2]);
          chartObjY.ticks.push(Y_breaks[1]);
          chartObjY.ticks.push(Y_breaks[0]);
        },
      };
      chart.options.scales.yAxes[0] = yAxis;
    }
    if (debug) {
      console.log("XType, YType:", XType, YType);
    }
    chart.update();
  }

  removeBivariateLayer(mapboxMapInstance = this.map, debug = false) {
    if (debug) {
      console.log("removeBivariateLayer(), removing bivariate layer");
    }
    let map = mapboxMapInstance;
    //adapted from oldcode createBivar() from bivariate.js
    if (map.getLayer("bivariate")) {
      map.removeLayer("bivariate");
      map.removeSource("bivariate");
    }
  }

  toggleMapboxGLCompare(debug = false) {
    //check for other mode eg. bivariate mode being active
    if (globals.bivariateMode) {
      console.warn("bivariateMode active, doing nothing");
      return;
    }
    if (debug) {
      console.log("globals.compareMode", globals.compareMode);
    }
    if (!globals.compareMode) {
      if (debug) {
        console.log("createComparison");
      }
      this.createComparison(this.containerId, this.map, this.map2);
      //hide histogram
      document
        .querySelector(".v-card.histogram_frame")
        .classList.add("display-none");
    } else {
      if (debug) {
        console.log("removeComparison");
      }
      this.removeComparison();
      //reshow histogram
      document
        .querySelector(".v-card.histogram_frame")
        .classList.remove("display-none");
    }
    globals.compareMode = !globals.compareMode;
  }
  createComparison(containerId, map1Instance, map2Instance) {
    document.getElementById("map2").classList.remove("display-none"); //enabling show the comparison map

    this.mapCompare = new mapboxgl.Compare(
      map1Instance,
      map2Instance,
      containerId,
      {
        // mousemove: true,
        // orientation: "vertical",
      }
    );
    map2Instance.setCenter(map1Instance.getCenter());
    map2Instance.setZoom(map1Instance.getZoom());

    //testing - adding .resize() to handle issue of map2 instance's size being shrunk to a minimum(?) due to window being resized/tiled(?) between uses of the comparison mode
    map2Instance.resize();
  }
  removeComparison() {
    this.mapCompare.remove(); //remove the  mapboxgl.Compare from the webpage
    document.getElementById("map2").classList.add("display-none"); //enabling show the comparison map //turn off displaying of the secondary map used for comparison
    //!? does it continue rendering and using system resources?
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
    let self = this;
    constants.unwantedMapboxLayers.forEach((name) =>
      self.map.removeLayer(name)
    );
  }
  _addPointSources() {
    console.log(`_addPointSources()`);
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
  _addVectorSources(comparison = false) {
    console.log(`_addVectorSources()`);
    let map = !comparison ? this.map : this.map2; //
    // let map = this.map; //patching map reference
    // console.log(`vector sources: ${Object.keys(globals.sources)}`);

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
        }
        // globals.firstSymbolId
      );
    }

    //finished loading in so hide spinner
    // hideSpinner();//TODO: REIMPLEMENT SPINNER

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  _bindMapDebugListeners(map = this.map1) {
    // Set an event listener that fires
    // when any map data begins loading
    // or changing asynchronously.
    map.on("dataloading", () => {
      console.log("A dataloading event occurred.");
    });
    // Set an event listener that fires
    // when map data loads or changes.
    map.on("data", () => {
      console.log("A data event occurred.");
    });
    // Set an event listener that fires
    // when the map's style loads or changes.
    map.on("styledata", () => {
      console.log("A styledata event occurred.");
    });
    // Set an event listener that fires
    // when the map's style begins loading or
    // changing asynchronously.
    map.on("styledataloading", () => {
      console.log("A styledataloading event occurred.");
    });
    // Set an event listener that fires
    // when the map's sources begin loading or
    // changing asynchronously.
    map.on("sourcedataloading", () => {
      console.log("A sourcedataloading event occurred.");
    });
    // Set an event listener that fires
    // when an icon or pattern is missing.
    map.on("styleimagemissing", () => {
      console.log("A styleimagemissing event occurred.");
    });
    // Set an event listener that fires
    // when the map has finished loading.
    map.on("load", () => {
      console.log("A load event occurred.");
    });
    // Set an event listener that fires
    // whenever the map is drawn to the screen.
    map.on("render", () => {
      console.log("A render event occurred.");
    });
    // Set an event listener that fires
    // just before the map enters an "idle" state.
    map.on("idle", () => {
      console.log("A idle event occurred.");
    });
    // Set an event listener that fires
    // when an error occurs.
    map.on("error", () => {
      console.log("A error event occurred.");
    });
    // Set an event listener that fires
    // when the WebGL context is lost.
    map.on("webglcontextlost", () => {
      console.log("A webglcontextlost event occurred.");
    });
    // Set an event listener that fires
    // when the WebGL context is restored.
    map.on("webglcontextrestored", () => {
      console.log("A webglcontextrestored event occurred.");
    });
  }
  _bindMapClickListeners(mapClassInstance) {
    let instance = mapClassInstance;
    //listeners for the query-clicks
    //ISSUE: BINDS TO MAPBOX MAP, WHICH IS CONTAINED INSIDE THIS CUSTOM MAP CLASS THEREFORE LISTENER CALLS FROM MAPBOXMAP AND NOT THIS CLASS
    //IDEA: PASS IN THIS CLASS WITH THE LISTENER AND CALL OUR CLASS METHODS FROM THAT INSTEAD
    this.map.on("click", "hex5", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance);
      mapClassInstance.onDataClick(e);
    });

    this.map.on("click", "hex10", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance);
      mapClassInstance.onDataClick(e);
    });

    this.map.on("click", "hex1", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance);
      mapClassInstance.onDataClick(e);
    });

    this.map.on(
      "click",
      "hex5clipped",
      function (e, mapClassInstance = instance) {
        mapClassInstance.clearOnClickQuery(mapClassInstance);
        mapClassInstance.onDataClick(e);
      }
    );

    this.map.on("click", "ocean", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance);
      mapClassInstance.onDataClick(e);
    });

    this.map.on("click", "admin1", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance);
      mapClassInstance.addAdminClick(e, "admin1");
    });

    this.map.on(
      "click",
      "admin2",
      function (e, mapClassInstance = instance, debug = false) {
        if (debug) {
          console.log("map.on.click.admin2");
        }

        //clear old selections presents
        mapClassInstance.clearOnClickQuery(mapClassInstance);

        // this.onDataClick(e);
        mapClassInstance.addAdminClick(e, "admin2");
      }
    );

    this.map.on(
      "click",
      "bivariate",
      function (e, mapClassInstance = instance) {
        mapClassInstance.clearOnClickQuery(mapClassInstance);
        mapClassInstance.onBivariateClick(e);
      }
    );

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

    //copied listeners for comparison map instance-----------------------------------------
    //TODO refactor this entire function
    this.map2.on("click", "hex5", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
      mapClassInstance.onDataClick(e, mapClassInstance.map2);
    });

    this.map2.on("click", "hex10", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
      mapClassInstance.onDataClick(e, mapClassInstance.map2);
    });

    this.map2.on("click", "hex1", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
      mapClassInstance.onDataClick(e, mapClassInstance.map2);
    });

    this.map2.on(
      "click",
      "hex5clipped",
      function (e, mapClassInstance = instance) {
        mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
        mapClassInstance.onDataClick(e, mapClassInstance.map2);
      }
    );

    this.map2.on("click", "ocean", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
      mapClassInstance.onDataClick(e, mapClassInstance.map2);
    });

    this.map2.on("click", "admin1", function (e, mapClassInstance = instance) {
      mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
      mapClassInstance.addAdminClick(e, "admin1", mapClassInstance.map2);
    });

    this.map2.on(
      "click",
      "admin2",
      function (e, mapClassInstance = instance, debug = false) {
        if (debug) {
          console.log("map.on.click.admin2");
        }

        //clear old selections presents
        mapClassInstance.clearOnClickQuery(mapClassInstance.map2);

        // this.onDataClick(e);
        mapClassInstance.addAdminClick(e, "admin2", mapClassInstance.map2);
      }
    );
    //--------------------------
  }
  _bindDataHoverListeners() {
    // let instance = mapClassInstance;
    // this.map.on(
    //   "hover",
    //   "bivariate",
    //   function (e, mapClassInstance = instance) {
    //     mapClassInstance.clearOnClickQuery(mapClassInstance);
    //     mapClassInstance.onBivariateClick(e);
    //   }
    // );
  }
  _bindRecolorListeners(mapClassInstance, debug = false) {
    // if (globals.compareMode) {
    //   console.warn("recolor disabled during comparison mode");
    //   return;
    // }

    let instance = mapClassInstance;
    if (debug) {
      console.log(instance);
    }
    //this. out here ref the mapClass instance calling this method
    //TODO: review and rewrite

    for (const eventType of ["zoomend", "dragend"]) {
      if (debug) {
        console.log(`binding RecolorListener: ${eventType}`);
      }
      this.map.on(eventType, function (e, mapClassInstance = instance) {
        //this. in here would ref the mapboxmap and not our mapClass which has the recolor method
        if (debug) {
          console.log(
            "_bindRecolorListeners",
            "event is:",
            e,
            "instance is:",
            instance
          );
        }

        if (!globals.bivariateMode) {
          mapClassInstance.recolorBasedOnWhatsOnPage();

          mapClassInstance.updateOverlayLegend("main");
          mapClassInstance.updateOverlayLegend("comparison");
        } else {
          console.log("bivariateMode enabled - skipping recolor");
          console.log("updating bivariate layer");
          let bvls = globals.bivariateLayerState; //get stored state
          mapClassInstance.createBivariate(
            null,
            bvls.dataLayer[0],
            null,
            bvls.dataLayer[1]
          );
        }
      });

      //add listener for the comparison map i.e map2
      this.map2.on(eventType, function (e, mapClassInstance = instance) {
        //this. in here would ref the mapboxmap and not our mapClass which has the recolor method
        if (debug) {
          console.log(
            "_bindRecolorListeners",
            "event is:",
            e,
            "instance is:",
            instance
          );
        }

        if (!globals.bivariateMode) {
          let recolorComparison = true;
          mapClassInstance.recolorBasedOnWhatsOnPage(recolorComparison);

          mapClassInstance.updateOverlayLegend("main");
          mapClassInstance.updateOverlayLegend("comparison");
        } else {
          console.log("bivariateMode enabled - skipping recolor");
        }
      });
    }
  }
  _initOnClickControl() {
    console.log("InitOnClickControl");
    const toggleControl = new ToggleControl();
    this.map.addControl(toggleControl, "bottom-right");
  }
  _initDrawInfoControl() {
    console.log("InitDrawInfoControl");
    const drawInfoControl = new DrawInfoControl();
    this.map.addControl(drawInfoControl, "bottom-right");
  }
  _addDrawListeners(mapClassInstance, debug = false) {
    //taken from oldcode implementation in drawFunc.js
    mapClassInstance.map.on("draw.create", drawCreate);
    mapClassInstance.map.on("draw.delete", drawDelete);
    mapClassInstance.map.on("draw.update", drawUpdate);
    mapClassInstance.map.on("draw.modechange", drawModeChange);

    function drawUpdate() {
      if (debug) {
        console.log("drawUpdate");
      }
    }
    function drawModeChange(e) {
      if (debug) {
        console.log("drawModeChange to", e.mode);
      }
      document
        .getElementsByClassName("close-menu")[0]
        .classList.add("display-none");

      if (e.mode === "simple_select") {
        if (debug) {
          console.log("deletAll features before:", e.mode);
        }
        mapClassInstance.Draw.deleteAll();
      }
    }

    function drawDelete() {
      if (debug) {
        console.log("drawDelete");
      }

      mapClassInstance.map.setFilter(globals.currentLayerState.hexSize, null); //map.setFilter(currentGeojsonLayers.hexSize, null);

      // let drawInfoDiv = document.getElementById("draw-info-control");
      let drawInfoDiv = document.getElementsByClassName("draw-info-box")[0];
      drawInfoDiv.innerHTML = ""; //clear the drawInfoDiv of old content
      drawInfoDiv.style.display = "none";

      mapClassInstance.Draw.deleteAll(); //delete all drawn features ie. polygons
    }

    function drawCreate(e) {
      if (debug) {
        console.log("drawCreate");
      }
      //e.preventDefault()
      //e.stopPropogation()
      if (debug) {
        console.log(
          "Drawn Feature Count: ",
          mapClassInstance.Draw.getAll().features.length
        );
      }

      //clear any previous draw filter
      mapClassInstance.map.setFilter(globals.currentLayerState.hexSize, null);

      let createdPolygon = e.features[0];
      let boundBox = bbox(createdPolygon);

      let SW = [boundBox[0], boundBox[1]];
      let NE = [boundBox[2], boundBox[3]];

      let NEPointPixel = mapClassInstance.map.project(NE);
      let SWPointPixel = mapClassInstance.map.project(SW);

      //use mapbox function to first cull features to those within the boundBox of the drawn polygon
      let features = mapClassInstance.map.queryRenderedFeatures(
        [SWPointPixel, NEPointPixel],
        {
          layers: [globals.currentLayerState.hexSize],
        }
      );
      if (debug) {
        console.log("queryRenderedFeatures: ", features);
      }

      if (features.length > 0) {
        //use Turf.js function to actually check for intersecting features
        var filter = features.reduce(
          function (memo, feature) {
            //if(! (undefined === turf.intersect(feature, createdPolygon))) {
            if (booleanIntersects(feature, createdPolygon)) {
              memo.push(feature.properties.hexid);
            }

            return memo;
          },
          ["in", "hexid"] //callback function using reduce - checks if the boundBox rendered features are "in" the array of "hexid"s
        );

        //console.log(filter)

        mapClassInstance.map.setFilter(
          globals.currentLayerState.hexSize,
          filter
        ); //sets a rendering filter, formatted based on mapbox filter spec

        mapClassInstance.map.once("idle", function () //e
        {
          let info = [];
          let onscreenFeatures = mapClassInstance.map.queryRenderedFeatures({
            layers: [globals.currentLayerState.hexSize],
          });

          //toggle on display area for the info
          // let drawInfoDiv = document.getElementById("draw-info-control");
          let drawInfoDiv = document.getElementsByClassName("draw-info-box")[0];
          drawInfoDiv.innerHTML = ""; //clear the drawInfoDiv of old content
          // drawInfoDiv.style.display = "block";
          drawInfoDiv.classList.remove("display-none");
          drawInfoDiv.style.height = "auto"; // drawInfoDiv.style.height = "100px";
          drawInfoDiv.style.width = "200px";

          onscreenFeatures.forEach(function (x) {
            info.push(x.properties[globals.currentLayerState.dataLayer]);
          });

          let max = Math.max(...info);
          let min = Math.min(...info);
          let total = 0;
          for (let i = 0; i < info.length; i++) {
            total += info[i];
          }
          let mean = total / info.length;

          //creating the info elements to be appended as children in the control
          let Units = document.getElementById("legendTitle").textContent;
          let titleText = document.createElement("div");
          titleText.append(`Regional Statistics:`);
          let meanText = document.createElement("div");
          meanText.append(
            `Mean: ${mapClassInstance.nFormatter(mean, 2)} ${Units}`
          );
          let maxText = document.createElement("div");
          maxText.append(`Max: ${max} ${Units}`);
          let minText = document.createElement("div");
          minText.append(`Min: ${min} ${Units}`);

          drawInfoDiv.append(titleText);
          drawInfoDiv.append(meanText);
          drawInfoDiv.append(maxText);
          drawInfoDiv.append(minText);
        });
      } else {
        alert(
          `features.length not > 0; features.length = ${features.length}; doing nothing`
        );
      }
    }
  }

  //B) exposing mapboxgl map methods via this class as interface---------------------------------------------
  on(type, layerIds, listenerFunction) {
    this.map.on(type, layerIds, listenerFunction);
  }
  addLayer(input) {
    return !this.map.getLayer(input) //this.map.addLayer(input)
      ? this.map.addLayer(input)
      : console.warn(`addLayer(${input}) layer not found`);
  }
  removeLayer(input) {
    // this.map.removeLayer(input);
    return this.map.getLayer(input)
      ? this.map.removeLayer(input)
      : console.warn(`removeLayer(${input}) layer not found`);
  }
  getLayer(input) {
    // this.map.getLayer(input);
    return this.map.getLayer(input)
      ? this.map.getLayer(input)
      : console.warn(`getLayer(${input}) layer not found`);
  }
  getSource(input) {
    // return this.map.getSource(id);
    return this.map.getSource(input)
      ? this.map.getSource(input)
      : console.warn(`getSource(${input}) Source not found`);
  }
  removeSource(input) {
    // this.map.removeSource(input);
    return this.map.getSource(input)
      ? this.map.removeSource(input)
      : console.warn(`removeSource(${input}) Source not found`);
  }

  makePopUp(options) {
    return new mapboxgl.Popup(options);
  }

  //C) Main functions - core logic that implements the major functionality of the map--------------------------------------
  //TODO: MOVE UP INTO GEOSPATIALDATA.VUE AND/OR IMPORT THESE FUNCTIONS AS A SEPARATELY WRITTEN MODULE

  zoomToCountry(country, debug = false) {
    let self = this; //the mapclassinstance
    var v2 = new mapboxgl.LngLatBounds(country.bb);
    this.map.fitBounds(v2, {
      linear: true,
      padding: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      pitch: 0,
    });

    this.remove3d();

    //contextual recolor hexes
    this.map.once("idle", function () {
      if (debug) {
        console.log("map idle; recoloring non-ocean data");
      }
      if (!self.map.getLayer("ocean")) {
        setTimeout(() => {
          self.recolorBasedOnWhatsOnPage(self.map), 1000;
        }); //timeout added to allow data to load in before triggering recolor+legend update
      }
    });
    this.map2.once("idle", function () {
      if (debug) {
        console.log("map idle; recoloring non-ocean data");
      }
      if (!self.map2.getLayer("ocean")) {
        setTimeout(() => {
          self.recolorBasedOnWhatsOnPage(self.map2), 1000;
        }); //timeout added to allow data to load in before triggering recolor+legend update
      }
    });
  }
  setMapBounds(bbox, debug = false) {
    let buffer = 1.5; //degrees to expand the bounding box on all sides //should allow enough buffer room to cover the EEZ of 200naut.miles/~370km/~3deg@110km each
    let expandedBBox = [
      [bbox[0][0] - buffer, bbox[0][1] - buffer], //west, south
      [bbox[1][0] + buffer, bbox[1][1] + buffer], //east, north
    ];
    if (debug) {
      console.log("setMapBounds", expandedBBox);
    }
    this.map.setMaxBounds(expandedBBox);
    this.map2.setMaxBounds(expandedBBox);
  }
  //manages the change when you chang the resolution
  changeHexagonSize(resolutionObject, debug = true) {
    let map = this.map;
    let map2 = this.map2;
    let resolution = resolutionObject.resolution;

    /* if (
        resolution
        // resolution === "hex1"
      ) {
        this.clearHexHighlight();
      } */
    this.clearHexHighlight();

    if (map.getLayer("ocean")) {
      let ele_display = document.querySelector(".hexsize")[0].style.display;

      if (ele_display === "none") {
        ele_display = "block";
      } else if (ele_display === "block") {
        ele_display = "none";
      } else alert("ocean has unexpected display type!! cannot toggle display");

      map.removeLayer("ocean");
    }

    this.remove3d();
    //update resolution state
    globals.currentLayerState.hexSize = resolution;
    globals.comparisonLayerState.hexSize = resolution;

    //clear maplayers that are usercontrolled
    for (var x in constants.userLayers) {
      if (map.getLayer(constants.userLayers[x])) {
        map.removeLayer(constants.userLayers[x]);
      }
      if (globals.compareMode) {
        if (map2.getLayer(constants.userLayers[x])) {
          map2.removeLayer(constants.userLayers[x]);
        }
      }
    }

    //get source name
    let currentSourceData = Vue._.find(globals.sourceData, function (o) {
      if (o.name == globals.currentLayerState.hexSize) {
        if (debug) {
          console.log(`matching sourceData name: ${o.name}`);
        }
      }
      //find the name of sourceData which matches current hexSize
      return o.name === globals.currentLayerState.hexSize;
    });
    if (debug) {
      console.log("globals.currentLayerState : ");
      console.log(globals.currentLayerState);
      console.log("currentSourceData from in sourceData: ");
      console.log(currentSourceData);
    }

    let options = {
      id: resolution,
      type: "fill",
      source: resolution,
      "source-layer": currentSourceData.layer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0, //globals.opacity, // 0
      },
    };
    map.addLayer(options, globals.firstSymbolId);
    if (globals.compareMode) {
      map2.addLayer(options, globals.firstSymbolId);
    }

    /* if (resolution === "hex1") {
        //showing loader in expectation of hex1 taking longer to display
        // $(".loader-gis").show();
        console.log("handling spinner for hex1 loading");
        this.showSpinner();

        map.once("idle", () => {
          // $(".loader-gis").hide();
          this.hideSpinner();
        });
      } */

    if (map.getStyle().name === "Mapbox Satellite") {
      if (debug) {
        console.log(
          `map style is Mapbox Satellite; moveLayer to ${resolution}`
        );
      }
      map.moveLayer(resolution);
      if (globals.compareMode) {
        map2.moveLayer(resolution);
      }
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
      if (debug) {
        console.log("map idle-> recoloring");
      }
      this.recolorBasedOnWhatsOnPage(map); //as it's inside an arrow function this. should refer to the outer scope and should be able to find the function

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map.moveLayer(resolution, "allsids");

      this.hideSpinner();
    });
    map2.once("idle", () => {
      if (debug) {
        console.log("map2 idle-> recoloring");
      }
      this.recolorBasedOnWhatsOnPage(map2); //as it's inside an arrow function this. should refer to the outer scope and should be able to find the function

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map2.moveLayer(resolution, "allsids");

      // this.hideSpinner();
    });
  }
  changeBasemap(selectionObject, debug = false) {
    let self = this;
    let map = this.map;
    let map2 = this.map2;
    if (debug) {
      console.log("selectionObject: ");
      console.log(selectionObject);
    }
    let basemapName = selectionObject.name;
    let basemapIcon = selectionObject.icon;
    if (debug) {
      console.log(`changeBasemap( ${basemapName} ); icon: ${basemapIcon}`);
    }

    ////adapting from old basemapSwitch.js
    //get the basemap names
    let currentBasemap = map.getStyle().name;
    let selectedBasemap = selectionObject.name;
    if (debug) {
      console.log(`${currentBasemap} -> ${selectedBasemap}`);
    }

    //get the uri from the store of styles uri's, and set it
    let thisStyle = Vue._.find(constants.styles, function (style) {
      return style.name === selectedBasemap;
    });
    if (!thisStyle) {
      alert("thisStyle from Basemap not exist");
      return;
    } else {
      if (debug) {
        console.log(`setting style: ${thisStyle.name}`);
      }
      map.setStyle(thisStyle.uri);
      map2.setStyle(thisStyle.uri);
    }

    for (const i of constants.unwantedMapboxLayers) {
      if (map.getLayer(i)) {
        map.removeLayer(i);
        map2.removeLayer(i);
      }
    }

    //when done, update: firstSymbolId, basemapLabels
    map.once("idle", function () {
      self.getBasemapLabels();

      //unnecessary: why should the layers be removed if the basemap is switching??
      self._addVectorSources();
      let currentSource = Vue._.find(globals.sourceData, function (o) {
        return o.name === globals.currentLayerState.hexSize;
      });
      //re-add the current layer, with appropriate filtering
      let cls = globals.currentLayerState;
      try {
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
              "fill-opacity": globals.opacity, //0.8
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

        let filterString = cls.dataLayer === "depth" ? "<=" : ">=";
        map.setFilter(cls.hexSize, [filterString, cls.dataLayer, 0]);

        map.moveLayer("allsids", globals.firstSymbolId); //ensure allsids outline ontop
      } catch (err) {
        if (debug) {
          console.warn("attempted while no data layer is loaded on main map");
          console.warn(err.stack);
        }
        //placed to catch error when attempted while no data layer is loaded on main map
      }
      self.hideSpinner();
    });
  }
  changeOpacity(opacityObject, debug = false) {
    let map = this.map;
    let sliderValue = opacityObject.opacity;
    map.setPaintProperty(
      globals.currentLayerState.hexSize,
      "fill-opacity",
      sliderValue * 0.02
    );
    if (map.getLayer("ocean")) {
      // console.log(`adjusting "ocean" layer opacity`);
      map.setPaintProperty("ocean", "fill-opacity", sliderValue * 0.02);
    }

    //doing same for comparison mode's data when enabled
    if (globals.compareMode) {
      this.map2.setPaintProperty(
        globals.comparisonLayerState.hexSize,
        "fill-opacity",
        sliderValue * 0.02
      );
      if (this.map2.getLayer("ocean")) {
        // console.log(`adjusting "ocean" layer opacity`);
        this.map2.setPaintProperty("ocean", "fill-opacity", sliderValue * 0.02);
      }
    }
    //update global opacity value
    globals.opacity = (parseInt(sliderValue) * 2) / 100;
    if (debug) {
      console.log(`globals.opacity`, globals.opacity);
    }
  }
  changeColor(colorObject, debug = false) {
    let map = this.map;
    let selectedColor = colorObject.color;
    let currentColor = globals.currentLayerState.color;

    if (selectedColor === "original") {
      if (globals.currentLayerState.dataLayer === "depth") {
        globals.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
      } else if (globals.currentLayerState.dataLayer.substring(0, 2) === "1a") {
        globals.currentLayerState.color = colors.colorDiv.gdpColor;
      } else if (globals.currentLayerState.dataLayer.substring(0, 2) === "1c") {
        globals.currentLayerState.color = colors.colorSeq["pop"];
      } else if (globals.currentLayerState.dataLayer === "7d10") {
        globals.currentLayerState.color = colors.colorSeq["combo"];
      } else if (globals.currentLayerState.dataLayer === "7d5") {
        globals.currentLayerState.color = colors.colorSeq["minty"];
      } else if (globals.currentLayerState.dataLayer === "7d7") {
        globals.currentLayerState.color = colors.colorSeq["blues"];
      } else if (globals.currentLayerState.dataLayer === "7d4") {
        globals.currentLayerState.color = colors.colorSeq["pinkish"];
      } else if (globals.currentLayerState.dataLayer === "7d8") {
        globals.currentLayerState.color = colors.colorSeq["silvers"];
      } else if (globals.currentLayerState.dataLayer === "d") {
        //breaks = [-4841, -3805, -2608, -1090, 1322];
        globals.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
      } else {
        globals.currentLayerState.color = colors.colorSeq["yellow-blue"];
      }
    }

    if (selectedColor === "invert") {
      // var reverse = currentColor.reverse();
      let reverse = [...currentColor].reverse();
      globals.currentLayerState.color = reverse;
    } else if (selectedColor === "red") {
      globals.currentLayerState.color = colors.colorSeq["pinkish"];
    } else if (selectedColor === "purple") {
      globals.currentLayerState.color = colors.colorSeq["purple"];
    } else if (selectedColor === "blue") {
      globals.currentLayerState.color = colors.colorSeq["blues"];
    } else if (selectedColor === "colorblind-safe") {
      globals.currentLayerState.color = colors.colorSeq["colorBlindGreen"];
    }

    if (debug) {
      console.log(globals.currentLayerState.breaks);
    }

    map.setPaintProperty(globals.currentLayerState.hexSize, "fill-color", [
      "interpolate",
      ["linear"],
      ["get", globals.currentLayerState.dataLayer],
      globals.currentLayerState.breaks[0],
      globals.currentLayerState.color[0],
      globals.currentLayerState.breaks[1],
      globals.currentLayerState.color[1],
      globals.currentLayerState.breaks[2],
      globals.currentLayerState.color[2],
      globals.currentLayerState.breaks[3],
      globals.currentLayerState.color[3],
      globals.currentLayerState.breaks[4],
      globals.currentLayerState.color[4],
    ]);

    var allColorz = document.getElementsByClassName("population-per-km-img"); //get the hexagons shown in the legend/histogram
    for (var x in allColorz) {
      if (typeof allColorz[x] === "object") {
        allColorz[x].style.backgroundColor = globals.currentLayerState.color[x];
      }
    }

    var features = map.queryRenderedFeatures({
      layers: [globals.currentLayerState.hexSize],
    });

    var selectedData = features.map(
      (x) => x.properties[globals.currentLayerState.dataLayer]
    );

    let colorRampNew = this.computeBreaksAndColorRamp(
      selectedData
      // colors, //use default global current
      // breakMode, // use default equidistant
      // nGroup, //use default 200
      // breaks //use default global current
    ).colorRamp;

    //update the chart with new color ramp
    globals.myHistogram.data.datasets[0].backgroundColor = colorRampNew;
    globals.myHistogram.update();

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  add3D(debug = false) {
    let map = this.map;

    this.clearHexHighlight();

    let id = globals.currentLayerState.hexSize + "-3d";
    //preemptive check for if 3D layer exists already before adding fill-extrusion layer
    if (map.getLayer(id)) {
      map
        .easeTo({
          center: map.getCenter(),
          pitch: 0,
        })
        .removeLayer(id);
    }

    //add fill-extrusion layer
    else {
      let current = Vue._.find(globals.sourceData, function (o) {
        return o.name === globals.currentLayerState.hexSize;
      });

      try {
        map.addLayer(
          {
            id: id,
            type: "fill-extrusion",
            source: globals.currentLayerState.hexSize,
            "source-layer": current.layer,
            layout: {
              visibility: "visible",
            },

            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", globals.currentLayerState.dataLayer],
                globals.currentLayerState.breaks[0],
                globals.currentLayerState.color[0],
                globals.currentLayerState.breaks[1],
                globals.currentLayerState.color[1],
                globals.currentLayerState.breaks[2],
                globals.currentLayerState.color[2],
                globals.currentLayerState.breaks[3],
                globals.currentLayerState.color[3],
                globals.currentLayerState.breaks[4],
                globals.currentLayerState.color[4],
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["get", globals.currentLayerState.dataLayer],
                globals.currentLayerState.breaks[0],
                0,
                globals.currentLayerState.breaks[1],
                500,
                globals.currentLayerState.breaks[2],
                5000,
                globals.currentLayerState.breaks[3],
                11000,
                globals.currentLayerState.breaks[4],
                50000,
              ],

              "fill-extrusion-base": !(
                globals.currentLayerState.dataLayer === "depth"
              )
                ? 0
                : 0,
              "fill-extrusion-opacity": 1,
            },
          },
          globals.firstSymbolId
        );

        let filterString =
          globals.currentLayerState.dataLayer === "depth" ? "<" : ">=";

        map.setFilter(id, [
          filterString, // ">="
          globals.currentLayerState.dataLayer,
          0,
        ]);
      } catch (err) {
        if (debug) {
          console.warn("attempted while no data layer loaded on map");
          console.warn(err.stack);
        }
      }
      map.easeTo({
        center: map.getCenter(),
        pitch: 55,
      });
    }

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  remove3d(debug = false) {
    let map = this.map;
    this.clearHexHighlight();
    //taken directly from old code
    if (debug) {
      console.log("removing 3d");
    }

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

    //animate the button back to 2D icon; taken from handleHeightChange
    let threeDIcon = document.getElementsByClassName("threeD" + "-icon")[0];
    let twoDIcon = document.getElementsByClassName("twoD" + "-icon")[0];

    if (
      !twoDIcon.classList.contains("display-none") &&
      threeDIcon.classList.contains("display-none")
    ) {
      if (debug) {
        console.log("3D icon visible; flip animate to 2D");
      }

      //animation triggering of the button
      twoDIcon.classList.add("flip1");
      setTimeout(() => {
        threeDIcon.classList.remove("display-none");
        threeDIcon.classList.add("flip2");
        twoDIcon.classList.add("display-none");
        twoDIcon.classList.remove("flip1");
      }, 140);
      setTimeout(() => {
        threeDIcon.classList.remove("flip2");
      }, 280);
    } else {
      if (debug) {
        console.log(`2D icon visible; no flip animate`);
      }
    }
  }
  toggleLabels(labelObject, debug = false) {
    let map = this.map;

    //adapted from oldcode
    // var sel = Object.values(object)[0];
    let label = labelObject.label;
    if (debug) {
      console.log(globals.basemapLabels);
    }

    if (label == true) {
      globals.basemapLabels.forEach(function (x) {
        //console.log(x);
        map.addLayer(x);
        if (x.type === "line") {
          if (map.getLayer(globals.currentLayerState.hexSize)) {
            map.moveLayer(x.id, globals.currentLayerState.hexSize);
          }
        }
      });
    } else {
      globals.basemapLabels.forEach(function (x) {
        map.removeLayer(x.id);
      });
    }

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  addOcean(activeDataset, activeLayer, comparison = false, debug = false) {
    let map = !comparison ? this.map : this.map2; //
    let cls = !comparison
      ? globals.currentLayerState
      : globals.comparisonLayerState;
    this.clearHexHighlight();
    this.remove3d();

    if (debug) {
      console.log("activeDataset: " + activeDataset.name);
      console.log("activeLayer: " + activeLayer.Description);
    }
    if (!(activeDataset.name === "Ocean Data")) {
      alert("addOcean called with non-Ocean Data activeDataset!!!");
    }

    //update state
    cls.dataLayer = activeLayer.Field_Name; //corresponds to the attributeId
    cls.hexSize = "ocean";
    //ocean-specific layer state values hardcoded
    //ocean data uses pre-decided breaks and color;
    cls.breaks = [-4841, -3805, -2608, -1090, 0];
    // cls.color = [
    //   "#08519c",
    //   "#3182bd",
    //   "#6baed6",
    //   "#bdd7e7",
    //   "#eff3ff",
    // ];
    cls.color = colors.colorNatural["ocean-depth"];

    //clear out all userLayers
    if (debug) {
      console.log(`removing all userLayers`);
    }
    for (var layer in constants.userLayers) {
      if (map.getLayer(constants.userLayers[layer])) {
        map.removeLayer(constants.userLayers[layer]);
      }
      // if (this.map2.getLayer(constants.userLayers[layer])) {
      //   this.map2.removeLayer(constants.userLayers[layer]);
      // }
    }

    let layerOptions = {
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
        "fill-opacity": globals.opacity, //0.8,
      },
    };
    //add the layer
    map.addLayer(layerOptions, globals.firstSymbolId);

    //NEW - adding Source and Layer for new format of data-----------------------------
    // this.map2.addSource(
    //   "ocean",
    //   this.createSourceObj(activeLayer.Field_Name, "ocean")
    // );
    // this.map2.addLayer(layerOptions, globals.firstSymbolId);
    //---------------------------------------------------------------------------------

    if (!comparison) {
      setTimeout(() => {
        var features = map.queryRenderedFeatures({
          layers: ["ocean"],
        });

        if (features) {
          var uniFeatures;
          uniFeatures = this.getUniqueFeatures(features, "depth"); //depth is field_id for ocean depths layer
          var selectedData = uniFeatures.map((x) => x.properties["depth"]);
          this.addLegend(cls.color, cls.breaks, 2, activeLayer, selectedData);
        }
      }, 600);

      // this.addLegend(); //TODO doesnt this need the extra params that I added to the addLegend function?
    }

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  changeDataOnMap(
    activeDataset,
    activeLayer,
    comparison = false,
    debug = false
  ) {
    let map = !comparison ? this.map : this.map2; //
    let cls = !comparison
      ? globals.currentLayerState
      : globals.comparisonLayerState;
    // let map = this.map;
    let Field_Name = activeLayer.Field_Name; //get the selected layer's Field_Name
    if (debug) {
      console.log(`changeDataOnMap fired: ${Field_Name}, activeLayer:`);
    }

    this.clearHexHighlight();

    if (globals.bivariateMode) {
      console.log("bivariateMode enabled, cancelling changeDataOnMap");
      setTimeout(() => {
        this.hideSpinner();
      }, 100);
      return;
    }
    //TAKEN FROM OLDCODE changeDataOnMap

    //------------------------------------------------------
    if (map.getLayer("ocean")) {
      if (debug) {
        console.log("ocean layer exists...");
      }

      if (!Field_Name.includes("fl")) {
        //
        //if fl inside of the Field_Name (i.e. it's a fishing/ocean related layer)
        if (debug) {
          console.log(
            `activeLayer ${activeLayer.Field_Name} is not fishing/ocean related; removing ocean layer and adding hex5 layer`
          );
        }
        map.removeLayer("ocean");

        cls.hexSize = "hex5"; //default to hex5 since leaving ocean data (which is a fixed 10km hexsize)

        map.addLayer(
          {
            id: "hex5",
            type: "fill",
            source: "hex5",
            "source-layer": "hex5",
            layout: {
              visibility: "visible",
            },
            paint: {
              "fill-color": "blue",
              "fill-opacity": 0.0, //globals.opacity, //
            },
          },
          globals.firstSymbolId
        );
      }
    } else if (
      activeLayer.Name === "Ocean Data" &&
      !(activeLayer.Field_Name === "depths")
    ) {
      //adding hexSize: 'ocean' to allow non-depth Ocean Data
      if (debug) {
        console.log(
          `ocean data (non-depth) added; creating empty 'ocean' id layer;`
        );
      }
      cls.hexSize = "ocean"; //set to ocean

      //clear out all userLayers
      if (debug) {
        console.log(`removing all userLayers`);
      }
      for (var layer in constants.userLayers) {
        if (map.getLayer(constants.userLayers[layer])) {
          map.removeLayer(constants.userLayers[layer]);
        }
      }

      map.addLayer(
        {
          id: "ocean",
          type: "fill",
          source: "ocean",
          "source-layer": "oceans",
          layout: {
            visibility: "visible",
          },
          paint: {
            "fill-color": "blue",
            "fill-opacity": 0.0, //globals.opacity, //
          },
        },
        globals.firstSymbolId
      );
    } else {
      if (debug) {
        console.log("map has no 'ocean' layer");
      }
    }
    //-------------------------------------------------------------

    this.remove3d();

    if (debug) {
      console.log(
        `changeDataOnMap(Field_Name: ${Field_Name}, 
        activeDataset?.name: ${activeDataset?.name}, 
        activeLayer?.Description: ${activeLayer?.Description}`
      );
    }

    cls.dataLayer = Field_Name; //update global to reflect selected datalayer

    //-------------------------------------------
    if (!map.getSource("hex5")) {
      //console.log('no source')
      if (debug) {
        console.log("no hex5 source; re-adding all vector sources");
      }
      this._addVectorSources(comparison);
    } else {
      //console.log('source!')
    }
    //------------------------------------------

    //unsure the need for this, pay attention if obsolete
    if (debug) {
      console.log("current hexSize: " + cls.hexSize);
    }
    if (!map.getLayer(cls.hexSize)) {
      if (debug) {
        console.log(`MAP LACKING LAYER for ${cls.hexSize}; adding layer;`);
      }
      var currentSourceData = Vue._.find(globals.sourceData, function (source) {
        //get matching sourceData
        return source.name === cls.hexSize;
      });

      if (debug) {
        console.log(
          `addLayer using ${cls.hexSize} ${cls.hexSize} ${currentSourceData.layer}`
        );
      }
      map.addLayer({
        id: cls.hexSize,
        type: "fill",
        source: cls.hexSize,
        "source-layer": currentSourceData.layer,
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.0, //globals.opacity, //
        },
      });

      if (globals.firstSymbolId) {
        //put the added layer behind mapbox symbology layers
        map.moveLayer(cls.hexSize, globals.firstSymbolId);
      }
    }

    setTimeout(() => {
      // console.log(`queryRenderedFeatures on layers: ${cls.hexSize} `);
      var features = map.queryRenderedFeatures({
        layers: [cls.hexSize],
      });
      // console.warn(`changeDataOnMap unfiltered features:`, features);

      if (features) {
        var uniFeatures;
        if (cls.hexSize === "admin1") {
          uniFeatures = this.getUniqueFeatures(features, "GID_1");
        } else if (cls.hexSize === "admin2") {
          uniFeatures = this.getUniqueFeatures(features, "GID_2");
        } else {
          uniFeatures = this.getUniqueFeatures(features, "hexid");
        }
        // console.warn("changeDataOnMap uniqueFeatures", uniFeatures);

        //console.log(uniFeatures);
        var selectedData = uniFeatures.map((x) => x.properties[Field_Name]);
        console.warn("changeDataOnMap selectedData", selectedData);

        var breaks = chroma.limits(selectedData, "q", 4);
        // console.log("breaks:", breaks);
        var breaks_new = [];
        globals.precision = 1;
        do {
          globals.precision++;
          for (let i = 0; i < 5; i++) {
            breaks_new[i] = parseFloat(
              breaks[i].toPrecision(globals.precision)
            );
          }
          // console.log("breaks_new:", breaks_new);
        } while (this.checkForDuplicates(breaks_new) && globals.precision < 10);
        breaks = breaks_new;
        // console.log("new breaks:", breaks);

        // console.log("globals.currentLayerState.color:");
        // console.log(globals.currentLayerState.color);
        /* if (!globals.currentLayerState.color) {
          //triggering if the color palette stored has been reset to null (intended to be triggered by change in active dataset)
          console.log(
            `currentLayerState.color: ${globals.currentLayerState.color}; determining default palette`
          );
        } */

        var colorRamp = colors.colorSeq["yellow-blue"];
        console.log(colorRamp);

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

        cls.breaks = breaks;
        cls.color = colorRamp;

        map.setPaintProperty(cls.hexSize, "fill-color", [
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
          console.log(`breaks are NaN, ${cls.hexSize} set to transparent`);
          map.setPaintProperty(
            cls.hexSize,
            "fill-opacity",
            0.0
            //globals.opacity
          );
          setTimeout(() => {
            map.setFilter(cls.hexSize, null);
          }, 100);
          if (!comparison) {
            this.addNoDataLegend();
          }
        } else {
          map.setFilter(cls.hexSize, [">=", Field_Name, 0]);
          console.log(
            `addLegend called in with intended Field_Name: ${Field_Name}`
          );

          if (!comparison) {
            this.addLegend(
              colorRamp,
              breaks,
              globals.precision, //
              activeLayer,
              selectedData
            );
          } else {
            console.log("skipping legend update;");
          }

          this.updateOverlayLegend("main");
          this.updateOverlayLegend("comparison");

          setTimeout(() => {
            map.setPaintProperty(
              cls.hexSize,
              "fill-opacity",
              globals.opacity // 0.8
            );
          }, 100);
        }
      }
    }, 1000);

    map.moveLayer("allsids", globals.firstSymbolId);
    //END------------------------------------------

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  recolorBasedOnWhatsOnPage(recolorComparison = false, debug = true) {
    if (debug) {
      console.log(
        `recolorBasedOnWhatsOnPage(recolorComparison = ${recolorComparison})`
      );
    }
    ////get the mapbox map instance
    let map = !recolorComparison ? this.map : this.map2; //this.map;
    let cls = !recolorComparison
      ? globals.currentLayerState
      : globals.comparisonLayerState;
    // console.log("map", map, "currentLayerState", cls);
    if (!map.getLayer(cls.hexSize)) {
      //check for existence of the layer before attempting to update it
      if (debug) {
        console.warn("!!!map does not have the current layer:", cls.hexSize);
      }
      return;
    }

    ////get the features rendered on map
    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });

    //if not a comparison's update, cull duplicate features that might exist due to the nature of vector tiles
    if (!features) {
      if (debug) {
        console.log(`no data features on map;`);
      }
      if (!recolorComparison) {
        this.addNoDataLegend();
      } else {
        // console.log("recolorComparison:", recolorComparison);
      }
    } else {
      var uniFeatures;
      if (cls.hexSize === "admin1") {
        uniFeatures = this.getUniqueFeatures(features, "GID_1");
      } else if (cls.hexSize === "admin2") {
        uniFeatures = this.getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = this.getUniqueFeatures(features, "hexid");
      }

      var selectedData = uniFeatures.map((x) => x.properties[cls.dataLayer]);

      // console.log(selectedData);
      //-----------------------------------------???
      var breaks = chroma.limits(selectedData, "q", 4);
      // console.log("breaks in recolor:", breaks);
      var breaks_new = [];
      globals.precision = 1;
      do {
        globals.precision++;
        for (let i = 0; i < 5; i++) {
          breaks_new[i] = parseFloat(breaks[i].toPrecision(globals.precision));
        }
        if (debug) {
          console.log("breaks_new:", breaks_new);
        }
      } while (this.checkForDuplicates(breaks_new) && globals.precision < 10);
      breaks = breaks_new;
      // console.log("new breaks:", breaks);

      cls.breaks = breaks; //update global state
      //-----------------------------------------

      //update layer paint options with the new breaks
      map.setPaintProperty(cls.hexSize, "fill-color", [
        "interpolate",
        ["linear"],
        ["get", cls.dataLayer],
        breaks[0],
        cls.color[0],
        breaks[1],
        cls.color[1],
        breaks[2],
        cls.color[2],
        breaks[3],
        cls.color[3],
        breaks[4],
        cls.color[4],
      ]);

      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)

      //addLegend(globals.currentLayerState.color, breaks, globals.currentLayerState.dataLayer)

      //detecting cases where computed breaks are bad/unacceptable (perhaps from insufficient data features) => output a legend for the no/insufficient data situation
      if (isNaN(breaks[3]) || breaks[1] == 0) {
        map.setPaintProperty(
          cls.hexSize,
          "fill-opacity",
          0.0 //globals.opacity
        );
        setTimeout(() => {
          map.setFilter(cls.hexSize, null);
        }, 1000);
        if (!recolorComparison) {
          if (debug) {
            console.log("recoloring calliing addNoDataLegend()");
          }
          this.addNoDataLegend();
        }
      } else {
        let filterCondition = cls.dataLayer === "depth" ? "<" : ">=";
        // console.log(
        //   `currentLayerState.dataLayer:  ${cls.dataLayer}; filterCondition ${filterCondition}`
        // );
        map.setFilter(cls.hexSize, [
          //">=",
          filterCondition,
          cls.dataLayer,
          0,
        ]);

        if (debug) {
          console.log(
            `recoloring calling addLegend with: 
          currentLayerState.color: ${cls.color} 
          breaks: ${breaks} 
          currentLayerState.dataLayer: ${cls.dataLayer}
          `
          );
        }

        // console.log(`recolor addLegend`);
        this.addLegend(
          undefined,
          breaks,
          undefined, //should be undefined here but default value in addLegend should handle it
          undefined, //should be undefined here but default value in addLegend should handle it
          selectedData,
          recolorComparison
        );

        //updating overlaid legends for main/comparison maps
        //moved into recolor listener, needs to fire for both maps
        // this.updateOverlayLegend("main");
        // this.updateOverlayLegend("comparison");

        setTimeout(() => {
          map.setPaintProperty(
            cls.hexSize,
            "fill-opacity",
            globals.opacity // 0.8
          );
        }, 400);
      }
    }

    map.once("idle", () => {
      this.hideSpinner();
    });
  }
  //adapted from oldcode
  addNoDataLegend(targetLegend = null, debug = false) {
    //targetLegend valuerange = [null, 'main', 'comparison']
    if (!targetLegend) {
      //handle updating the data controller's legend

      if (debug) {
        console.log("!!ATTENTION!! addNoDataLegend called");
      }

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
        if (debug) {
          console.log("new canvasNode added to histogramFrame: ", canvasNode);
        }

        legendTitle.innerHTML = "No Data for this Region";
      } else {
        if (!(targetLegend === "main" || targetLegend === "comparison")) {
          if (debug) {
            console.warn("!!!UNEXPECTED VALUE FOR TARGETLEGEND!!!");
          }
          return;
        } else {
          if (debug) {
            console.log(
              "!!ATTENTION!! addNoDataLegend called on ",
              targetLegend
            );
          }
          // let old_maincanvas = document.getElementById("histogram");
          let title = document.getElementById(targetLegend + "-legend-title");
          let legend = document.getElementById(targetLegend + "-map-legend");
          title.innerHTML = "No Data for this Region";
          legend.innerHTML = "No Data Legend";
        }
      }
    }
  }
  updateOverlayLegend(
    /* selectedData ,*/ targetLegend = "main",
    debug = false
  ) {
    if (debug) {
      console.log("updateOverlayLegend");
    }
    //targetLegend = 'main' OR 'comparison'
    //heavily adapted from addLegend code; TODO refactor/merge these two
    let cls = !(targetLegend === "comparison")
      ? globals.currentLayerState
      : globals.comparisonLayerState;
    let colors = cls.color;
    let breaks = cls.breaks;
    let precision = globals.precision;
    // let activeLayer = globals.lastActive.layer;
    let activeLayer = !(targetLegend === "comparison")
      ? globals.lastActive.layer
      : globals.lastActiveComparison.layer;
    // let activeLayer = !(targetLegend === "comparison")
    //   ? globals.lastActive.layer
    //   : globals.lastActiveComparison.layer;
    // let activeMainLayer = globals.lastActive.layer;
    // let activeComparisonLayer = globals.lastActiveComparison.layer;
    // let unit =
    //   targetLegend === "comparison"
    //     ? activeComparisonLayer.Unit
    //     : activeMainLayer.Unit;

    let title = document.getElementById(targetLegend + "-legend-title");
    let legend = document.getElementById(targetLegend + "-map-legend");

    //taken from addLegend code
    //reset the legend elements

    legend.innerHTML = "";
    title.innerHTML = "";
    // if (title) {
    //   title.innerHTML = "";
    // }

    title.innerHTML = "<span>" + activeLayer?.Unit + "</span>";
    // title.innerHTML = "<span>" + unit + "</span>";
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
      legend.appendChild(containerDiv);
    }
  }
  addLegend(
    colors = globals.currentLayerState.color,
    breaks = globals.currentLayerState.breaks,
    precision = globals.precision, //default added to mirror oldcode behaviour of global set/modified precision value
    activeLayer = globals.lastActive.layer, //should eliminate need for id etc; default value added as fallback to cope with call from recolor function
    selectedData, //i believe this is input from updatingMap based on whats features/data on screen
    recolorComparison,
    debug = false
  ) {
    // let activeLayer = activeLayer; //activeLayer is oldcode variable of the active layer from allLayers globalvariable

    //selected appropriate state management
    let cls = !recolorComparison
      ? globals.currentLayerState
      : globals.comparisonLayerState;
    //overwrite defaulting arguments if it's a comparison update
    if (recolorComparison === true) {
      colors = cls.color;
      breaks = cls.breaks;
    }

    if (!activeLayer) {
      alert(`activeLayer ${activeLayer} is not valid for addLegend`);
      return;
    }
    //Debugging logs--------------------------------------
    // console.log("addLegend called with: ");
    // console.log("in addLegend activeLayer");
    // console.log(activeLayer);
    // console.log("in addLegend selectedData: ");
    // console.log(selectedData);
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
    if (debug) {
      console.log("addLegend calling updateHistogram");
    }

    this.updateHistogram(colors, breaks, precision, activeLayer, selectedData);
    //-----------------------------------------------------------
  }
  updateHistogram( //called in addLegend; extracted for cleanliness
    colors,
    breaks,
    precision,
    activeLayer,
    selectedData,
    debug = false //i believe this is input from updatingMap based on whats features/data on screen
    //recolorComparison

    /* colors = globals.currentLayerState.colors,
    breaks = globals.currentLayerState.breaks,
    precision = globals.precision, //default added to mirror oldcode behaviour of global set/modified precision value
    activeLayer = globals.lastActive.layer, //should eliminate need for id etc; default value added as fallback to cope with call from recolor function
    selectedData //i believe this is input from updatingMap based on whats features/data on screen
     */
  ) {
    // console.log("updateHistogram params passed are:");
    // console.log("colors:", colors);
    // console.log("breaks:", breaks);
    // console.log("precision:", precision);
    // console.log("activeLayer:", activeLayer);
    // console.log("selectedData:", selectedData);

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
      if (debug) {
        console.log("new canvasNode added to histogramFrame: ", canvasNode);
      }
    }

    let canvas = document.getElementById("histogram");

    let breakMode = "e"; //equidistant (e), quantile (q), logarithmic (l), and k-means (k)
    var nGroup = 200; //
    let newBreaksAndColorRamp = this.computeBreaksAndColorRamp(
      selectedData,
      colors,
      breakMode,
      nGroup,
      breaks
      // precision
    );
    let colorRampNew = newBreaksAndColorRamp.colorRamp;
    let breaks_histogram = newBreaksAndColorRamp.histogramBreaks;
    // let breaks_precision = newBreaksAndColorRamp.breaksPrecision;

    //calculate precision
    let breaks_precision = [];
    for (let i = 0; i < breaks_histogram.length; i++) {
      breaks_precision.push(this.nFormatter(breaks_histogram[i], precision));
    }
    // console.warn("DEBUGGING breaks_precision: ", breaks_precision);

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

    var options = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
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

              //toread https://www.chartjs.org/docs/2.9.4/axes/labelling.html?h=callback%3A
              callback: function (
                value //index, //values
              ) {
                // if (index || values) {
                //   console.log(
                //     `in scales>yAxes>ticks: index or values: ${index} ${values}`
                //   );
                // }
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

    // console.log("myHistogram data: ");
    // console.log(data);
    // console.log("myHistogram options: ");
    // console.log(option);
    // console.log("myHistogram canvas: ");
    // console.log(canvas);
    // console.log("in updateHistogram creating myHistogram");
    globals.myHistogram = Chart.Bar(canvas, {
      data: data,
      options: options,
    });
    if (debug) {
      console.log(globals.myHistogram);
    }
  }

  clearOnClickQuery(mapClassInstance = this.map, debug = false) {
    if (debug) {
      console.log("clearOnClickQuery");
    }
    if (debug) {
      console.log("mapClassInstance:", mapClassInstance);
    }

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
    if (mapClassInstance.getLayer("iso")) {
      if (debug) {
        console.log('removing existing source and layer for "iso"');
      }
      mapClassInstance.removeLayer("iso");
      mapClassInstance.removeSource("iso");
    }
    for (let id of ["clickedone", "highlightS", "joined"]) {
      if (debug) {
        console.log(`removing existing source and layer for: ${id}`);
      }
      // try {
      if (mapClassInstance.getSource(id)) {
        if (id === "highlightS") {
          //special case for naming convention
          mapClassInstance.removeLayer("highlight");
          mapClassInstance.removeSource(id);
        } else {
          if (mapClassInstance.getLayer(id)) {
            if (debug) {
              console.log(`removeLayer:`, id);
            }
            mapClassInstance.removeLayer(id);
          }
          if (mapClassInstance.getSource(id)) {
            if (debug) {
              console.log(`removeSource:`, id);
            }
            mapClassInstance.removeSource(id);
          }
        }
      }
      // } catch (err) {
      // console.warn(`attempted to remove ${id} from map`);
      // console.warn(err.stack);
      // }
    }

    //toggle the custom control displaying value display off
    // var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    let clickDiv = document.getElementById("on-click-control");
    clickDiv.classList.add("display-none");
    // clickDiv.style.display = "none";
    clickDiv.innerHTML = "";
  }
  clearHexHighlight(mapboxMapInstance = this.map, debug = false) {
    if (mapboxMapInstance.getLayer("clickedone")) {
      if (debug) {
        console.log(`map:removing highlight`);
      }
      mapboxMapInstance.removeLayer("clickedone");
      this.clearOnClickQuery(mapboxMapInstance); //to remove the onClickQuery div
    }
    // let clickDiv = document.getElementById("on-click-control");
    let clickDiv = document.getElementsByClassName("click-info-box")[0];
    clickDiv.classList.add("display-none");
  }

  onBivariateClick(clicked, mapboxMapInstance = this.map, debug = false) {
    if (debug) {
      console.log(`onBivariateClick clicked object(s):`, clicked);
    }
    //check if the clicked feature is an invalid bivariate class ie. bivarClass= 9 (of 0~9 ie. 10)
    if (clicked.features[0].properties.bivarClass === 9) {
      if (debug)
        console.warn("bivar feature clicked is invalid class; doing nothing");
      return;
    }

    let classToBivariateClasses = {
      0: { 1: "Low", 2: "Low" },
      1: { 1: "Medium", 2: "Low" },
      2: { 1: "High", 2: "Low" },
      3: { 1: "Low", 2: "Medium" },
      4: { 1: "Medium", 2: "Medium" },
      5: { 1: "High", 2: "Medium" },
      6: { 1: "Low", 2: "High" },
      7: { 1: "Medium", 2: "High" },
      8: { 1: "High", 2: "High" },
      9: { 1: "Unassigned", 2: "Unassigned" },
    };

    let cls = globals.currentLayerState;
    let bvls = globals.bivariateLayerState;

    //prepare infobox for display
    let clickDiv = document.getElementsByClassName("click-info-box")[0];
    clickDiv.textContent = "CLICKED placeholder content"; //placeholder content
    clickDiv.classList.remove("display-none"); // clickDiv.style.display = "block";
    clickDiv.style.height = "auto";
    clickDiv.style.width = "200px";
    if (debug) {
      console.log("bvls.dataLayer: ", bvls.dataLayer);
      console.log(
        "Field_Name 1: ",
        clicked.features[0].properties[bvls.dataLayer[0].Field_Name],
        "Field_Name 2: ",
        clicked.features[0].properties[bvls.dataLayer[1].Field_Name]
      );
    }
    let unitText = [bvls.dataLayer[0].Unit, bvls.dataLayer[1].Unit];
    clickDiv.innerHTML =
      "<p><b>Class: </b>" +
      `${clicked.features[0].properties["bivarClass"] + 1}` +
      "</p>" +
      "<p><b>1st Value: (" +
      classToBivariateClasses[clicked.features[0].properties["bivarClass"]][1] +
      ") </b>" +
      clicked.features[0].properties[
        bvls.dataLayer[0].Field_Name
      ]?.toLocaleString() +
      " " +
      unitText[0] +
      "</p>" +
      "<p><b>2nd Value: (" +
      classToBivariateClasses[clicked.features[0].properties["bivarClass"]][2] +
      ") </b>" +
      clicked.features[0].properties[
        bvls.dataLayer[1].Field_Name
      ]?.toLocaleString() +
      " " +
      unitText[1] +
      "</p>";

    //clear preexisting highlighted source/layer
    if (mapboxMapInstance.getSource("highlightS")) {
      mapboxMapInstance.removeLayer("highlight");
      mapboxMapInstance.removeSource("highlightS");
    }
    if (mapboxMapInstance.getSource("clickedone")) {
      mapboxMapInstance.removeLayer("clickedone");
      mapboxMapInstance.removeSource("clickedone");
    }

    //determine the styleId based on what current resolution is
    let property;
    if (cls.hexSize === "admin1") {
      property = "GID_1";
    } else if (cls.hexSize === "admin2") {
      property = "GID_2";
    } else {
      property = "hexid";
    }
    //find which of the rendered features the clicked on is, and create highlight
    var featureId = clicked.features[0].properties[property];
    if (debug) {
      console.log(`highlighted hex featureId: ${featureId}`);
    }
    console.log(
      "queryRenderedFeatures with:",
      "property:",
      property,
      "featureId:",
      featureId
    );
    var feats = mapboxMapInstance.queryRenderedFeatures({
      layers: [bvls.hexSize],
      filter: ["==", property, featureId],
    });
    if (debug) {
      console.log("queryRenderedFeatures return:", feats);
    }
    var fc = featureCollection(feats); //use turf.js to aggregate into a single geojson and add as layer to map
    var dis = dissolve(fc);
    mapboxMapInstance.addSource("clickedone", {
      type: "geojson",
      data: dis,
    });
    mapboxMapInstance.addLayer({
      id: "clickedone",
      source: "clickedone",
      type: "line",
      paint: {
        "line-color": "red",
        "line-width": 5,
      },
    });
    if (debug) {
      console.log(`onBivariateClick END`);
    }
  }
  onDataClick(clicked, mapboxMapInstance = this.map, debug = true) {
    if (debug) {
      console.log(`onDataClick clicked object:`, clicked);
    }
    if (globals.bivarateMode) {
      console.log("bivariateMode enabled - onDataClick skipped");
      return;
    }
    // console.log(clicked);
    let cls = globals.currentLayerState;
    if (mapboxMapInstance === this.map2) {
      // console.warn("MAP2 DATA CLICKED");
      cls = globals.comparisonLayerState;
    }

    // var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    // let clickDiv = document.getElementById("on-click-control");
    let clickDiv = document.getElementsByClassName("click-info-box")[0];
    clickDiv.textContent = "CLICKED placeholder content"; //placeholder content

    clickDiv.classList.remove("display-none"); // clickDiv.style.display = "block";
    // clickDiv.style.height = "100px";
    clickDiv.style.height = "auto";
    clickDiv.style.width = "200px";
    let unitText = !(mapboxMapInstance === this.map2)
      ? globals.lastActive.layer.Unit
      : globals.lastActiveComparison.layer.Unit;
    clickDiv.innerHTML =
      "<p><b>Value: </b>" +
      clicked.features[0].properties[cls.dataLayer].toLocaleString() +
      " " +
      // +document.getElementById("legendTitle").textContent
      unitText +
      "</p>";
    /* //was used with a console log for debugging
  var legData = Vue._.find(allLayers, [
    "field_name",
    // currentGeojsonLayers.dataLayer,
    cls.dataLayer,
  ]); */

    if (mapboxMapInstance.getSource("highlightS")) {
      mapboxMapInstance.removeLayer("highlight");
      mapboxMapInstance.removeSource("highlightS");
    }

    if (mapboxMapInstance.getSource("clickedone")) {
      mapboxMapInstance.removeLayer("clickedone");
      mapboxMapInstance.removeSource("clickedone");
    }

    // console.log(clicked.features);
    // var currId = clicked.features[0].id; //works for non-oceanbased (ocean-data seems to not have id stored)
    var currId = clicked.features[0].properties.hexid;
    if (debug) {
      console.log(`highlighted hex currId: ${currId}`);
    }

    var feats = mapboxMapInstance.queryRenderedFeatures({
      layers: [cls.hexSize],
      filter: ["==", "hexid", currId],
    });

    if (debug) {
      console.log("queryRenderedFeatures return:", feats);
    }

    //var testAdmin = map.querySourceFeatures()

    // var fc = turf.featureCollection(feats);
    var fc = featureCollection(feats);
    // console.log(fc);
    // var dis = turf.dissolve(fc);
    var dis = dissolve(fc);

    mapboxMapInstance.addSource("clickedone", {
      type: "geojson",
      data: dis,
    });

    mapboxMapInstance.addLayer({
      id: "clickedone",
      source: "clickedone",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });
  }
  addAdminClick(e, adminLayerId, mapboxMapInstance = this.map, debug = true) {
    let cls = globals.currentLayerState;
    if (mapboxMapInstance === this.map2) {
      // console.warn("MAP2 DATA CLICKED");
      cls = globals.comparisonLayerState;
    }
    if (globals.bivarateMode) {
      console.log("addAdminClick enabled - onDataClick skipped");
      return;
    }
    // var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    // let clickDiv = document.getElementById("on-click-control");
    let clickDiv = document.getElementsByClassName("click-info-box")[0];
    clickDiv.classList.remove("display-none"); // clickDiv.style.display = "block";
    clickDiv.style.height = "auto";
    // clickDiv.style.height = "100px";
    clickDiv.style.width = "200px";
    let unitText = !(mapboxMapInstance === this.map2)
      ? globals.lastActive.layer.Unit
      : globals.lastActiveComparison.layer.Unit;

    if (debug) {
      console.log(e.features[0].properties);
    }

    //map.on('click', currentGeojsonLayers.hexSize, function (e) {

    if (debug) {
      console.log(`clicked feature GID_1: ${e.features[0].properties.GID_1}
    clicked feature GID_2: ${e.features[0].properties.GID_2}`);
    }
    //console.log(e.features[0].geometry);

    /*var feats = map.queryRenderedFeatures({
          layers: ['admin1'],
          filter: ['==', 'GID_1', e.features[0].id]
          
        }) */

    var rendered = this.map.queryRenderedFeatures({
      // layers: ["admin1"],
      layers: [adminLayerId],
    });

    var feats;
    if (cls.hexSize === "admin1") {
      feats = this.map.querySourceFeatures("admin1", {
        sourceLayer: ["admin1"],
        filter: ["==", "GID_1", e.features[0].id],
      });

      clickDiv.innerHTML =
        "<p><b>" +
        e.features[0].properties.NAME_1 +
        " " +
        e.features[0].properties.TYPE_1 +
        "</b></p>" +
        "<br><p><b>Value: </b>" +
        e.features[0].properties[cls.dataLayer].toLocaleString() +
        " " +
        document.getElementById("legendTitle").textContent +
        "</p>";
    } else if (cls.hexSize === "admin2") {
      feats = this.map.querySourceFeatures("admin2", {
        sourceLayer: ["admin2"],
        filter: ["==", "GID_2", e.features[0].id],
      });

      clickDiv.innerHTML =
        "<p><b>Value: </b>" +
        e.features[0].properties[cls.dataLayer].toLocaleString() +
        " " +
        unitText + //document.getElementById("legendTitle").textContent + +
        "</p>";
    }

    //console.log(feats);
    var countries = [];
    rendered.map(function (x) {
      countries.push(x.properties.NAME_0);
    });

    //console.log(_.uniq(countries));

    if (mapboxMapInstance.getSource("highlightS")) {
      mapboxMapInstance.removeLayer("highlight");
      mapboxMapInstance.removeSource("highlightS");
    }

    if (mapboxMapInstance.getSource("joined")) {
      mapboxMapInstance.removeLayer("joined");
      mapboxMapInstance.removeSource("joined");
    }

    mapboxMapInstance.addSource("highlightS", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    mapboxMapInstance.addLayer({
      id: "highlight",
      source: "highlightS",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });

    if (debug) {
      console.log(feats);
    }
    if (feats.length > 1) {
      var newOne = [];

      feats.forEach(function (f) {
        var geom = f.geometry;
        var props = f.properties;
        var id = f.id;

        if (geom.type === "MultiPolygon") {
          if (debug) {
            console.log(f);
          }
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

      mapboxMapInstance.addSource("joined", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapboxMapInstance.addLayer({
        id: "joined",
        source: "joined",
        type: "line",
        paint: {
          "line-color": "purple",
          "line-width": 3,
        },
      });

      mapboxMapInstance.getSource("joined").setData(joined);
    } else {
      mapboxMapInstance.getSource("highlightS").setData(feats[0]);
    }

    // })
  }

  //D) Utility Functions - static code with no major logic which supports major functions-----------------------------------
  createSourceObj(attributeIdStr, resolutionStr, debug = false) {
    let promoteId;
    if (attributeIdStr.includes("hex")) {
      promoteId = "hexid";
    } else if (attributeIdStr === "admin0") {
      promoteId = "GID_0";
    } else if (attributeIdStr === "admin1") {
      promoteId = "GID_1";
    } else if (attributeIdStr === "admin2") {
      promoteId = "GID_2";
    } else {
      if (debug) {
        console.warn("promoteId not attached to layer");
      }
    }

    let sourceURI = this.constructSourceURI(attributeIdStr, resolutionStr);
    let sourceObj = {
      type: "vector",
      tiles: [sourceURI],
      promoteId: promoteId,
    };
    return sourceObj;
  }
  constructSourceURI(attributeIdStr, resolutionStr) {
    //dirpath+attributeID+resolution+pathtemplate+sas = mvt tile path
    let fragments = constants.filepaths;
    let uriString =
      fragments.vectorTilesDirPath +
      attributeIdStr +
      resolutionStr +
      fragments.vectorTilesPathTemplate +
      fragments.filepathsSAS;
    return uriString;
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

  showSpinner(debug = false) {
    let spinner = document.getElementsByClassName("loader-gis")[0];
    let modal = document.getElementsByClassName("loader-gis-modal")[0];
    spinner.classList.remove("display-none");
    modal.classList.remove("display-none");
    if (debug) {
      console.log("show loading spinner");
    }
  }

  hideSpinner(debug = false) {
    if (debug) {
      console.log("hide loading spinner");
    }
    let spinner = document.getElementsByClassName("loader-gis")[0];
    let modal = document.getElementsByClassName("loader-gis-modal")[0];
    spinner.classList.add("display-none");
    modal.classList.add("display-none");
  }

  getBasemapLabels(debug = false) {
    let map = this.map;

    globals.basemapLabels = [];
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

    if (debug) {
      console.log(`getBasemapLabels: ${globals.basemapLabels.length} layers`);
    }
  }
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

  computeBreaksAndColorRamp(
    data,
    colors = globals.currentLayerState.color,
    breakMode = "e",
    numGroups = 200,
    currentBreaks = globals.currentLayerState.breaks,
    // precision,
    debug = false
  ) {
    if (debug) {
      console.log("computeBreaksAndColorRamp");
    }
    let numBreaks = 4; //TODO: DETERMINE THIS IMPLICIT SOURCE
    //calculate breaks and counts for use in histogram
    let histogram_breaks = chroma.limits(data, breakMode, numGroups);
    let break_index = 0;
    let break_counters = Array(numBreaks).fill(0);
    for (let i = 0; i < numGroups; i++) {
      if (histogram_breaks[i] > currentBreaks[break_index + 1]) {
        break_index++;
      }
      break_counters[break_index]++; //increment the counter at current break
    }
    // console.warn(
    //   "DEBUGGING computeBreaks: HISTOGRAM_BREAK_COUNT:",
    //   break_counters,
    //   "OLD BREAKS",
    //   currentBreaks,
    //   "NEW BREAKS",
    //   histogram_breaks
    // );

    //create new color ramp
    let colorRampNew = [];
    for (let i = 0; i < numBreaks; i++) {
      let colorRampPart = chroma
        .scale([colors[i], colors[i + 1]]) //scale maps numeric values to a color palette
        .mode("lch") //interpolation mode in which the colors are interpolated; affects color output results
        .colors(break_counters[i]); //how many colors to generate in the palette
      colorRampNew = colorRampNew.concat(colorRampPart);
    }
    // console.warn("DEBUGGING: NEW COLOR RAMP: ", colorRampNew);

    return {
      colorRamp: colorRampNew,
      histogramBreaks: histogram_breaks,
    };
  }

  //E) Unsorted/debugging----------------------------------------------------------------------------------
}

//CUSTOM MAPBOX CONTROLS

// example mapbox control
class ToggleControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.id = "on-click-control";
    this._container.className = "mapboxgl-ctrl my-custom-control";
    this._container.textContent =
      "ToggleControl placeholder textContent from intialization";

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

class DrawInfoControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.id = "draw-info-control";
    // this._container.className = "mapboxgl-ctrl my-custom-control";
    this._container.className = "mapboxgl-ctrl my-custom-control";
    this._container.textContent =
      "DrawInfoControl placeholder textContent from intialization";

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
