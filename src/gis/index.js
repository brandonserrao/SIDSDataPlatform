import 'mapbox-gl/dist/mapbox-gl.css';
import '@/gis/styles/minimap.css';

import mapboxgl from '@/gis/mapboxgl';
// eslint-disable-next-line no-unused-vars
import mapboxMinimap from 'mapbox.minimap';

export default class Map {

  constructor(container) {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";
    this.map = new mapboxgl.Map({
        container, // container ID
        //style: 'mapbox://styles/mapbox/light-v10?optimize=true', //?optimize=true
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [-71.5, 19.0], // starting position [lng, lat]
        zoom: 7,
        //preserveDrawingBuffer: true,
        maxZoom: 14,
        //minZoom:
        //pitch: 55
    });

    this.map.on('load', () => {
      this._removeUnusedLayers();

      this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
      this._createMiniMap();
    })
  }



  zoomTo(selection) {
    var v2 = new mapboxgl.LngLatBounds([selection[0], selection[1]])
    this.map.fitBounds(v2, {
        linear: true,
        padding: {
            top: 10,
            bottom: 25,
            left: 15,
            right: 5
        },
        pitch: 0
    });
  }



  
  _createMiniMap() {
    this.minimap = new mapboxgl.Minimap({
      center: this.map.getCenter(),
      zoom: 6,
      togglePosition: 'topleft',
      style: "mapbox://styles/mapbox/light-v10"
    });
    this.map.addControl(this.minimap, 'bottom-right');
    this.minimap.toggle();
  }
  _removeUnusedLayers() {
    this.map.removeLayer('admin-1-boundary')
    this.map.removeLayer('road-label')
    this.map.removeLayer('road-number-shield')
    this.map.removeLayer('road-exit-shield')
    this.map.removeLayer("admin-1-boundary-bg")
    this.map.removeLayer('airport-label')
  }
}
