<template>
  <div class="map-container">
    <button class="debug" @click="_logSources()">Debug logger</button>
    <map-dataset-controller
      class="data-controller"
      :map="map"
      @update="updateMap($event.dataset, $event.layer)"
      :displayLegend="displayLegend"
    />
    <map-toolbar
      class="toolbar"
      @select-country="selectCountry($event)"
      @select-boundary-layer="addBoundaryLayer($event)"
      @select-resolution="changeResolution($event)"
      @select-basemap="changeBasemap($event)"
      @change-opacity="changeOpacity($event)"
      @select-color="changeColor($event)"
      :active_dataset="activeDatasetName"
      :active_layer="activeLayerName"
      @toggle-legend="toggleLegend()"
      @toggle-3D="toggle3D()"
    />
    <div id="map"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

import filepaths from "@/gis/static/filepaths.js";
// import constants from "@/gis/static/constants.js";
import globals from "@/gis/static/globals.js";

import names from "@/gis/static/names";
import GIS from "@/gis"; //gets and loads the index.js file from this directory, which has the mapboxgl Map class exported
import MapDatasetController from "@/components/MapDatasetController";
import MapToolbar from "@/components/MapToolbar"; //my attempt at adapting Ben's Form of new sidebar

// import MapToolbar from "@/components/oldMapToolbar";//my old sidebar implementation, before Ben's

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
    };
  },
  components: {
    MapDatasetController,
    MapToolbar,
  },
  methods: {
    _logSources() {
      //debugging: to look at sources loaded onto mapbox map
      console.log(`listing sources in map`);
      this.map.logSources();
    },

    toggle3D() {
      console.log(`toggling 3D !!! currently indev`);
      this.map.add3D();
    },
    toggleLegend() {
      console.log(`toggling Legend: displayLegend= ${this.displayLegend}`);
      this.displayLegend = !this.displayLegend;
    },
    selectCountry(selection) {
      this.map.zoomToCountry(selection);
      // this.map.zoomTo(selection); //this. component instance; reffing its .map which is a Map class from index.js; calling class method zoomTo =
    },

    changeResolution(object) {
      console.log("changeResolution(object) object is:");
      console.log(object); //{resolution: "hex1"} for eg.

      //oldcode goes in here; calling on mapclass methods
      //call changeHexagonSize/changeResolution
      this.map.changeHexagonSize(object); //oldcode expec: object = {Resolution: string}; newcode gives: {resolution: string}
    },

    changeBasemap(object) {
      console.log("changeBasemap(object) object is:");
      console.log(object);

      //oldcode goes in here; calling on mapclass methods
      //call
      this.map.changeBasemap(object);
    },
    changeOpacity(object) {
      console.log("changeOpacity(object) object is:");
      console.log(object);

      this.map.changeOpacity(object);
    },
    changeColor(object) {
      console.log("changeColor(object) object is: ");
      console.log(object);

      this.map.changeColor(object);
    },

    addBoundaryLayer(object) {
      console.log("addBoundaryLayer(object) object is:");
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
            map.moveLayer(layerName, "admin1-overlay"); //brings the layer ontop of admin1-overlay
          }
        }
      }
    },

    updateMap(activeDataset, activeLayer) {
      //if there isn't a dataset selected and updatecalls;
      //reset actives (can serve as trigger to reset selection)
      if (!activeDataset) {
        console.log(
          "no dataset/layer to updateMap with; resetting activeDataset/Layer"
        );
        activeDataset = null;
        activeLayer = null;
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
              `Unrecognized case of activeDataset.type: ${activeDataset.type} in updateMap`
            );
        }
        //
        if (activeLayer) {
          console.log(`activeLayer: ${activeLayer.Field_Name}`);
          //if there's a layer chosen -> changeDataOnMap
          if (activeLayer.Field_Name === "depth") {
            console.log("updateMap w/ Ocean Data-Depths:");
            console.log(activeLayer.Description);
            this.map.addOcean(activeDataset, activeLayer);
          } else {
            console.log("updateMap w/ changeDataOnMap");
            this.map.changeDataOnMap(activeDataset, activeLayer);
          }
        }
      }

      //TODO: reevaluate this
      //workaround!!! implemented for recoloring code
      //, setting a global variable instead of passing it through, i
      globals.lastActive.layer = activeLayer;
      globals.lastActive.dataset = activeDataset;
    },
  },
  mounted() {
    this.map = new GIS("map"); //initialzing mapbox map instance???
  },
};
</script>
<style media="screen">
#map {
  height: 100vh;
  width: 100%;
}
.map-container {
  position: relative;
  padding: 0 !important;
}
.data-controller {
  position: absolute;
  left: 2em;
  top: 2em;
  width: 400px;
  z-index: 999;
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
  max-width: 350px;
  /*margin-top: 12px; */
  background-color: #dddddd;
  /*border-radius: 10px; */
  padding: 10px;
  margin-left: 30px;
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
  display: none;
  background-color: rgba(221, 221, 221, 0.9);
  height: 0px;
  width: 0px;
  padding: 5px;
}
</style>
