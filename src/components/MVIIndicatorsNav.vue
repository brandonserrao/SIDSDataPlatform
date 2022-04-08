<template>
  <div class="mvi-indicators-nav">
    <v-row class="nav-row">
      <v-col>
        <v-tabs
          :value="activePreset"
          grow
          class="mb-2 mvi-nav-tabs tabs tabs-small"
        >
          <v-tab :value="0" @change="setPreset('MVI')">MVI</v-tab>
          <v-tab :value="1" @change="setPreset('EVI')">EVI</v-tab>
          <v-tab :value="2">Custom</v-tab>
        </v-tabs>
      </v-col>
      <v-col class="flex-grow-0">
        <v-btn
            class="d-block dense d-md-none"
            icon
            @click="$emit('close')"
            color="primary"
          >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
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
      activePreset : 0,
      selectedIndicators:[
        "mvi-ldc-VIC-Index" ,
        "mvi-ldc-AFF-Index" ,
        "mvi-ldc-DRY-Index" ,
        "mvi-ldc-REM-Index" ,
        "mvi-ldc-LECZ-Index",
        "mvi-ldc-XCON-Index",
        "mvi-ldc-XIN-Index",
        "mvi-ldc-AIN-Index",
        "mvi-wdi2-ST.INT.RCPT.XP.ZS",
        "mvi-wdi-BX.TRF.PWKR.DT.GD.ZS",
        "mvi-wdi-BX.KLT.DINV.WD.GD.ZS"
      ],
      MVI:[
        "mvi-ldc-VIC-Index" ,
        "mvi-ldc-AFF-Index" ,
        "mvi-ldc-DRY-Index" ,
        "mvi-ldc-REM-Index" ,
        "mvi-ldc-LECZ-Index",
        "mvi-ldc-XCON-Index",
        "mvi-ldc-XIN-Index",
        "mvi-ldc-AIN-Index",
        "mvi-wdi2-ST.INT.RCPT.XP.ZS",
        "mvi-wdi-BX.TRF.PWKR.DT.GD.ZS",
        "mvi-wdi-BX.KLT.DINV.WD.GD.ZS"
      ],
      EVI: [
        "mvi-ldc-VIC-Index" ,
        "mvi-ldc-AFF-Index" ,
        "mvi-ldc-DRY-Index" ,
        "mvi-ldc-REM-Index" ,
        "mvi-ldc-LECZ-Index",
        "mvi-ldc-XCON-Index",
        "mvi-ldc-XIN-Index",
        "mvi-ldc-AIN-Index"
      ],
      catIndicators:[
        {
          category:'Environmental',
          color:'rgba(0, 160, 176, 0.7)',
          indicators:[{
            code:'mvi-ldc-VIC-Index',
            name:'Victims of Disasters'
          },{
            code:'mvi-ldc-AFF-Index',
            name:'Agriculture and Fishing (% of GDP)'
          }]
        },{
          category:'Geographic',
          color: 'rgba(204, 51, 63, 0.7)',
          indicators:[{
            code:'mvi-ldc-REM-Index',
            name:'Remoteness'
          },
          {
            code:'mvi-ldc-DRY-Index',
            name:'Population in Drylands',
          },
          {
            code:'mvi-ldc-LECZ-Index',
            name:'% Population in Coastal Zones'
          }]
        },{
          category:'Economic',
          color:'rgba(240, 219, 58, 0.7)',
          indicators:[{
            code:'mvi-ldc-XCON-Index',
            name:'Export Concentration'
          },{
            code:'mvi-ldc-XIN-Index',
            name:'Export Instability'
          },{
            code:'mvi-ldc-AIN-Index',
            name:'Agricultural Instability'
          }]
        },{
          category:'Financial',
          color:'rgba(13, 177, 75, 0.7)',
          indicators:[{
            code:'mvi-wdi2-ST.INT.RCPT.XP.ZS',
            name:'Tourism Revenue (% of Exports)'
          },{
            code:'mvi-wdi-BX.TRF.PWKR.DT.GD.ZS',
            name:'Remittances (% of GDP)'
          },{
            code:'mvi-wdi-BX.KLT.DINV.WD.GD.ZS',
            name:'FDI Inflows (% of GDP)'
          }]
        }
      ]
    }
  },
  computed: {
  },
  methods:{
    updateValue() {
      this.updatePreset();
      this.emitValue()
    },
    emitValue() {
      return this.$emit('MviIndicatorsChange', this.selectedIndicators)
    },
    updatePreset() {
      if(this.selectedIndicators.length === 11) {
        return this.activePreset = 0;
      }
      let hasFinance = this.selectedIndicators.every(indicator => !indicator.includes('-financial'))
      if (this.selectedIndicators.length === 8 && hasFinance) {
        return this.activePreset = 1;
      }
      return this.activePreset = 2;

    },
    setPreset(presetName) {
      this.selectedIndicators = this[presetName];
      this.emitValue();
    }
  },
  mounted() {
    this.emitValue()
  }
}
</script>

<style>
.mvi-nav-tabs .v-tab {
  padding: 8px !important;
  min-width: 40px;
}
.mvi-indicators-nav .v-list-item__action {
  margin: 0 !important;
}
.mvi-indicators-nav .nav-row {
  max-width: 100%;
}
</style>
