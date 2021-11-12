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
        <profiles-spider-chart :graphOptions="graphOptions.Climate" :pillarName="'Climate'" :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="4">
        <profiles-spider-chart :graphOptions="graphOptions.Blue" :pillarName="'Blue'" :activeCountries="graphCountriesProfiles"/>
      </v-col>
      <v-col cols="4">
        <profiles-spider-chart :graphOptions="graphOptions.Digital" :pillarName="'Digital'" :activeCountries="graphCountriesProfiles"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CountryInfoBar from '@/components/CountryInfoBar.vue'
import ProfilesSpiderChart from '@/components/ProfilesSpiderChart.vue'
import * as d3 from 'd3';
import { mapState } from 'vuex';

export default {
  name: 'CountryProfiles',
  components: {
    CountryInfoBar,
    ProfilesSpiderChart
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
        color: d3.scaleOrdinal().range(["#0DB14B", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])
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
      },
      Digital: {
        w: 200,
        h: 180,
        margin: { top: 50, right: 45, bottom: 30, left: 45 },
        levels: 5,
        spin: 0,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#F58220", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])
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
