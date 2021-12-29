<template>
  <div class="mt-5">
  <v-row>
    <v-col cols='3'>
      <indicators-nav :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate"/>
    </v-col>
    <v-col cols='9'>
      <v-row>
        <v-col cols='12'>
          <h2 class="page-header">Development Indicators</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='12'>
          <v-tabs
            :value="activeTab"
            class="tabs indicators-slider"
          >
            <v-tab v-for="tab in menuBar" :key="tab.name" @change="transitionTo(tab.chartType)">{{tab.name}}</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='12'>
          <indicators-choro-chart/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import IndicatorsNav from '@/components/IndicatorsNav.vue'
import IndicatorsChoroChart from '@/components/IndicatorsChoroChart.vue'

export default {
  name: 'DevelopmentIndicators',
  props:['chartType', 'indicator'],
  data: function() {
    return {
      menuBar:[{
        name:'Choropleth',
        chartType:'choro'
      },{
        name:'Bar chart',
        chartType:'bars'
      },{
        name:'Global view',
        chartType:'global'
      },{
        name:'Time series',
        chartType:'series'
      }]
    }
  },
  components: {
    IndicatorsNav,
    IndicatorsChoroChart
  },
  computed: {
    activeTab() {
      return this.menuBar.findIndex(menuItem => menuItem.chartType === this.chartType)
    },
  },
  methods: {
    transitionTo(chartType) {
      this.$router.push({path:`/development-indicators/${this.indicator}/${chartType}`})
    },
    indicatorUpdate(indicator) {
      this.$router.push({path:`/development-indicators/${indicator['Indicator Code']}/${this.chartType}`})
    }
  }
}
</script>
<style media="screen">
  .transition {
    transition: 500ms;
  }
  .left {
    margin-left: 80px;
  }
  .no-left {
    transition: 500ms;
    margin-left: 0px;
  }
  .indicators-slider {
    max-width: 637px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
