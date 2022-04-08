<template>
  <div class="mt-xs-0 mt-sm-0 mt-md-5 mt-lg-5 mt-xl-5">
    <v-row class="d-none mb-3 d-flex-print">
      <v-col cols="3">
        <img
          class="printed-Logo"
          src="@/assets/media/RFSIDS-dark.png"
        >
      </v-col>
      <v-col cols="6">
        <v-row dense>
          <v-col>
            <h2 class="printout-header text-center"><b>{{activeCountry.name}}</b> Country profile</h2>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <h4 class="printout-subheader text-center">UNDP SIDS Data Platform</h4>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="profile-header-row d-none-print" :style="isMobile ? {'background-image': `url(${require(`@/assets/media/country-photos/${activeCountryId}.jpg`)})`} : {}" justify="center">
      <v-col cols="12" offset-md="1" md="4" offset-lg="3" lg="3">
        <h2 class="page-header country-profile-header">Country profile</h2>
      </v-col>
      <v-col cols="10" md="4" lg="3" class="select-column">
        <v-select
          rounded
          class="country-select"
          :value="activeCountryId"
          @change="selectCountry"
          :items="sidsListFilteredNoAverage"
          hide-selected
          menu-props='{auto:false}'
          item-text="name"
          item-value="id"
          outlined
          hide-details
        >
          <template  slot="item" slot-scope="data">
            <div>
              <i
                class="flag-icon select_icon"
                :class="'flag-icon-' + flagGodes[data.item.id]"
              ></i>
              {{ data.item.name }}
            </div>
          </template>
        </v-select>
      </v-col>
      <v-col class="ml-auto d-none d-md-block" md="2">
        <div class="select">
          <v-select
            rounded
            dense
            v-model="region"
            :items="regions"
            outlined
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-xs-0 mt-sm-0" justify="center" dense>
      <v-col class="pt-xs-0 pt-sm-0" cols="12">
        <country-info-bar
          :profile="activeCountryProfile.Profile"
          :id="activeCountryId"
          :name="activeCountry.name"
        />
      </v-col>
    </v-row>
    <v-row class="d-none d-md-flex d-none-print" justify="center">
      <v-col cols="11" md="6">
        <div class="select">
          <v-select
            rounded
            :value="compareIdsList"
            :items="sidsListFiltered"
            item-text="name"
            item-value="id"
            placeholder="Overlay countries to compare indicator rank"
            @change="setCompareCountries"
            chips
            outlined
            hide-selected
            multiple
            dense
            hide-details
          >
            <template #selection="{ item, index }">
              <v-chip
                class="muliselect-chip"
                close
                @click:close="removeCountry(item.id)"
                :style="getChipStyle(index)"
                :color="getColor(index)">
                {{item.name}}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
            <i
              class="flag-icon select_icon"
              :class="'flag-icon-' + flagGodes[data.item.id]"
            ></i>
            {{ data.item.name }}
            </template>
          </v-select>
        </div>
      </v-col>
      <v-col class="d-flex align-center" md="1">
        <p class="mt-auto mb-auto">among</p>
      </v-col>
      <v-col cols="11" md="3" lg="2">
        <div class="select">
          <v-select
            rounded
            v-model="rankType"
            :items="rankTypes"
            item-text="name"
            item-value="id"
            outlined
            dense
            hide-details
          >
          </v-select>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="graphRankData && graphValueData" class="d-flex-print d-none d-md-flex justify-print-space-between" justify="center">
      <template v-for="(pillar, index) in pillars">
        <v-col cols="4" md="6" lg="4" :class="{'printing-6':pillar==='MVI'}" :key="pillar">
          <profiles-spider-chart
            :graphOptions="graphOptions[pillar]"
            :pillarName="pillar"
            :ranks="graphRankData[pillar]"
            :values="graphValueData[pillar]"/>

          <v-row dense v-if="index === 3" class="mvi-print-desc mb-0 d-none d-print-flex">
            <v-col class="mt-0 mb-0" cols="12">
              <p class="mt-0 mb-0 text-center">
                Values for each indicator for vulnerability are normalized among all countries with available data on a scale from 0 to 100
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="index === 2" class="d-none d-print-block mt-0 mb-0" :key="`${pillar}des`" cols="12">
          <p class="mt-0 mb-0 text-center">Values for radar charts for each of the pillars of the SIDS Offer are displayed by rank among AIS countries for visualization purposes</p>
        </v-col>
      </template>
      <v-col class="printing-6" cols="4" md="6" lg="4">
        <profiles-finance
          :countryId="activeCountryId"/>
      </v-col>
    </v-row>
    <v-row justify="center" class="d-none-print d-md-none">
      <v-col cols="11">
        <v-tabs
          v-model="tab"
          show-arrows
          center-active
          grow>
          <v-tab v-for="tab in tabs" :key="tab">
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-items class="mt-4 graph-tabs" v-model="tab">
          <v-tab-item  v-for="pillar in pillars" :key="pillar">
            <profiles-spider-chart
              :graphOptions="graphOptions[pillar]"
              :pillarName="pillar"
              :ranks="graphRankData[pillar]"
              postfix="mobile"
              :values="graphValueData[pillar]"/>
          </v-tab-item>
          <v-tab-item>
            <profiles-finance
              :countryId="activeCountryId"/>
          </v-tab-item>
        </v-tabs-items>

      </v-col>
    </v-row>
    <v-row class="d-flex d-none-print d-md-none" justify="center">
      <v-col cols="11" md="6">
        <div class="select">
          <v-select
            rounded
            :value="compareIdsList"
            :items="sidsListFiltered"
            item-text="name"
            item-value="id"
            placeholder="Overlay countries to compare indicator rank"
            @change="setCompareCountries"
            chips
            outlined
            hide-selected
            multiple
            dense
            hide-details
          >
            <template #selection="{ item, index }">
              <v-chip
                class="muliselect-chip"
                close
                @click:close="removeCountry(item.id)"
                :style="getChipStyle(index)"
                :color="getColor(index)">
                {{item.name}}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
            <i
              class="flag-icon select_icon"
              :class="'flag-icon-' + flagGodes[data.item.id]"
            ></i>
            {{ data.item.name }}
            </template>
          </v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex d-none-print d-md-none" justify="center">
      <v-col cols="3" class="d-flex align-center" md="1">
        <p class="mt-auto mb-auto">among</p>
      </v-col>
      <v-col cols="8" md="3" lg="2">
        <div class="select">
          <v-select
            rounded
            v-model="rankType"
            :items="rankTypes"
            item-text="name"
            item-value="id"
            outlined
            dense
            hide-details
          >
          </v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-none d-none-print d-md-flex" justify="center">
      <v-col cols="2">
        <v-menu
          content-class="d-none-print"
          offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              class="ma-2 d-none-print"
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              Export
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group>
              <v-list-item @click="exportCSV">
                <v-list-item-title>Summary CSV</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportPDF">
                <v-list-item-title>Summary PDF</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <p class="print-footer d-none d-print-block">
      Live version and links to original data sources available at
      <a :href="`https://data.undp.org/sids/${activeCountryId}`">https://data.undp.org/sids/{{activeCountryId}}</a>
    </p>
  </div>
</template>

<script>
import flagGodes from '@/assets/flagCodes.js'

import CountryInfoBar from '@/components/CountryInfoBar.vue'
import ProfilesSpiderChart from '@/components/ProfilesSpiderChart.vue'
import ProfilesFinance from '@/components/ProfilesFinance.vue'
import * as d3 from 'd3';
import store from '@/store'
import { mapState } from 'vuex';

export default {
  name: 'CountryProfiles',
  props:['compareIdsList', 'activeCountryId'],
  components: {
    CountryInfoBar,
    ProfilesSpiderChart,
    ProfilesFinance
  },
  data: () => ({
    flagGodes,
    region:'All SIDS',
    regions:["All SIDS", "Caribbean", "AIS", "Pacific"],
    rankType: 'sids',
    rankTypes: [
      {
        name:'Globally',
        id:'global'
      },{
        name:'Regionally',
        id:'region'
      },{
        name:'SIDS counties',
        id:'sids'
      }
    ],
    colorScheme: ["#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"],
    pillars:['Climate', 'Blue', 'Digital', 'MVI'],
    tab:'Climate',
    tabs:['Climate','Blue Economy','Digital Transformation','Vulnerability','Finance'],
    rgbaColorScheme:['rgba(237, 201, 81, 0.4)','rgba(204, 51, 63, 0.4)','rgba(0, 160, 176, 0.4)','rgba(255, 255, 255, 0.4)'],
    graphOptions:{
      Climate: {
        header:'Climate Action',
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
        header:'Blue Economy',
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
        header:'Digital Transformation',
        w: 200,
        h: 180,
        margin: { top: 50, right: 45, bottom: 30, left: 45 },
        levels: 5,
        spin: 0,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#F58220", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
        textColor: "#F58220"
      },
      MVI: {
        header:'Multidimensional Vulnerability',
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
    ...mapState({
      sidsList: state => state.profiles.sidsList,
      profiles: state => state.profiles.profiles,
      indicatorsMetadata: state => state.profiles.indicatorsMetadata
    }),
    sidsListFiltered() {
      if(this.region === 'All SIDS') {
        return this.sidsList
      } else {
        return this.sidsList.filter(country => {
          return country.region === this.region ||
            this.compareIdsList.includes(country.id) ||
            country.id === this.activeCountryId
        })
      }
    },
    sidsListFilteredNoAverage(){
      return this.sidsListFiltered.filter(country => {
        return !country.average
      })
    },
    graphValueData() {
      let result = {};
      let countriesList = [this.activeCountryId, ...this.compareIdsList];
      this.pillars.map(pillar => {
        result[pillar] = countriesList.map(countyId => {
          let countyAxes = this.profiles[countyId][pillar].map(axis => {
            return {
              axis: this.indicatorsMetadata[axis.axis].indicator,
              value: axis.value,
              code: axis.axis
            }
          })
          return {
            name: countyId,
            axes: countyAxes
          }
        })
      })
      return result
    },
    graphRankData() {
      let result = {};
      let countriesList = [this.activeCountryId, ...this.compareIdsList];
      this.pillars.map(pillar => {
        result[pillar] = countriesList.map(countyId => {
          let countyAxes = this.profiles[countyId][pillar].map(axis => {
            let rank = this.rankType + 'Rank'
            return {
              axis: this.indicatorsMetadata[axis.axis].indicator,
              value: axis[rank] || axis.value,
              code: axis.axis
            }
          })
          return {
            name: countyId,
            axes: countyAxes
          }
        })
      })
      return result
    },
    activeCountryProfile() {
      return this.profiles[this.activeCountryId];
    },
    activeCountry() {
      return this.sidsList.find(county => county.id === this.activeCountryId);
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
    },
  },
  methods:{
    exportPDF() {
      window.print();
    },
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
        for (let indicator in this.profiles[this.activeCountryId][pillarName]) {
          let indicatorFull = this.profiles[this.activeCountryId][pillarName][indicator]
          let newIndi = {}
          newIndi.axis = this.indicatorsMetadata[indicatorFull.axis].indicator.replace(/,/g, '')
          newIndi.source = this.indicatorsMetadata[indicatorFull.axis] && this.indicatorsMetadata[indicatorFull.axis].source ?
          this.indicatorsMetadata[indicatorFull.axis].source.replace(/,/g, '') :
          '';
          [this.activeCountryId, ...this.compareIdsList].map(countryId => {
            newIndi[countryId] = this.profiles[countryId][pillarName][indicator].value
          })
          countryExport.push(newIndi)
        }
      }

      function generateAxisDataCVS(pillarName) {
        for (let indicator in this.profiles[this.activeCountryId][pillarName]) {
          let indicatorFull = this.profiles[this.activeCountryId][pillarName][indicator]
          let newIndi = {}
          newIndi.axis = this.indicatorsMetadata[indicatorFull.axis].indicator.replace(/,/g, '')
          newIndi.source = this.indicatorsMetadata[indicatorFull.axis] && this.indicatorsMetadata[indicatorFull.axis].source ?
          this.indicatorsMetadata[indicatorFull.axis].source.replace(/,/g, '') :
          '';
          [this.activeCountryId, ...this.compareIdsList].map(countryId => {
            newIndi[countryId] = this.profiles[countryId][pillarName][indicator].value
          })
          countryExport.push(newIndi)
        }
      }

      let countryExport = []
      const pillars = ["MVI", "ClimateRank", "BlueRank", "DigitalRank", "Blue", "Climate", "Digital"];
      generateTextDataCVS.call(this, 'Profile');
      pillars.map(pillar => {
        generateAxisDataCVS.call(this, pillar)
      });
      generateTextDataCVS.call(this, 'Finance');

      let headers = {};
      headers.axis = "Indicator",
      headers.source = "Source";
      [this.activeCountryId, ...this.compareIdsList].map(countryId => {
        headers[countryId] = this.sidsList.find(sids => sids.id === countryId).name
      })
      exportCSVFile(headers, countryExport, "sids_profile_data", "")
    },
    selectCountry(country) {
      this.$router.push({
        name:'Country Profiles',
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
    },
    removeCountry(countryId) {
      this.setCompareCountries(this.compareIdsList.filter(compareCountryId => compareCountryId !== countryId))
    },
    getColor(index) {
      return this.colorScheme[index%4];
    },
    getChipStyle(index) {
      return `background-color:${this.rgbaColorScheme[index%4]}`;
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch('profiles/getCountryProfile', to.params.country);
      if(to.query.compare) {
        await Promise.all(to.query.compare.split(',').map(async (id) => {
          await store.dispatch('profiles/getCountryProfile', id);
        }));
      }
      next()
    } catch (e) {
      next(from)
    }
  },
  async beforeRouteUpdate(to, from, next) {
    try {
      await store.dispatch('profiles/getCountryProfile', to.params.country);
      if(to.query.compare) {
        await Promise.all(to.query.compare.split(',').map(async (id) => {
          await store.dispatch('profiles/getCountryProfile', id);
        }));
      }
      next()
    } catch (e) {
      next(from)
    }

  },
}
</script>
<style media="screen">
  .country-profile-header {
    text-align: right;
    margin-right: 10px;
  }
  .country-select {
    font-size: 18px !important;
    font-weight: bold;
  }
  .country-select .v-input__append-inner{
    margin-top: 12px !important;
  }
  .select_icon {
    display: inline-block;
    margin-right: 10px;
  }
  .muliselect-chip {
    border-style: solid;
    border-width: 2px;
  }
  .profile-header-row{
    background-size: cover;
  }
  .graph-tabs {
    background-color: transparent !important;
  }
 @media all and (max-width:960px) {
  .country-profile-header {
    margin: 0px auto 130px;
    color: #F2F2F3 !important;
    text-align: center;
    text-shadow: 0px 0px 2px rgb(0 0 0 / 60%);
  }
  .menu-col {
    width: 0 !important;
  }
  .select-column {
    margin-bottom: 15px;
  }
 }
 .printed-Logo {
   max-width: 100%;
 }
 .printout-header{
   font-weight: 400;
   font-size: 26px;
   margin-top: -7px !important;
 }
 .printout-subheader{
   font-weight: 600;
   font-size: 20px;
   margin-top: -3px !important;
 }
 @media print {
   .printing-6 {
     flex: 0 0 50% !important;
     max-width: 50% !important;
   }
   .mvi-print-desc {
     margin-top: -50px !important;
   }
   .print-footer {
     position: fixed;
     width: 90%;
     left: 0;
     bottom: 0px;
   }
 }
</style>
