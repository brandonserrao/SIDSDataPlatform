<template>
  <div class="tooltip-root">
    <h4>{{header}}</h4>
    <v-list dense class="indicators-list">
      <v-list-item-group>
        <v-list-item class="p-0">
          <v-list-item-content class="one-line">
            <v-list-item-title class="one-line_header" v-text="'Budget:'"></v-list-item-title>
            <v-list-item-subtitle class="one-line_subtitle">{{finance}} USD</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item  class="p-0">
          <v-list-item-content class="one-line">
            <v-list-item-title class="one-line_header" v-text="'Share:'"></v-list-item-title>
            <v-list-item-subtitle>{{share}} %</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'PortfolioPieChartTooltip',
  props: ['header','finance','percetage','budget'],
  computed: {
    share() {
      let full = this.percetage.reduce((share, budget) => {return share + budget.value}, 0);
      return (this.budget/full * 100).toFixed(2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tooltip-root {
  max-width: 320px;
}
.indicators-list {
  padding-bottom: 0;
}
.indicators-list .one-line {
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.overflow {
  overflow: hidden;
}
.indicators-list .one-line_subtitle{
  white-space: normal;
}
.one-line_header {
  align-self: auto;
  flex: 0 1 auto !important;
  margin-right: 8px !important;
  text-overflow: none;
  overflow:visible;
}
.p-0 {
  padding: 0 !important;
}
</style>
