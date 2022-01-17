<template>
  <div class="mt-5">
  <v-row dense>
    <v-col  class="d-none d-lg-block" v-if="page==='devIdictors'" cols='3'>
      <indicators-nav :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate"/>
    </v-col>
    <v-col  class="d-none d-lg-block" v-else cols='3'>
      <mvi-indicators-nav @MviIndicatorsChange="MVIindicatorUpdate"/>
    </v-col>
    <v-dialog
      v-model="dialog"
      width="400"
      :fullscreen = "isMobile"
      content-class="dialog-box"
      transition="dialog-right-transition"
    >
      <indicators-nav v-if="page==='devIdictors'" :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate"/>
      <mvi-indicators-nav v-else @close="dialog = !dialog" @MviIndicatorsChange="MVIindicatorUpdate"/>
    </v-dialog>

    <v-col md='12' lg='9'>
      <v-row dense >
        <v-col cols='12'>
          <h2 v-if="page!=='mvi'" class="page-header">
            Development Indicators
          </h2>
          <h2 v-else class="page-header">
            Towards a Multidimensional Vulnerability Index
          </h2>
        </v-col>
      </v-row>
      <v-row dense class="nav-tabs-row justify-center">
          <v-tabs
            v-if="indicator!=='region' || page==='mvi'"
            :value="activeTab"
            :grow="isMobile"
            :class="{
              'indicators-tabs' : page!=='mvi',
              'mvi-tabs' : page==='mvi'
            }"
            class="tabs tabs-small"
          >
            <v-tab v-for="(tab, index) in tabs" :value="index" :key="index" @change="transitionTo(tab.chartType)">{{tab.name}}</v-tab>
          </v-tabs>
          <v-btn
              class="d-block filter-button d-lg-none"
              rounded
              @click="dialog=!dialog"
              fab
              color="primary"
            >
            <v-icon>mdi-filter</v-icon>
          </v-btn>
      </v-row>
      <v-row dense jusify="end">
        <div v-if="chartType === 'bars' || chartType === 'spider'" class="sorting-row">
          <div class="input-label tabs-slider-label">
            Sort by:
          </div>
            <v-tabs
              v-model="sorting"
              class="tabs tabs-small tabs-slider sorting sorting-tabs"
            >
              <v-tab key="rank" value="rank">Rank</v-tab>
              <v-tab key="region" value="region">Region</v-tab>
            </v-tabs>
        </div>
        <div v-if="chartType === 'series'" class="sorting-row">
          <div class="select sorting sorting-select">
          <v-select
            rounded
            dense
            hide-details
            v-model="region"
            :items="regions"
            outlined
          ></v-select>
          </div>
        </div>
      </v-row>
      <v-row dense v-if="chartType !== 'info'">
        <v-col  v-if="chartType !== 'info'" cols='12'>
          <indicators-choro-chart :region="region" :mviCodes="mviCodes" :sorting="sortingName" :page="page" :chartType="chartType" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
      <v-row  v-else class="justify-center" >
        <v-col cols='10'>
          <h3>About this page:</h3>
          <p>
            The data from this paper is presented in a parametric interface with a customizable version of the MVI, as well as multiple forms of visualizations that allow for an analysis of the contributions of each indicator towards SIDS vulnerability. This supports comparisons of indices between countries and regions, as well as between the MVI and the Environmental Vulnerability Index (EVI) which is currently used as part of the three criteria for inclusion in the Least Developed Countries (LDC) category.
          </p>
          <p>
            The composite MVI is an average value of four dimensions of vulnerability: environmental, geographic, economic, and financial. Each of the dimensions is calculated as an average of the normalized indicators selected for that dimension. All data is from UNDESA and World Bank.
          </p>
          <h3>Background</h3>
          <p>
            In response to the unique context of SIDS and the acute lack of finance exacerbated by the COVID-19 pandemic, UNDP has developed a
            <a target="_blank" href="https://www.undp.org/publications/towards-multidimensional-vulnerability-index">
              <b>Multidimensional Vulnerability Index (MVI)</b>
            </a>
            to reflect traditional as well as emerging risks facing not only SIDS but all developing countries. The MVI responds to calls from SIDS for the reassessment the eligibility for concessional financing beyond income level to accurately capture the vulnerability SIDS face:
          </p>
          <ul>
            <li>
              In July and August 2020, the
              <a target="_blank" href="https://www.aosis.org/">
                <b>
                  Alliance of Small Island States (AOSIS)
                </b>
              </a> sent two letters to the Executive Office of the Secretary-General requesting efforts be made on linking of vulnerability to access to financing and expanding eligibility criteria beyond income-based indicators.
            </li>
            <li>
              In December, the
              <a target="_blank" href="https://undocs.org/en/A/RES/75/215">
                <b>SIDS Resolution (A/RES/75/215)</b>
              </a> was passed by the GA, paragraph 8.a of the Resolution makes a direct mention of the multidimensional vulnerability index and requests the Secretary-General to report progress on the development and use of the index. A milestone in the efforts to advocate for the development of a new index, UNDP did a significant amount of advocacy work in the lead up to its adoption including through briefings to the 2nd committee and G77.
            </li>
          </ul>

          <p>
            Using the MVI, the analysis in the discussion paper shows clearly that the majority of SIDS are far more vulnerable their income level alone would suggest. Using 11 indicators for 128 countries (including 34 SIDS), the MVI demonstrates that all but five SIDS are far more vulnerable than their income level would suggest. Furthermore, a simulation comparing SIDS to LDCs demonstrates that, if the MVI were used as a financing criterion (rather than just income per capita), SIDS on average would save 1.5% of their GDP per annum in interest payments.


          </p>
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
      dialog:false,
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
                ,"mvi-BX.KLT.DINV.WD.GD.ZS-financial"
      ],
      region: 'All',
      regions:[
        'All',
        'AIS',
        'Caribbean',
        'Pacific'
      ],
      sorting:'rank',
      menuBar:{
        devIdictors: [{
          name:'Choropleth',
          chartType:'choro'
        },{
          name:'Bar chart',
          chartType:'bars',
          mobile: true
        },{
          name:'Global view',
          chartType:'global'
        },
        {
          name:'Time series',
          chartType:'series',
          mobile: true
        }
      ],
        mvi: [{
          name:'Info',
          chartType:'info'
        },{
          name:'Spider',
          chartType:'spider'
        },{
          name:'Bar chart',
          chartType:'bars',
          mobile: true
        },{
          name:'Global view',
          chartType:'global'
        },
        {
          name:'Time series',
          chartType:'series',
          mobile: true
        }
      ]
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
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
    },
    tabs() {
      if(this.isMobile) {
        return this.menuBar[this.page].filter(bar => bar.mobile)
      }
      return this.menuBar[this.page]
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
    indicatorUpdate(indicatorCode) {
      this.$router.push({path:`/development-indicators/${indicatorCode}/${this.chartType}`})
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
  .nav-tabs-row {
    margin-top: -10px !important;;
  }
  .indicators-tabs {
    margin-bottom: auto;
    max-width: 638px;
    margin-left: auto;
    margin-right: auto;
  }
  .mvi-tabs {
    margin-bottom: auto;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .sorting-row{
    position: relative;
    width: 100%;
  }
  .tabs-slider-label{
    position: absolute;
    left: calc(100% - 222px);
    top: 12px;
  }
  .sorting-tabs {
    top: 28px;
  }
  .sorting{
    position: absolute;
    max-width: 224px;
    left: calc(100% - 224px);
  }
  .sorting-select {
    top: 12px;
  }
  .nav-tabs-row {
    min-height: 38px;
  }
  .radarChart .radar {
    margin-left: 125px;
    margin-right: 125px;
  }
  .dialog-box {
    background: #fff;
    padding: 10px;
    border-radius: 5px;
  }
  .filter-button {
    margin-left: auto;
    margin-right: 0;
  }
  @media all and (max-width:960px) {
    .indicators-tabs, .mvi-tabs {
      min-width: none;
      min-width: auto;
      max-width: 90%;
    }
    .sorting, .tabs-slider-label {
      position: static;
    }
  }
</style>
