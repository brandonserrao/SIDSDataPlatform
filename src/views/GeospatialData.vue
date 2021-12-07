<template>
  <div class="map-container">
    <map-dataset-controller class="data-controller"/>
    <div id="map">

    </div>
  </div>
</template>

<script>

import names from '@/gis/static/names';
import GIS from '@/gis';
import MapDatasetController from '@/components/MapDatasetController';
// @ is an alias to /src

export default {
  name: 'GeospatialData',
  data() {
    return {
      names: names,
      map:null
    }
  },
  components: {
    MapDatasetController
  },
  methods: {
    selectCountry(selection) {
      this.map.zoomTo(selection);
    }
  },
  mounted() {
    this.map = new GIS('map');
  }
}
</script>
<style media="screen">
  #map{
    height: 100vh;
    width: 100%;
  }
  .map-container {
    position: relative;
    padding: 0 !important
  }
  .data-controller {
    position: absolute;
    left: 2em;
    top:2em;
    width: 400px;
    z-index: 999;
  }
</style>
