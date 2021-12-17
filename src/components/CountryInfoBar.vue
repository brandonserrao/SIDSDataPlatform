<template>
  <v-card flat class="overflow">
    <v-row dense>
      <v-col cols="4">
      <v-subheader class="info-bar_header block-header">{{country.Country}}</v-subheader>
        <v-list dense class="indicators-list"
        >
          <v-list-item
          >
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Population:'"></v-list-item-title>
              <v-list-item-subtitle>{{country.Population.toLocaleString()}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Region:'"></v-list-item-title>
              <v-list-item-subtitle>{{country.Region}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Official Language:'"></v-list-item-title>
              <v-list-item-subtitle>{{country['Official Language']}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Surface Area:'"></v-list-item-title>
              <v-list-item-subtitle>{{(country['Surface Area']).toLocaleString()}} km<sup>2</sup></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'HDI:'"></v-list-item-title>
              <v-list-item-subtitle>{{computeHDI(country['Human Development Index'])}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Income Group:'"></v-list-item-title>
              <v-list-item-subtitle>{{country['Income Classification']}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="'Country Office:'"></v-list-item-title>
              <v-list-item-subtitle>
                <a :href="country['Country Page']" target="_blank">{{country['Country Office']}}</a>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="p-0 d-flex align-center" cols="3">
        <img
          class="info-bar_map"
          :src="country.map"
        />
      </v-col>
      <v-col class="p-0 d-flex align-center" cols="5">
        <v-img
          cover
          max-height="250"
          :src="country.photo"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'CountryInfoBar',
  props: ['country'],
  methods: {
    computeHDI(hdi){
      let hdiNum=parseFloat(hdi),
      hdiClass = "No data";
      if(hdi>=.8){hdiClass="Very high human development"}
      else if(hdi>=0.7){hdiClass="High human development"}
      else if(hdi>=0.550){hdiClass="Medium human development"}
      else if(hdi>0){hdiClass="Low human development"}
      else { hdiClass="No data"; hdiNum="No data"}
      return `${hdiNum}, ${hdiClass}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indicators-list .one-line {
  flex-wrap: nowrap;
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.overflow {
  overflow: hidden;
}
.one-line_header {
  flex: 0 1 auto !important;
  margin-right: 8px !important;
  text-overflow: none;
  overflow:visible;
}
.info-bar_header {
  font-size: 18px;
  font-weight: bold;
}
.info-bar_map {
  max-height: 230px;
  max-width: 94%;
  margin: auto;
}
</style>
