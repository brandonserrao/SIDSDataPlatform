<template>
  <div class="">
    <v-select
      :items="names"
      item-text="NAME_0"
      item-value="bb"
      label="Slelct country"
      @change="selectCountry"
      solo
    ></v-select>
    <div id="map">

    </div>
  </div>
</template>

<script>

import names from '@/gis/static/names';
import GIS from '@/gis'
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
</style>
