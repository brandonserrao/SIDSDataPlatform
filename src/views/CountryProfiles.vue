<template>
  <div class="mt-5">
    <v-row justify="center">
      <v-col offset="3" cols="3">
        <h2 class="country-profile-header">Country profile</h2>
      </v-col>
      <v-col cols="3">
        <v-select
          class="country-select"
          :value="country"
          @change="setCountry"
          :items="filteredCountries"
          label="Country"
          item-text="Country"
          item-value="id"
          outlined
          hide-details
        ></v-select>
      </v-col>
      <v-col class="ml-auto" cols="2">
        <v-select
          dense
          v-model="region"
          :items="regions"
          label="Region"
          outlined
        ></v-select>
      </v-col>
    </v-row>
  <v-row justify="center">
    <v-col cols="12">
      <country-info-bar
        :country="activeCountryProfile"
      />
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col cols="6">
      <v-select
        :value="compare"
        :items="filteredCountries"
        item-text="Country"
        item-value="id"
        label="Overlay countries to compare indicator rank among SIDS"
        @change="setCompareCountries"
        outlined
        multiple
        dense
        hide-details
      ></v-select>
    </v-col>
  </v-row>
    <v-row justify="center">
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
          :countryId="country"/>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-btn
          class="ma-2"
          @click="exportCSV"
          color="primary"
        >
          Export to CSV
        </v-btn>
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
  props:['compare', 'country'],
  components: {
    CountryInfoBar,
    ProfilesSpiderChart,
    ProfilesFinance
  },
  data: () => ({
    activeCountry:null,
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
      return this.countries.find(country => country.id === this.country);
    },
    graphCountriesProfiles() {
      return Array.from(new Set(this.compare.concat([this.country])));
    },
    filteredCountries() {
      if(this.region === this.regions[0]) {
        return this.countries
      }
      return this.countries.filter(country => country['Region'] === this.region );
    },
    ...mapState({
      countries: state => state.sids.countryList,
      keyMetadata: state => state.sids.keyMetadata,
      allKeyData: state => state.sids.allKeyData,
    })
  },
  methods:{
    exportCSV() {
      // TODO: move export to mixins
      function convertToCSV(objArray,note) {
          var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
          var str=""
          if(note!=""){
          str += '#'+note+'\r\n';}
          for (var i = 0; i < array.length; i++) {
              var line = '';
              for (var index in array[i]) {
                  if (line != '') line += ','
                  line += array[i][index];
              }
              str += line + '\r\n';
          }
          return str;
      }

      function exportCSVFile(headers, items, fileTitle,note) {
          const fileData = [headers].concat(items);
          // Convert Object to JSON
          var jsonObject = JSON.stringify(fileData);
          var csv = convertToCSV(jsonObject,note);
          var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
          var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, exportedFilenmae);
          } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                  // Browsers that support HTML5 download attribute
                  var url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", exportedFilenmae);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              }
          }
      }

      function generateTextDataCVS(pillarName) {
        for (let indicator in this.allKeyData[this.country][pillarName]) {
          let newIndi = {}
          newIndi.axis = indicator.replace(/,/g, '')
          newIndi.source = this.keyMetadata[newIndi.axis] && this.keyMetadata[newIndi.axis].sourceName ?
          this.keyMetadata[newIndi.axis].sourceName.replace(/,/g, '') :
          '';
          this.graphCountriesProfiles.map(countryId => {
            newIndi[countryId] = this.allKeyData[countryId][pillarName][indicator]
          })
          countryExport.push(newIndi)
        }
      }

      function generateAxisDataCVS(pillarName) {
        for (let indicator in this.allKeyData[this.country][pillarName]) {
          let newIndi = {}
          let el = this.allKeyData[this.country][pillarName][indicator]
          newIndi.axis = el.axis.replace(/,/g, '')
          newIndi.source = this.keyMetadata[newIndi.axis] && this.keyMetadata[newIndi.axis].sourceName ?
          this.keyMetadata[newIndi.axis].sourceName.replace(/,/g, '') :
          '';
          this.graphCountriesProfiles.map(countryId => {
            newIndi[countryId] = this.allKeyData[countryId][pillarName][indicator].value
          })
          countryExport.push(newIndi)
        }
      }

      let countryExport = []
      const pillars = ["MVI2", "ClimateRank", "BlueRank", "DigitalRank", "Blue", "Climate", "Digital"];
      generateTextDataCVS.call(this, 'Profile');
      pillars.map(pillar => {
        generateAxisDataCVS.call(this, pillar)
      });
      generateTextDataCVS.call(this, 'Finance');

      let headers = {}
      headers.axis = "Indicator"
      headers.source = "Source"
      this.graphCountriesProfiles.map(countryId => {
        headers[countryId] = this.allKeyData[countryId].Profile.Country
      })
      exportCSVFile(headers, countryExport, "sids_profile_data", "")
    },
    setCountry(country) {
      this.$router.push({
        params:{country},
        query: this.$route.query
      })
    },
    setCompareCountries(value) {
      this.$router.push({
        query: {
          compare: value.toString()
        }
      })
    }
  },
  created() {
    if(this.country === '') {
      this.setCountry(this.countries[0].id);
    }
  }
}
</script>
<style media="screen">
  .country-profile-header {
    text-align: right;
    padding-top: 10px;
    margin-right: 10px;
  }
  .country-select {
    font-weight: bold;
  }
</style>
