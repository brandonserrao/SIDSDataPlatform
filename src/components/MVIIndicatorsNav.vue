<template>
  <div class="mvi-indicators-nav">
    <v-card flat>
      <v-list dense v-for="indicatorCatery in catIndicators"
        :key="indicatorCatery.category"
        flat
      >
      <v-subheader :style="'background-color:'+indicatorCatery.color" class="block-subheader">{{indicatorCatery.category}}</v-subheader>
      <v-list-item dense
        v-for="indicator in indicatorCatery.indicators"
        :key="indicator.name"
      >
        <v-list-item-action>
          <v-checkbox
            v-model="selectedIndicators"
            @change="updateValue()"
            :value="indicator.code"
            :ripple="false"
          ></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{indicator.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    </v-card>
  </div>
</template>
<script>
// import { mapState } from 'vuex';

export default {
  name: 'MBIIndicatorsNav',
  // props:['activeIndicatorCode'],
  data() {
    return {
      selectedIndicators:[
        "mvi-ldc-VIC-Index-environmental" ,
        "mvi-ldc-AFF-Index-environmental" ,
        "mvi-ldc-DRY-Index-geographic" ,
        "mvi-ldc-REM-Index-geographic" ,
        "mvi-ldc-LECZ-Index-geographic",
        "mvi-ldc-XCON-Index-economic",
        "mvi-ldc-XIN-Index-economic",
        "mvi-ldc-AIN-Index-economic",
        "mvi-ST.INT.RCPT.XP.ZS-financial",
        "mvi-BX.TRF.PWKR.DT.GD.ZS-financial",
        "mvi-BX.KLT.DINV.WD.GD.ZS-financial"
      ],
      catIndicators:[
        {
          category:'Environmental',
          color:'#00A0B0',
          indicators:[{
            code:'mvi-ldc-VIC-Index-environmental',
            name:'Victims of Disasters'
          },{
            code:'mvi-ldc-AFF-Index-environmental',
            name:'Agriculture and Fishing (% of GDP)'
          }]
        },{
          category:'Geographic',
          color:'#CC333F',
          indicators:[{
            code:'mvi-ldc-REM-Index-geographic',
            name:'Remoteness'
          },
          {
            code:'mvi-ldc-DRY-Index-geographic',
            name:'Population in Drylands',
          },
          {
            code:'mvi-ldc-LECZ-Index-geographic',
            name:'% Population in Coastal Zones'
          }]
        },{
          category:'Economic',
          color:'#f0db3a',
          indicators:[{
            code:'mvi-ldc-XCON-Index-economic',
            name:'Export Concentration'
          },{
            code:'mvi-ldc-XIN-Index-economic',
            name:'Export Instability'
          },{
            code:'mvi-ldc-AIN-Index-economic',
            name:'Agricultural Instability'
          }]
        },{
          category:'Financial',
          color:'#0DB14B',
          indicators:[{
            code:'mvi-ST.INT.RCPT.XP.ZS-financial',
            name:'Tourism Revenue (% of Exports)'
          },{
            code:'mvi-BX.TRF.PWKR.DT.GD.ZS-financial',
            name:'Remittances (% of GDP)'
          },{
            code:'mvi-BX.KLT.DINV.WD.GD.ZS-financial',
            name:'FDI Inflowd (% of GDP)'
          }]
        }
      ]
    }
  },
  computed: {
  },
  methods:{
    updateValue() {
      this.emitValue()
    },
    emitValue() {
      return this.$emit('MviIndicatorsChange', this.selectedIndicators)
    },
  },
  mounted() {
    this.emitValue()
  }
}
</script>

<style>
.mvi-indicators-nav .v-list-item__action {
  margin: 0 !important;
}
</style>
