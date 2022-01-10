<template>
  <div class="">
      <v-subheader class="finance-header block-subheader">Finance</v-subheader>
      <v-card flat class="overflow background-grey">
          <v-list dense class="indicators-list background-grey"
          >
            <v-list-item
            >
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'Personal remittances, received (% of GDP):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['Personal remittances, received (% of GDP)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'External debt stocks (% of GNI):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['External debt stocks (% of GNI)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'Foreign direct investment, net inflows (BoP, current US$):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['Foreign direct investment, net inflows (BoP, current US$)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'Net ODA received per capita (current US$):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['Net ODA received per capita (current US$)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'Net ODA received (% of GNI):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['Net ODA received (% of GNI)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'Trade (% of GDP):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['Trade (% of GDP)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'GDP (current US$):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['GDP (current US$)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item><v-list-item>
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header" v-text="'GDP per capita (current US$):'"></v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(financeData['GDP per capita (current US$)'])}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-card>
  </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    countryId: {
      type: String,
      default: ''
    }
  },
  computed:{
    ...mapState({
      allKeyData: state => state.sids.allKeyData
    }),
    financeData() {
      return this.allKeyData[this.countryId].Finance
    }
  },
  methods: {
    formatNumber(number) {
      if(isNaN(parseInt(number))) {
        return number
      }
      return number.toLocaleString();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indicators-list .one-line {
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.overflow {
  overflow: hidden;
}
.one-line_header {
  flex: 0 1 auto !important;
  margin-right: 8px !important;
  text-overflow: none;
  overflow:visible;
}
.finance-header {
  color: #0018a0;
  justify-content: center;
}
.one-line_subheader{
  flex-basis: auto;
}
</style>
