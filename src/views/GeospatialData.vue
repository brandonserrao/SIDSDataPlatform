<template>
  <div class="map-container">
    <map-dataset-controller class="data-controller" />
    <div id="map">
      <map-toolbar
        class="toolbar"
        @select-country="selectCountry($event)"
        @select-boundary-layer="addBoundaryLayer($event)"
      />
    </div>
  </div>
</template>

<script>
import names from "@/gis/static/names";
import GIS from "@/gis"; //gets and loads the index.js file from this directory, which has the mapboxgl Map class exported
import MapDatasetController from "@/components/MapDatasetController";
import MapToolbar from "@/components/MapToolbar";
// @ is an alias to /src

export default {
  name: "GeospatialData",
  data() {
    return {
      names: names,
      map: null,
      firstSymbolId: "tunnel-oneway-arrow-blue",
    };
  },
  components: {
    MapDatasetController,
    MapToolbar,
  },
  methods: {
    selectCountry(selection) {
      this.map.zoomToCountry(selection);
      // this.map.zoomTo(selection); //this. component instance; reffing its .map which is a Map class from index.js; calling class method zoomTo =
    },
    addBoundaryLayer(object) {
      let map = this.map; //patches reference to where map stored in component
      //taken verbatim from old code
      let points = [
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
      let k = Object.keys(object); //what layer is being added
      let v = Object.values(object)[0]; //true or false if clicked
      let clicked = k[0];

      if (points.includes(clicked)) {
        if (map.getLayer(clicked)) {
          map.removeLayer(clicked);
        } else {
          map.addLayer({
            id: clicked,
            type: "circle",
            source: "points-source",
            filter: ["==", "layer", clicked],
            layout: {
              visibility: "visible",
            },
            paint: {
              "circle-color": pointColors[clicked],
              "circle-radius": 7,
              "circle-opacity": 0.7,
            },
          });
        }
        console.log(clicked);

        map.on("click", clicked, (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties[pointDesc[clicked]];

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
      } else if (clicked === "underwater-overlay") {
        // addCables(); //TODO REENABLE ADDING CABLES
        alert("addCables not yet reimplemented");
      } else if (!v) {
        map.removeLayer(clicked);
        console.log("uncheck: " + clicked);
      } else {
        let slayer;
        let color;
        let source;

        if (clicked === "admin1-overlay") {
          source = "admin1";
          slayer = "admin1";
          color = "red";
        } else if (clicked === "admin2-overlay") {
          source = "admin2";
          slayer = "admin2";
          color = "#003399";
        } else if (clicked === "allsids") {
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
            id: clicked,
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
          map.moveLayer(clicked, "admin1-overlay");
        }

        map.on("mouseover", function () {});
      }
    },
    testGeoDataMethod() {
      //testing; calls method from the map class
      console.log("zooming to Bahamas for test");
      this.map.testMapMethod();
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
</style>
