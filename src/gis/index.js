import "mapbox-gl/dist/mapbox-gl.css";
import "@/gis/styles/minimap.css";
import filepaths from "@/gis/static/filepaths.js";
// import constants from "@/gis/static/constants.js";
import globals from "@/gis/static/globals.js";

import * as d3 from "d3";

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

      this._addSources();
    });
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
  _addSources() {
    let map = this.map; //patching map reference

    //taken from old code
    //called when map is loaded

    //pulls in the pointdata about airports volcanoes etc
    d3.json(filepaths.pointdataFilePath).then(function (d) {
      map.addSource("points-source", {
        type: "geojson",
        data: d,
      });
    });

    console.log(Object.keys(globals.sources));
    //LOAD SOURCES (VECTOR TILES)
    for (let idString of Object.keys(globals.sources)) {
      console.log("adding " + idString);
      map.addSource(idString, globals.sources[idString]);
    }

    if (!map.getLayer("allsids")) {
      //LOADING ALLSIDS LAYER IF NOT ADDED BEFORE FOR SOME REASON;
      // WHY NECESSARY??? -> READ ON MAPBOX LAYER VS STYLE VS SOURCE!
      console.log(
        "??? adding allsids layer because it wasnt added for some reason"
      );
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
