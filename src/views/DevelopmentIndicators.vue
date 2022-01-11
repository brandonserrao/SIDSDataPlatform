<template>
  <div class="mt-5">
  <v-row>
    <v-col v-if="page==='devIdictors'" cols='3'>
      <indicators-nav :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate"/>
    </v-col>
    <v-col v-else cols='3'>
      <mvi-indicators-nav @MviIndicatorsChange="MVIindicatorUpdate"/>
    </v-col>
    <v-col cols='9'>
      <v-row>
        <v-col cols='12'>
          <h2 class="page-header">Development Indicators</h2>
        </v-col>
      </v-row>
      <v-row jusify="center">
        <v-col cols='12' md="12" xl="12">
          <v-tabs
            v-if="indicator!=='region' || page==='mvi'"
            :value="activeTab"
            class="tabs indicators-slider"
          >
            <v-tab v-for="tab in menuBar[page]" :key="tab.name" @change="transitionTo(tab.chartType)">{{tab.name}}</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row jusify="end">
        <v-col v-if="chartType === 'bars'" cols='12' md='6' lg='4'>
          <v-tabs
            v-model="sorting"
            class="tabs tabs-slider"
          >
            <v-tab key="rank" value="rank">Rank</v-tab>
            <v-tab key="region" value="region">Region</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='12'>
          <indicators-choro-chart :mviCodes="mviCodes" :sorting="sortingName" :page="page" :chartType="chartType" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import IndicatorsNav from '@/components/IndicatorsNav.vue'
import MVIIndicatorsNav from '@/components/MVIIndicatorsNav.vue'
import IndicatorsChoroChart from '@/components/IndicatorsChoroChart.vue'

export default {
  name: 'DevelopmentIndicators',
  props:['chartType', 'indicator', 'page'],
  data: function() {
    return {
      mviCodes:["mvi-ldc-VIC-Index-environmental"
,"mvi-ldc-AFF-Index-environmental"
,"mvi-ldc-REM-Index-geographic"
,"mvi-ldc-LECZ-Index-geographic"
,"popDry"
,"mvi-ldc-XCON-Index-economic"
,"mvi-ldc-XIN-Index-economic"
,"mvi-ldc-AIN-Index-economic"
,"mvi-ST.INT.RCPT.XP.ZS-financial"
,"mvi-BX.TRF.PWKR.DT.GD.ZS-financial"
,"mvi-BX.KLT.DINV.WD.GD.ZS-financial"],
      sorting:'rank',
      menuBar:{
        devIdictors: [{
          name:'Choropleth',
          chartType:'choro'
        },{
          name:'Bar chart',
          chartType:'bars'
        },{
          name:'Global view',
          chartType:'global'
        },
        // {
        //   name:'Time series',
        //   chartType:'series'
        // }
      ],
        mvi: [{
          name:'Info',
          chartType:'info'
        },{
          name:'Spider',
          chartType:'spider'
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
    }
  },
  components: {
    IndicatorsNav,
    IndicatorsChoroChart,
    MviIndicatorsNav:MVIIndicatorsNav
  },
  computed: {
    sortingName() {
      if(this.sorting === 0) {
        return 'rank'
      } else {
        return 'region'
      }
    },
    activeTab() {
      return this.menuBar[this.page].findIndex(menuItem => menuItem.chartType === this.chartType)
    },
  },
  methods: {
    transitionTo(chartType) {
      if(this.page === 'mvi'){
        this.$router.push({path:`/vulnerability/${this.indicator}/${chartType}`})
      }
      else {
        this.$router.push({path:`/development-indicators/${this.indicator}/${chartType}`})
      }
    },
    indicatorUpdate(indicator) {
      this.$router.push({path:`/development-indicators/${indicator['Indicator Code']}/${this.chartType}`})
    },
    MVIindicatorUpdate(mviCodes){
      this.mviCodes = mviCodes;
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
