<template>
  <div class="">
    <v-row dense justify="center">
      <v-col offset="3" cols="3">
        <h2 class="country-profile-header">Country profile</h2>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="activeCountry"
          :items="filteredCountries"
          label="Country"
          item-text="Country"
          item-value="id"
          outlined
        ></v-select>
      </v-col>
      <v-col class="ml-auto" cols="2">
        <v-select
          v-model="region"
          :items="regions"
          label="Region"
          outlined
        ></v-select>
      </v-col>
    </v-row>
  <v-row dense justify="center">
    <v-col cols="12">
      <country-info-bar
        :country="activeCountryProfile"
      />
    </v-col>
  </v-row>
  <v-row dense justify="center">
    <v-col cols="6">
      <v-select
        v-model="compareCuntries"
        :items="countries"
        item-text="Country"
        item-value="id"
        label="Overlay countries to compare indicator rank among SIDS"
        outlined
        multiple
      ></v-select>
    </v-col>
  </v-row>
    <v-row dense justify="center">
      <v-col cols="4">
        <profiles-spider-chart
          headerText="Climate Action"
          :graphOptions="graphOptions.Climate"
          pillarName="Climate"
          :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="4">
        <profiles-spider-chart
          headerText="Blue Economy"
          :graphOptions="graphOptions.Blue"
          pillarName="Blue"
          :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="4">
        <profiles-spider-chart
          headerText="Digital Transformation"
          :graphOptions="graphOptions.Digital"
          pillarName="Digital"
          :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="4">
        <profiles-spider-chart
          headerText="Multidimensional Vulnerability"
          :graphOptions="graphOptions.MVI2"
          pillarName="MVI2"
          :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="6">
        <profiles-finance
          :countryId="activeCountry"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CountryInfoBar from '@/components/CountryInfoBar.vue'
import ProfilesSpiderChart from '@/components/ProfilesSpiderChart.vue'
import ProfilesFinance from '@/components/ProfilesFinance.vue'
import * as d3 from 'd3';
import { mapState } from 'vuex';

export default {
  name: 'CountryProfiles',
  components: {
    CountryInfoBar,
    ProfilesSpiderChart,
    ProfilesFinance
  },
  data: () => ({
    activeCountry:null,
    compareCuntries:[],
    region:'All SIDS',
    regions:["All SIDS", "Caribbean", "AIS", "Pacific"],
    graphOptions:{
      Climate: {
        w: 200,
        h: 180,
        margin: { top: 50, right: 45, bottom: 30, left: 45 },
        levels: 5,
        spin: 0,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#0DB14B", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
        textColor: "#0DB14B"
      },
      Blue: {
        w: 200,
        h: 180,
        margin: { top: 50, right: 45, bottom: 30, left: 45 },
        levels: 5,
        spin: 0,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#0BC6FF", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
        legend: { title: 'Legend', translateX: 0, translateY: 0 },
        textColor: "#0BC6FF"
      },
      Digital: {
        w: 200,
        h: 180,
        margin: { top: 50, right: 45, bottom: 30, left: 45 },
        levels: 5,
        spin: 0,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#F58220", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
        textColor: "#F58220"
      },
      MVI2: {
        w: 320,
        h: 200,
        margin: { top: 70, right: 45, bottom: 100, left: 45 },
        maxValue: 80,
        levels: 4,
        spin: 0,
        textFormat: 1.2,
        opacityArea: 0.2,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#8f0045 ", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
        textColor: "#9e0909"
      }
    },
  }),
  computed:{
    activeCountryProfile() {
      return this.countries.find(country => country.id === this.activeCountry);
    },
    graphCountriesProfiles() {
      return this.compareCuntries.concat([this.activeCountry]);
    },
    filteredCountries() {
      if(this.region === this.regions[0]) {
        return this.countries
      }
      return this.countries.filter(country => country['Region'] === this.region );
    },
    ...mapState({
      countries: state => state.countryList,
    })
  },
  created() {
    this.activeCountry = this.countries[0].id;
  }
}
</script>
<style media="screen">
  .country-profile-header {
    text-align: right;
    padding-top: 10px;
    margin-right: 10px;
  }
</style>
