<template>
  <div class="tooltip-root">
    <h4>{{header}}</h4>
    <div class="tableContainer">

        <v-data-table
          :headers="headers"
          :items="data"
          height="200"
          fixed-header
          hide-default-footer
          :items-per-page="9999"
        >
        <template v-slot:item.budget="{ item }">
          <span>{{ nFormatter( item.budget)}}</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import format from '@/mixins/format.mixin'

export default {
  name: 'PortfolioSDGSTooltip',
  mixins:[format],
  props: ['header','data'],
  data() {
    return {
      headers: [
        {
          text: 'Country',
          align: 'start',
          sortable: false,
          value: 'country',
        },
        { text: 'Budget', value: 'budget',
        sortable: false, },
        { text: 'Project title', value: 'title',
        sortable: false, },
      ]
    }
  },
  computed: {
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
