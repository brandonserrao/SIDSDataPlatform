<template>
  <div class="choro">
    <h4 class="text-center" v-if="page!=='global'">
      {{activeIndicatorsMeta.indicator}}
      ({{activeIndicatorsMeta.units}})
    </h4>
    <div id="choro_legend_container">
      <img id="regionLegend" src="@/assets/media/choro-legend.jpeg" style="margin-top:-15">
    </div>
    <div class="spiderbox" style="height:0;margin:0;">
      <div id="indexSpider" class="radarChart" style="text-align:center;height:0"></div>
    </div>
    <div id="choro_map_container">

    </div>
    <div id="timeSeriesContainer">
      <!-- <div class="timeSeriesTooltip"></div> -->
    </div>
  </div>
</template>

<script>
import service from '@/services'
import { mapState } from 'vuex';
import Choro from '@/choro';

export default {
  name: 'IndicatorsChoroChart',
  data: function () {
    return {
      choro:null
    }
  },
  props:['indicatorCode', 'region', 'page', 'chartType', 'sorting', 'mviCodes', 'year'],
  computed: {
    ...mapState({
      profileData: state => state.indicators.profileData,
      indicatorMeta: state => state.indicators.indicatorsMeta,
      activeIndicatorData: state => state.indicators.activeIndicatorData
    }),
    activeIndicatorsMeta() {
      return this.indicatorMeta[this.indicatorCode] || this.indicatorMeta['hdr-137506']
    }
  },
  methods:{
    async initChart() {
      let sidsXML = await service.loadSidsSVG();
      let mapLocations = await service.loadMapLocations();

      this.choro = new Choro({
        viz:this.chartType,
        sidsXML,
        mapLocations,
        indicatorCode:this.indicatorCode,
        profileData: this.profileData,
        page:this.page,
        year: this.year,
        data: this.activeIndicatorData,
        clickCallback:this.counntryClickCallback,
        selectedIndis:this.mviCodes,
        vizContainerWidth:(document.body.clientWidth - 40) > 800 ? 800 : (document.body.clientWidth - 40),
        vizContainerHeight:(document.body.clientWidth - 40) > 800 ? 580 : 1360,
        mapContainerSelector: '#choro_map_container',
        legendContainerSelector:'#choro_legend_container'
      })
    },
    counntryClickCallback(countryCode) {
      this.$router.push({path:`/country-profiles/${countryCode}`})
    }
  },
  async mounted() {
    await this.initChart()
  },
  watch:{
    page() {
      this.choro && this.choro.updatePageType({
        page: this.page,
        chartType: this.chartType,
        code: this.indicatorCode,
        year: this.year,
        data: this.activeIndicatorData
      });
    },
    chartType() {
      if(this.choro && this.page === this.choro.page) {
        this.choro.updateVizType(this.chartType, this.activeIndicatorData);
      }
    },
    indicatorCode() {
      if(this.choro && this.page === this.choro.page) {
        this.choro.updateVizData(this.indicatorCode, this.activeIndicatorData);
      }
    },
    region() {
      if(this.choro && this.page === this.choro.page) {
        this.choro && this.choro.updateCountryTypeFilterType(this.region);
      }
    },
    sorting() {
      if(this.choro && this.page === this.choro.page) {
        this.choro && this.choro.updateSortingType(this.sorting);
      }
    },
    mviCodes () {
      if(this.choro && this.page === this.choro.page) {
        this.choro && this.choro.updateMviCodes(this.mviCodes);
      }
    },
    year() {
      if(this.choro && this.page === this.choro.page) {
        this.choro.updateVizYear(this.year)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* style.css */
.allSids {
  fill: #fee391;
  stroke: #333;
  stroke-width: 1px;
  filter: drop-shadow(1px 1px 0px purple);
}

.countryHover {
  fill: #91eefe;
  filter: drop-shadow(1px 1px 0px purple);
  cursor: pointer;
}

.shadow {
  filter: drop-shadow(1px 1px 0px black);
}

.countryHighlight {
  fill: #fec44f;
}

.region.NI {
  fill: #aaa;
  stroke: #aaa;
}

/* Colors taken from colorbrewer2.org - blue */
.b0-9 {
  fill: #f7fbff;
}

.b1-9 {
  fill: #deebf7;
}

.b2-9 {
  fill: #c6dbef;
}

.b3-9 {
  fill: #9ecae1;
}

.b4-9 {
  fill: #6baed6;
}

.b5-9 {
  fill: #4292c6;
}

.b6-9 {
  fill: #2171b5;
}

.b7-9 {
  fill: #08519c;
}

.b8-9 {
  fill: #08306b;
}

/* Colors taken from colorbrewer2.org - red */
.r0-9 {
  fill: #fff5f0;
}

.r1-9 {
  fill: #fee0d2;
}

.r2-9 {
  fill: #fcbba1;
}

.r3-9 {
  fill: #fc9272;
}

.r4-9 {
  fill: #fb6a4a;
}

.r5-9 {
  fill: #ef3b2c;
}

.r6-9 {
  fill: #cb181d;
}

.r7-9 {
  fill: #a50f15;
}

.r8-9 {
  fill: #67000d;
}

/* Colors taken from colorbrewer2.org - green */
.g0-9 {
  fill: #f7fcf5;
}

.g1-9 {
  fill: #e5f5e0;
}

.g2-9 {
  fill: #c7e9c0;
}

.g3-9 {
  fill: #a1d99b;
}

.g4-9 {
  fill: #74c476;
}

.g5-9 {
  fill: #41ab5d;
}

.g6-9 {
  fill: #238b45;
}

.g7-9 {
  fill: #006d2c;
}

.g8-9 {
  fill: #00441b;
}

.choroText {
  text-anchor: middle;
  color: black;
}
.spiderbox {
  position: relative;
  z-index: 5;
}
#choro_legend_container {
  margin: 0;
  padding: 0;
}

#choro_map_container svg {
  margin-top: 5px;
  margin-bottom: -5px;
  padding-bottom: 0px;
  padding-top: 10px;
  overflow: visible;
}

.indicatorFilter {
  margin: 0;
  text-align: center;
  padding: 0;
  margin-bottom: 5px;
}

#indicatorSubCategorySelect, #indicatorSubCategorySelect2 {
  font-size: 14px;
  height: 30px;
  width: 100%;
}

#indicatorCategorySelect, #indicatorCategorySelect2 {
  font-size: 16px;
  height: 40px;
  margin-top: 28px;
  width: 100%;
}

#indicatorSelectBox2 {
  display: none;
}

.listbox {
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}

.listbox ul {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.listbox li {
  padding: 4px;
  cursor: pointer;
}

.listbox li:hover {
  background-color: #bbb;
}

.listbox li.indiActive {
  background: #4db052;
  font-size: 14px;
  font-weight: bold;
}

.listbox li.indiActive2 {
  background: #b14cb6;
  font-size: 14px;
  font-weight: bold;
}

.listbox li {
  -webkit-transition: background-color 200ms linear;
  -moz-transition: background-color 200ms linear;
  -o-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}

.listbox::-webkit-scrollbar {
  width: 8px;
}

.listbox::-webkit-scrollbar-track {
  background: white;
}

#indicatorSelect {
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelect2 {
  width: 100%;
  height: 100px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelectorColumn {
  margin: 0;
  padding: 0;
}

.c008080 {
  fill: #008080;
}

.cF0A500 {
  fill: #F0A500;
}

.c97002B {
  fill: #97002B;
}

.nodata {
  fill: #F4F5F8;
}

#choroInfoBox p {
  font-size: 12px;
  text-align: left;
}

#choroIndiSource {
  padding: 0;
}

#choroInfoBox h4 {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

#choroInfoBox {
  height: 212px;
  margin: 0;
  padding: 0;
  padding: 12px;
  margin-top: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #e9e6e6;
  border: 0.5px solid gray;
}

#choroInfoBox::-webkit-scrollbar-track {
  background: #e9e6e6;
}

#choroInfoBox::-webkit-scrollbar {
  width: 8px;
}

.textNum, .textNumEnd {
  font-family: sans-serif;
  fill: black;
  font-size: 12px;
}

.choroLegendTitle {
  font-family: sans-serif;
  fill: black;
  font-size: 14px;
  font-weight: bold;
}

#indicatorExportDiv {
  float: right;
  margin-top: -50px;
}

#tooltipIndicatorContent {
  max-width: 350px;
}

#choro_legend_container {
  height: 45px;
  overflow: visible;
}

#choro-legend_region {
  height: 42px;
  margin-left: 120px;
  margin-top: 5px;
  padding: 0;
}

#countryDataPanel h2 {
  padding-top: 40px;
}

.timeSeriesTooltip {
  position: absolute;
  background-color: #f5f5f5;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
}
#timeSeriesContainer {
  width: 900px;
  display:none;
}

@media all and (max-width:960px) {
  #timeSeriesContainer {
    width: 100%;
    display:none;
  }
}
/*# sourceMappingURL=vizEngine.css.map */

</style>
