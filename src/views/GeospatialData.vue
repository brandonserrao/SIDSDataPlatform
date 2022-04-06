<template>
  <div class="map-container">
    <div class="landscape-enforcer">
      <p>
        THE GEOSPATIAL DATA FUNCTIONALITY REQUIRES YOUR DEVICE TO BE IN
        LANDSCAPE ORIENTATION
      </p>
    </div>

    <div class="collapse-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
      >
        <path
          fill="none"
          stroke="#eee"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="48"
          d="M328 112L184 256l144 144"
        />
      </svg>
    </div>

    <map-dataset-controller
      class="data-controller"
      :map="map"
      @update="updateMap($event.dataset, $event.layer)"
      @updateComparison="
        updateComparisonMap($event.dataset, $event.layer, true)
      "
      @updateBivariate="
        updateBivariate(
          $event.firstDataset,
          $event.firstLayer,
          $event.secondDataset,
          $event.secondLayer
        )
      "
      :displayLegend="displayLegend"
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
    />
    <map-toolbar
      class="toolbar"
      @select-country="selectCountry($event)"
      @select-boundary-layer="addBoundaryLayer($event)"
      @select-resolution="changeResolution($event)"
      @select-basemap="changeBasemap($event)"
      @change-opacity="changeOpacity($event)"
      @select-color="changeColor($event)"
      @file-upload="handleFileSelect($event)"
      :active_dataset="activeDatasetName"
      :active_layer="activeLayerName"
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      :map="map"
      @toggle-legend="toggleLegend()"
      @toggle-3D="toggle3D()"
      @toggle-labels="toggleLabels($event)"
      @toggle-dualmode="toggleDualMode()"
      @toggle-bivariate="toggleBivariateMode()"
    />

    <div class="info-box-container">
      <div class="click-info-box display-none">
        Placeholder: on-click-control
      </div>
      <div class="draw-info-box display-none">
        Placeholder: draw-info-control
      </div>
    </div>

    <div class="dualmode-legend-container" v-show="dualModeEnabled">
      <div class="legend-frame background-grey">
        <div id="main-legend-title" class="legend-title">Left Legend</div>
        <div id="main-map-legend" class="legend main-map-legend"></div>
        <!-- <div class="main-units">{{ activeLayer.Unit }}</div> -->
      </div>
      <div class="legend-frame background-grey">
        <div id="comparison-legend-title" class="legend-title">
          Right Legend
        </div>
        <div id="comparison-map-legend" class="legend comparison-map-legend">
          placeholder legend content
        </div>
      </div>
      <!-- <div class="comparison-units">{{ activeLayer.Unit }}</div> -->
    </div>

    <div id="mapsContainer">
      <div id="map">
        <div class="loader-gis-modal">
          <grid-loader
            class="loader-gis display-none"
            :loading="gisLoader.loading"
            :color="gisLoader.color"
            :size="gisLoader.size"
          ></grid-loader>
        </div>
      </div>

      <div id="map2"></div>
    </div>
  </div>
</template>

<script>
// import { gis_store } from "../gis/gis_store.js"; //testing use of a store
import * as d3 from "d3";

import filepaths from "@/gis/static/filepaths.js";
// import constants from "@/gis/static/constants.js";
import globals from "@/gis/static/globals.js";

import names from "@/gis/static/names";
import GIS from "@/gis"; //gets and loads the index.js file from this directory, which has the mapboxgl Map class exported
import MapDatasetController from "@/components/MapDatasetController";
import MapToolbar from "@/components/MapToolbar"; //my attempt at adapting Ben's Form of new sidebar
import GridLoader from "vue-spinner/src/GridLoader.vue"; // import PulseLoader from "vue-spinner/src/PulseLoader.vue";

import mapboxgl from "@/gis/mapboxgl";
import bbox from "@turf/bbox";
import csv2geojson from "csv2geojson"; //used in file parsing for geodata upload from via toolbar
// @ is an alias to /src

export default {
  name: "GeospatialData",
  data() {
    return {
      names: names,
      map: null,
      //for implementing as props to pass from dataset-controller to map-toolbar
      activeDatasetName: null,
      activeLayerName: null,
      displayLegend: true,
      dualModeEnabled: null,
      bivariateModeEnabled: null,
      gisLoader: { loading: true, color: "purple", size: "50px" },
      // gis_store, //testing use of a store
    };
  },
  components: {
    MapDatasetController,
    MapToolbar,
    GridLoader, // PulseLoader,
  },
  methods: {
    //A) Interfaces for the Map class
    changeBasemap(object) {
      this.map.changeBasemap(object);
    },
    changeOpacity(object) {
      this.map.changeOpacity(object);
    },
    changeColor(object) {
      this.map.changeColor(object);
    },
    selectCountry(selection) {
      this.map.zoomToCountry(selection); //focus tightly on the country using its bbox
      // this.map.setMapBounds(selection.bb); //lock using map.setMaxBounds(countryBBox or similar) with a buffer to allow panning within relevant surrounding area (EEZ assumed)
    },
    toggle3D() {
      this.map.add3D();
    },
    toggleLabels(labelObject) {
      this.map.toggleLabels(labelObject);
    },
    toggleDualMode() {
      this.dualModeEnabled = !this.dualModeEnabled;
      // console.log("dualModeEnabled:", this.dualModeEnabled);
      this.map.toggleMapboxGLCompare();
    },
    toggleBivariateMode() {
      this.bivariateModeEnabled = !this.bivariateModeEnabled;
      console.log("bivariateModeEnabled:", this.bivariateModeEnabled);
      this.map.toggleBivariateComponents(); //evoke custom functionality from the map class instance
    },
    toggleLegend() {
      this.displayLegend = !this.displayLegend;
    },
    toggleDatasetController() {
      console.log("collapse-btn onclick firing");
      let dataController =
        document.getElementsByClassName("data-controller")[0];
      dataController.classList.toggle("collapsed");

      let collapseBtn = document.getElementsByClassName("collapse-btn")[0];
      collapseBtn.classList.toggle("collapsed");
    },
    changeResolution(object) {
      if (!(this.activeDatasetName === "Ocean Data")) {
        console.log(`activeDatasetName: ${this.activeDatasetName}`);
        this.map.changeHexagonSize(object);
      } else {
        console.log(
          `activeDatasetName: ${this.activeDatasetName}; doing nothing;`
        );
        //TODO: implement a more explicitly blocking version where it stops the clicking in the toolbar itself
        return;
      }
    },

    resetToolbarMenus() {
      console.log(
        `! resetToolbarMenus() currently only resets: Palette Select, Opacity Slider`
      );

      let paletteMenu = document.getElementsByClassName("selected-color")[0];
      paletteMenu.children[0].innerHTML = "Default";
      paletteMenu.children[1].className = "menu-icon " + "color-icon-1"; //usng color-icon-1 as placeholder for now

      let opacitySlider = document.getElementsByClassName("opacity-slider")[0];
      opacitySlider.value = globals.opacity; //hardcoded until changed to be based on shared reactive variable
    },

    //B) Main functions
    handleFileSelect(eventObject) {
      console.warn("handleFileSelect under development");
      console.log("eventObject passed: ", eventObject);
      let event = eventObject.file;

      // taken from handleFileSelect and addUploadToMap from oldcode

      console.log(event.target.files[0]);
      event.stopPropagation();
      event.preventDefault();
      var file;
      //console.log(event.dataTransfer)
      if (typeof event.dataTransfer === "undefined") {
        file = event.target.files[0];
      } else {
        file = event.dataTransfer.files[0]; // FileList object.
      }

      //console.log(file)
      //console.log(file.size);

      let last_dot = file.name.lastIndexOf(".");
      let ext = file.name.slice(last_dot + 1);

      //let name = filename.slice(0, last_dot)

      //console.log(file.type);
      var reader = new FileReader();
      let componentInstance = this;
      reader.onloadend = function (e) {
        // console.log(this.result);
        console.log(ext, e);
        // var result = JSON.parse(this.result);
        //console.log(result);

        componentInstance.addUploadToMap(this.result, ext);

        /* if (file.size > 52428800) {
              alert('file is too big, aim for under 50mb!')
          } else {
              alert('this file is not an acceptable type');
          } */
      };

      reader.readAsText(file);
      //------------------------------------------------
    },
    //testing as alternative to addUploadToMap
    new_addUploadToMap() {
      //create modal with options to allow user to check off which fields they want
      //need to parse and display the fields
    },
    addUploadToMap(res, ext, map = this.map.map) {
      // console.log(res);

      //remove an uploaded layer if there's already one
      if (map.getLayer("upload")) {
        map.removeLayer("upload");
        map.removeLayer("uploadline");
        map.removeSource("upload");
      }

      // let fileName = file.name;
      // console.log(fileName);

      //if geojson do this
      if (ext === "geojson" || ext === "json") {
        console.log("parsing upload geodata as geo/json file");
        res = JSON.parse(res);
        // console.log(res);

        map.addSource("upload", {
          type: "geojson",
          data: res,
        });

        //little tricky here - adds two layers but one is invisible
        //the invisible fill layer is used for the click feature, otherwise you'd have to click on the line
        map.addLayer({
          id: "upload",
          type: "fill",
          source: "upload",
          paint: {
            "fill-opacity": 0.0,
          },
        });
        map.addLayer({
          id: "uploadline",
          type: "line",
          source: "upload",
          paint: {
            "line-color": "red",
            "line-opacity": 0.7,
            "line-width": 4,
          },
        });
        // for (var x in res.features){
        //     //console.log(res.features[x].properties);
        // }

        //get bounds of uploaded data
        var uploadBbox = bbox(res);

        //zoom to uploaded data
        map.fitBounds(uploadBbox, {
          linear: true,
          padding: {
            top: 10,
            bottom: 25,
            left: 15,
            right: 5,
          },
        });

        //if you click on the uploaded feature, display a popup of all fields
        map.on("click", "upload", (e) => {
          console.log(e.lngLat);
          //console.log(e.features[0].properties.lngLat)
          var description = "";

          for (var x in e.features[0].properties) {
            console.log(x);

            description += x + ": " + e.features[0].properties[x] + "<br>";
            console.log(e.features[0].properties[x]);
            console.log("---");
          }

          new mapboxgl.Popup({
            className: "upload-pop",
          })
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);
        });
      } else if (ext === "csv") {
        //if csv, assume it's points

        console.log(res);
        console.log("its a csv");

        let csv_config = {
          latfield: "LAT",
          lonfield: "LON",
          delimiter: ",",
        };
        let error_log = [];

        csv2geojson.csv2geojson(res, csv_config, function (err, data) {
          if (err) {
            if (
              err.message ===
              "A row contained an invalid value for latitude or longitude"
            ) {
              error_log.push(err); //log error and its details
              return; //attempt to skip the entry
            }
          } else {
            console.warn("geodata upload caused unhandled errors");
            throw err;
          } //the case of unhandled error type
          //console.log(err);

          var uploadBbox = bbox(data);
          console.log(uploadBbox[0]);

          if (uploadBbox[0] === Infinity) {
            alert(
              "cannot determine a bounding box. Make sure data has a spatial component or that the latitude and longitude columns are named Lat and Lng"
            );
          } else {
            //get list of fields ie. properties from a features in the parsed geojson and store them for use in generating the checklist modal
            let field_names = Object.keys(data.features?.[0].properties);
            //iterate through field_names and add them with checkboxes or radio buttons? to it

            let div_fieldNames = document.getElementById("fieldNames"); //should get the div to hold the list of radio buttons which allow toggling primary field of interest
            div_fieldNames.innerHTML = ""; //clear previous contents;
            for (const fieldName of field_names) {
              //create a radio button and append it with its label to the container div
              // let element = `<input type="radio" name="radioGroup_fieldNames" id=${fieldName} value=${fieldName}/>
              // <label for=${fieldName}>${fieldName}</label>
              // <br />`;
              let radioButton = document.createElement("INPUT");
              radioButton.setAttribute("type", "radio");
              radioButton.setAttribute("name", "radioGroup_fieldNames");
              radioButton.setAttribute("id", `${fieldName}`);
              radioButton.setAttribute("value", `${fieldName}`);

              let label = document.createElement("LABEL");
              label.setAttribute("for", `${fieldName}`);
              label.innerText = `${fieldName}`;

              let wrapper_div = document.createElement("div");

              // div_fieldNames.append(radioButton);
              // div_fieldNames.append(label);
              wrapper_div.append(radioButton);
              wrapper_div.append(label);
              div_fieldNames.append(wrapper_div);
            }

            console.log(data, field_names);

            map.addSource("upload", {
              type: "geojson",
              data: data,
            });

            map.addLayer({
              id: "upload",
              type: "circle",
              source: "upload",
              paint: {
                "circle-color": "red",
                "circle-radius": 4,
              },
            });

            /* var uploadBbox = bbox(data)
             console.log(uploadBbox);*/

            map.fitBounds(uploadBbox, {
              linear: true,
              padding: {
                top: 40,
                bottom: 40,
                left: 40,
                right: 40,
              },
            });
          }
        });

        //if you click on the uploaded feature, display a popup of all fields
        map.on("click", "upload", (e) => {
          //to be obsoleted
          // console.log(e.lngLat);
          //console.log(e.features[0].properties.lngLat)
          var description = "";

          for (var x in e.features[0].properties) {
            console.log(x);

            description += x + ": " + e.features[0].properties[x] + "<br>";
            // console.log(e.features[0].properties[x]);
            // console.log("---");
          }
          new mapboxgl.Popup({
            className: "upload-pop",
          })
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);
        });
        /*
          //testing
          //change description template to include an selector filled with options of the properties; and a on choose listener to update the displayed details in-popup
          let optionList = [];
          //for (var x in e.features[0].properties)
          for (let x in e.features[0]) {
            let optionString = `<option value="${e.features[0].properties[x]}">${e.features[0].properties}</option>`;
            optionList.push(optionString);
          }
          console.log("optionList", optionList);
          let selectorID = "geodataPopupSelect";
          let popupHTML =
            `<div>Geodata Source File: ${"placeholder"}</div>
          <div>Choose by field name:</div>
          <select id=${selectorID} name='geodataPopupSelector'>` +
            [...optionList] +
            `</select>` +
            `<div id="geodataFieldValue"></div>`;
          //document.getElementById(selectorID).append(...optionList); //fill the selector with options

          new mapboxgl.Popup({
            className: "upload-pop",
          })
            .setLngLat(e.lngLat)
            .setHTML(popupHTML)
            //.setHTML(description)
            .addTo(map);
        });

        //add change listener to modify
        // document
        //   .getElementById(selectorID)
        //   .addEventListener("event", function (e) {
        //     document.getElementById(outputID).innerText = e.target.value;
        //   });

         */
      } else {
        //if the uploaded data isn't a csv or json

        alert("oops we need a csv or geojson");
      }
    },
    addBoundaryLayer(object) {
      console.log("addBoundaryLayer:");
      console.log(object);
      let map = this.map; //patches reference to where map stored in component
      //taken from old code
      let pointsLayers = [
        "airports-extended",
        "healthsites",
        "volcano_list",
        "glopal_power_plant",
        "world_port_index",
      ];
      let pointColors = {
        "airports-extended": "blue",
        healthsites: "red",
        volcano_list: "orange",
        glopal_power_plant: "green",
        world_port_index: "yellow",
      };
      let pointDesc = {
        "airports-extended": "Airport_Na",
        healthsites: "name", //conflicting with power plants in geojson, need to change name
        volcano_list: "Volcano_Na",
        glopal_power_plant: "name",
        world_port_index: "PORT_NAME",
      };
      let layerNames = Object.keys(object); //what layer is being added
      let checkedBool = Object.values(object)[0]; //true or false if layerName
      let layerName = layerNames[0];
      console.log(
        "layerNames",
        layerNames,
        "checkedBool",
        checkedBool,
        "layerName",
        layerName
      );

      //if checkedBool === true, then Add
      //else if checkedBool === false, then remove
      //else throw exception

      if (checkedBool === false) {
        console.log(`removing boundary layer ${layerName}`);
        if (pointsLayers.includes(layerName)) {
          map.removeLayer(layerName);
        } else if (layerName === "underwater-overlay") {
          map.removeLayer("underwater");
        } else {
          console.log(`checked ${checkedBool} , removing ${layerName}`);
          map.removeLayer(layerName);
        }
      } else if (checkedBool === true) {
        console.log(`adding boundary layer ${layerName}`);
        if (pointsLayers.includes(layerName)) {
          //adding point layers
          map.addLayer({
            id: layerName,
            type: "circle",
            source: "points-source",
            filter: ["==", "layer", layerName],
            layout: {
              visibility: "visible",
            },
            paint: {
              "circle-color": pointColors[layerName],
              "circle-radius": 7,
              "circle-opacity": 0.7,
            },
          });
          console.log(`adding onclick listener to ${layerName} `);
          map.on("click", layerName, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties[pointDesc[layerName]];

            //console.log(coordinates);
            // getIso(coordinates); TODO IMPLEMENT ISOCHRONE

            /*
            new mapboxgl.Popup({
              className: "popupCustom",
            })
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
            */
            map
              .makePopUp({
                className: "popupCustom",
              })
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });
        } else if (layerName === "underwater-overlay") {
          //adding underwater cables layer
          if (!map.getSource("underwater-source")) {
            //checking if source exists already
            console.log(
              `source not added; fetching boundary layer source and adding layer  ${layerName} `
            );
            d3.json(filepaths.cableFilePath).then(function (d) {
              map.addSource("underwater-source", {
                type: "geojson",
                data: d,
              });

              map.addLayer(
                {
                  id: "underwater",
                  type: "line",
                  source: "underwater-source",

                  layout: {
                    visibility: "visible",
                  },

                  paint: {
                    "line-color": ["get", "color"],
                    "line-width": 2,
                  },
                },
                globals.firstSymbolId
              );
            });
          } else {
            //source exists so just add
            map.addLayer(
              {
                id: "underwater",
                type: "line",
                source: "underwater-source",

                layout: {
                  visibility: "visible",
                },

                paint: {
                  "line-color": ["get", "color"],
                  "line-width": 3,
                },
              },
              globals.firstSymbolId
            );
          }
          console.log(`adding onclick listener to ${layerName} `);
          map.on("click", "underwater", function (e) {
            /*
              var popup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: true,
              });
              */
            let description = "<b>" + e.features[0].properties["slug"] + "</b>";
            let coordinates = e.lngLat;

            map
              .makePopUp({
                className: "popupCustom",
              })
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
            /*

              popup
                .setLngLat(e.lngLat)
                .setHTML("<b>" + e.features[0].properties["slug"] + "</b>")
                .addTo(map);
                */
          });
          console.log("added underwater cables data");
        } else {
          //just add the layer
          let slayer;
          let color;
          let source;

          if (layerName === "admin1-overlay") {
            source = "admin1";
            slayer = "admin1";
            color = "red";
          } else if (layerName === "admin2-overlay") {
            source = "admin2";
            slayer = "admin2";
            color = "#003399";
          } else if (layerName === "allsids") {
            //console.log('sids!')
            source = "allsids";
            slayer = "allSids";
            color = "orange";
          } else {
            //source = 'pvaph'
            //layer == 'airports=extended', 'healthsites', 'volcano-list', 'glopal_power_plant', ''
            // console.log($(this).val());
            // //console.log($(this).id())
            // console.log($(this));
          }

          map.addLayer(
            {
              id: layerName,
              type: "line",
              source: source,
              "source-layer": slayer,
              layout: {
                visibility: "visible",
              },

              paint: {
                "line-color": color,
                "line-width": 1,
              },
            },
            this.firstSymbolId
          );

          if (map.getLayer("admin1-overlay")) {
            map.map.moveLayer(layerName, "admin1-overlay"); //brings the layer ontop of admin1-overlay
          }
        }
      }

      map.map.once("idle", () => {
        map.hideSpinner();
      });
    },
    updateBivariate(firstDataset, firstLayer, secondDataset, secondLayer) {
      // console.warn(
      //   "updateBivariate:",
      //   "activeDataset: ",
      //   activeDataset,
      //   "activeLayer: ",
      //   activeLayer,

      // );
      console.warn("updateBivariate(...) still being implemented");
      this.map.createBivariate(
        firstDataset,
        firstLayer,
        secondDataset,
        secondLayer
      );
    },

    updateComparisonMap(activeDataset, activeLayer) {
      if (!activeDataset) {
        console.log("no dataset/layer to updateComparisonMap with");
      } else {
        //check for recognized dataset.type
        switch (activeDataset.type) {
          case "single": //only contains one layer; pull it from dataset
            activeLayer = activeDataset.layers[0];
            break;
          case "layers": //has multiple datasets -> activeLayer will be truthy
            break;
          case "temporal": //has multiple datasets -> activeLayer will be truthy
            break;
          default:
            alert(
              `Unrecognized case of activeDataset.type: ${activeDataset.type} in updateComparisonMap`
            );
        }

        //copied and adapted from start of updateMap()
        /* if (!(activeDataset === globals.lastActive.dataset)) {
          // console.log(`dataset changing from ${globals.lastActive.dataset?.name} -> ${activeDataset.name}; resetting color palette;`);
          globals.lastActiveComparison.dataset = activeDataset;
          globals.comparisonLayerState.color = null;
          // this.resetToolbarMenus();
        } */

        if (activeLayer) {
          //display loader spinner
          console.log("showing loading spinner");
          let spinner = document.getElementsByClassName("loader-gis")[0];
          let modal = document.getElementsByClassName("loader-gis-modal")[0];
          console.log(spinner);
          spinner.classList.remove("display-none");
          modal.classList.remove("display-none");
          console.log(spinner);

          //if ocean dataset or layer selected place resolution indicator to 10km hex option
          var resolutionOptions =
            document.getElementsByClassName("resolution-option");

          if (activeLayer.Name === "Ocean Data") {
            //handle if called while ocean dataset active
            console.log(
              `activeLayer.Name: ${activeLayer.Name}; set resolution selector to 10`
            );

            for (let i = 0; i < resolutionOptions.length; i++) {
              if (i === 2) {
                //i = 2 is the hardcoded index for the 10km selector
                resolutionOptions[i].classList.add("border-blue");
              } else {
                resolutionOptions[i].classList.remove("border-blue");
              }
            }
          }
          console.log(
            `activeLayer: ${activeLayer.Field_Name} ${activeLayer.Description}`
          );

          if (activeLayer.Name === "Ocean Data") {
            if (activeLayer.Field_Name === "depth") {
              console.log(
                "updateComparisonMap w/ Ocean Data-Depths: " +
                  activeLayer.Description
              );
              this.map.addOcean(activeDataset, activeLayer, true);
            } else {
              console.log(
                "updateComparsionMap w/ Ocean Data: " + activeLayer.Description
              );
              this.map.changeDataOnMap(activeDataset, activeLayer, true);
            }
          } else {
            this.map.changeDataOnMap(activeDataset, activeLayer, true);
          }
        }
      }

      //TODO: reevaluate this; copied from updateMap from
      //workaround!!! implemented for recoloring code
      //, setting a global variable instead of passing it through;
      globals.lastActiveComparison.layer = activeLayer;
      globals.lastActiveComparison.dataset = activeDataset;
      console.log(
        "writing to globals.lastActiveComparison",
        globals.lastActiveComparison
      );
    },
    updateMap(activeDataset, activeLayer) {
      if (!(activeDataset === globals.lastActive.dataset)) {
        // console.log(`dataset changing from ${globals.lastActive.dataset?.name} -> ${activeDataset.name}; resetting color palette;`);
        globals.lastActive.dataset = activeDataset;
        globals.currentLayerState.color = null;
        this.resetToolbarMenus();
      }

      //if there isn't a dataset selected and updatecalls;
      //reset actives (can serve as trigger to reset selection)
      if (!activeDataset) {
        // console.log("no dataset/layer to updateMap with; resetting activeDataset/Layer");
        activeDataset = null;
        activeLayer = null;
      } else {
        //TODO: reevaluate this ratch
        //update this vue's state
        this.activeDatasetName = activeDataset.name; //should be identical to activeLayerName

        //check for recognized dataset.type
        switch (activeDataset.type) {
          case "single": //only contains one layer; pull it from dataset
            activeLayer = activeDataset.layers[0];
            break;
          case "layers": //has multiple datasets -> activeLayer will be truthy
            break;
          case "temporal": //has multiple datasets -> activeLayer will be truthy
            break;
          default:
            alert(
              `Unrecognized case of activeDataset.type: ${activeDataset.type} in updateMap`
            );
        }
        //
        if (activeLayer) {
          //display loader spinner
          console.log("showing loading spinner");
          let spinner = document.getElementsByClassName("loader-gis")[0];
          let modal = document.getElementsByClassName("loader-gis-modal")[0];
          console.log(spinner);
          spinner.classList.remove("display-none");
          modal.classList.remove("display-none");
          console.log(spinner);

          //if ocean dataset or layer selected place resolution indicator to 10km hex option
          var resolutionOptions =
            document.getElementsByClassName("resolution-option");

          if (activeLayer.Name === "Ocean Data") {
            //handle if called while ocean dataset active
            console.log(
              `activeLayer.Name: ${activeLayer.Name}; set resolution selector to 10`
            );

            for (let i = 0; i < resolutionOptions.length; i++) {
              if (i === 2) {
                //i = 2 is the hardcoded index for the 10km selector
                resolutionOptions[i].classList.add("border-blue");
              } else {
                resolutionOptions[i].classList.remove("border-blue");
              }
            }
          }

          //TODO: reevaluate this ratch
          //update this vue's state
          this.activeLayerName = activeLayer.Name; //should be identical to activeDatasetName
          // console.log(`activeLayer: ${activeLayer.Field_Name} ${activeLayer.Description}`);

          if (activeLayer.Name === "Ocean Data") {
            if (activeLayer.Field_Name === "depth") {
              // console.log("updateMap w/ Ocean Data-Depths: " + activeLayer.Description);
              this.map.addOcean(activeDataset, activeLayer);
            } else {
              // console.log("updateMap w/ Ocean Data: " + activeLayer.Description);
              this.map.changeDataOnMap(activeDataset, activeLayer);
            }
          } else {
            // console.log(
            //   "updateMap w/ changeDataOnMap: " +
            //     activeDataset.name +
            //     " " +
            //     activeLayer.Description
            // );
            this.map.changeDataOnMap(activeDataset, activeLayer);
          }

          /* //if there's a layer chosen -> changeDataOnMap
          if (activeLayer.Field_Name === "depth") {
            console.log(
              "updateMap w/ Ocean Data-Depths: " + activeLayer.Description
            );
            this.map.addOcean(activeDataset, activeLayer);
          } else if (activeLayer.Name === "Ocean Data") {
            console.log("updateMap w/ Ocean Data: " + activeLayer.Description);
            this.map.changeDataOnMap(activeDataset, activeLayer);
          } else {
            console.log(
              "updateMap w/ changeDataOnMap: " +
                activeDataset.name +
                " " +
                activeLayer.Description
            );
            this.map.changeDataOnMap(activeDataset, activeLayer);
          } */
        }
      }

      //TODO: reevaluate this
      //workaround!!! implemented for recoloring code
      //, setting a global variable instead of passing it through;
      globals.lastActive.layer = activeLayer;
      globals.lastActive.dataset = activeDataset;
      console.log("writing to globals.lastActive", globals.lastActive);
    },
  },
  mounted() {
    this.map = new GIS("#mapsContainer", "map", "map2");

    let collapseBtn = document.getElementsByClassName("collapse-btn")[0];
    collapseBtn.addEventListener("click", this.toggleDatasetController);
  },
};
</script>
<style media="screen">
.info-box-container {
  z-index: 998;
  /* color and backgroound taken from mapbox control style */
  background-color: hsla(0, 0%, 100%, 0.75);
  color: #333;
  padding: 2px 7px;
  /* border: 2px solid #333; */
  position: absolute;
  bottom: 10vh;
  right: 0.5vw;
  box-sizing: border-box;
}
.click-info-box p,
.draw-info-box p {
  margin: 2.5px;
}

/* to keep the nav drawer above the geospatial data components */
.v-navigation-drawer,
.navigation-container {
  z-index: 3000;
}

.landscape-enforcer {
  display: block;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: black;
  color: white;
  opacity: 0.98;
  z-index: 2000;
}
.landscape-enforcer p {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30vh 10vw;
}
/* portrait devices smaller than tablets */
@media (orientation: portrait) and (max-width: 750px) {
  .landscape-enforcer {
    display: block;
  }
}
/* portrait devices as big as tablets */
@media (orientation: portrait) and (min-width: 750px) {
  .landscape-enforcer {
    display: none;
  }
}

/* landscape for devices smaller than laptops */
@media (orientation: landscape) and (max-width: 1200px) {
  .analysis-tools {
    display: none !important;
    /* used to hide analysis tools from mobile devices */
  }
}

/* */
@media (orientation: landscape) {
  .landscape-enforcer {
    display: none;
  }
}

.mapboxgl-popup-content {
  overflow-y: scroll;
  overflow-x: scroll;
  max-height: 50vh;
}
.loader-gis {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* margin: 0 auto; */
  opacity: 0.75;
  z-index: 1500;
}

.loader-gis-modal {
  position: relative;
  background-color: rgba(134, 131, 131, 0.13);
  width: 100%;
  height: 100%;
  z-index: 900;
}

.display-none {
  display: none;
}

#map,
#map2 {
  height: 100vh;
  width: 100%;
}
.map-container {
  position: relative;
  padding: 0 !important;
  height: 100%;
  width: 100%;
}
.data-controller {
  position: absolute;
  left: 2em;
  top: 2em;
  width: 400px;
  z-index: 999;

  transition: 0.5s ease-in-out all;
  opacity: 1;
}

/* FOR LEGEND ??*/

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  display: none;
}

::-webkit-scrollbar-thumb {
  background: #9e9e9e;
  border-radius: 10px;
}

.population-density-box {
  width: 350px;
  height: 180px;
  margin-top: 5px;
  /*border-radius: 10px; */
  background-color: #dddddd;
  margin-left: 30px;
  /*sebastian added */
  position: relative;
  z-index: 3;
  padding: 10px;
}

.population-per-km {
  /* max-width: 350px; */
  /*margin-top: 12px; */
  background-color: #dddddd;
  /*border-radius: 10px; */
  /* padding: 10px; */
  padding: 5px;
  /* margin-left: 30px; */
  /*sebastian added */
  position: relative;
  z-index: 1;
  height: 199px;
}

.population-per-km-text {
  font-size: 11px;
  line-height: 14px;
  margin-top: 5px;
}

.population-per-km-img {
  width: 17px;
  height: 15px;
  background: url("../assets/polygon.png");
  background-repeat: no-repeat;
  background-size: 101% 101%;
  margin-top: 2px;
  z-index: 4;
}

/* onclick of hexes mapbox control bottom-right */
.my-custom-control {
  /* display: block; */
  display: none;
  background-color: rgba(221, 221, 221, 0.9);
  height: 0px;
  width: 0px;
  padding: 5px;
}

.collapse-btn {
  width: 30px;
  height: 50px;
  position: absolute;
  left: -0vw;
  top: 20vh;
  background-color: rgba(153, 142, 142, 0.562);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  /*     display: flex;
    justify-content: center;*/
  z-index: 1600;
  margin-left: -5px;
}

@media (orientation: landscape) and (max-width: 750px) {
  .collapse-btn {
    top: 50vh;
    /* margin-left: 0; */
  }
}

.collapse-btn svg {
  max-width: 26px;

  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.collapse-btn.collapsed {
  transform: rotate(180deg);
}

.data-controller.collapsed {
  opacity: 0;
  z-index: -999;
  pointer-events: none;
}

.mapbox-gl-draw_polygon.active,
.mapbox-gl-draw_polygon.active:hover {
  background-color: rgb(42, 155, 42);
}

#mapsContainer {
  /* position: relative; */
  /*  height: 100%;
  width: 100%; */
  height: 100vh;
}
#mapsContainer #map,
#mapsContainer #map2 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* height: 100vh; */
}
</style>
