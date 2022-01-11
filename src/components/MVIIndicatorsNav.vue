<template>
  <div class="mvi-indicators-nav">
    <v-card flat>
      <v-list dense v-for="indicatorCatery in catIndicators"
        :key="indicatorCatery.category"
        flat
        >
      <v-subheader class="block-subheader">{{indicatorCatery.category}}</v-subheader>
      <v-list-item dense
        v-for="indicator in indicatorCatery.indicators"
        :key="indicator.name"
      >
        <v-list-item-action>
          <v-checkbox
            v-model="selectedIndicators"
            @change="updateValue()"
            :value="indicator.id"
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
      selectedIndicators:["victims" ,"agrGDP" ,"remote" ,"popLECZ" ,"popDry" ,"expConc" ,"expInst" ,"agrInst" ,"tourism" ,"remit" ,"fdi"],
      catIndicators:[
        {
          category:'Environmental',
          indicators:[{
            code:'mvi-ldc-VIC-Index-environmental',
            name:'Victims of Disasters',
            id:'victims'
          },{
            code:'mvi-ldc-AFF-Index-environmental',
            name:'Agriculture and Fishing (% of GDP)',
            id:'agrGDP'
          }]
        },{
          category:'Geographic',
          indicators:[{
            code:'mvi-ldc-DRY-Index-geographic',
            name:'Remoteness',
            id:'remote'
          },
          {
            code:'mvi-ldc-REM-Index-geographic',
            name:'Population in Drylands',
            id:'popLECZ'
          },
          {
            code:'mvi-ldc-LECZ-Index-geographic',
            name:'% Population in Coastal Zones',
            id:'popDry'
          }]
        },{
          category:'Economic',
          indicators:[{
            code:'mvi-ldc-XCON-Index-economic',
            name:'Export Concentration',
            id:'expConc'
          },{
            code:'mvi-ldc-XIN-Index-economic',
            name:'Export Instability',
            id:'expInst'
          },{
            code:'mvi-ldc-AIN-Index-economic',
            name:'Agricultural Instability',
            id:'agrInst'
          }]
        },{
          category:'Financial',
          indicators:[{
            code:'mvi-ST.INT.RCPT.XP.ZS-financial',
            name:'Tourism Revenue (% of Exports)',
            id:'tourism'
          },{
            code:'mvi-BX.TRF.PWKR.DT.GD.ZS-financial',
            name:'Remittances (% of GDP)',
            id:'remit'
          },{
            code:'mvi-BX.KLT.DINV.WD.GD.ZS-financial',
            name:'FDI Inflowd (% of GDP)',
            id:'fdi'
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
