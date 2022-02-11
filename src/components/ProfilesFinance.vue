<template>
  <div class="">
      <v-subheader class="finance-header block-subheader">Finance</v-subheader>
      <v-card flat class="overflow background-grey">
          <v-list dense class="indicators-list background-grey"
          >
            <v-list-item v-for="(indicator) in financeData" :key="indicator.axis">
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header">
                  {{indicatorsMetadata[indicator.axis].indicator}}
                </v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(indicator.value)}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-card>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import format from '@/mixins/format.mixin'


export default {
  props: {
    countryId: {
      type: String,
      default: ''
    }
  },
  mixins:[format],
  computed:{
    ...mapState({
      profiles: state => state.profiles.profiles,
      indicatorsMetadata: state => state.profiles.indicatorsMetadata
    }),
    financeData() {
      return this.profiles[this.countryId].Finance
    }
  },
  methods: {
    formatNumber(number) {
      if(isNaN(parseInt(number))) {
        return number
      }
      return this.nFormatter(number,2);
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
  align-items: flex-start;
}
.one-line_subheader{
  flex-basis: auto;
}
</style>
