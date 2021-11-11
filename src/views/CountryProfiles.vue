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
        <!-- <profiles-spider-chard> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CountryInfoBar from '@/components/CountryInfoBar.vue'
// import ProfilesSpiderChart from '@/components/ProfilesSpiderChart.vue'
import { mapState } from 'vuex';

export default {
  name: 'CountryProfiles',
  components: {
    CountryInfoBar,
    // ProfilesSpiderChart
  },
  computed:{
    activeCountryProfile() {
      return this.countries.find(country => country.id === this.activeCountry);
    },
    filteredCountries() {
      if(this.region === this.regions[0]) {
        return this.countries
      }
      console.log()
      return this.countries.filter(country => country['Region'] === this.region );
    },
    ...mapState({
      countries: state => state.countryList,
    })
  },
  data: () => ({
    activeCountry:null,
    region:'All SIDS',
    regions:["All SIDS", "Caribbean", "AIS", "Pacific"]
  }),
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
