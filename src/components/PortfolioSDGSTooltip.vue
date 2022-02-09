<template>
  <div class="tooltip-root">
    <h4 class="block-subheader">{{header}}</h4>
    <div class="tableContainer">

        <v-data-table
          :headers="headers"
          :items="dataWithIDs"
          height="200"
          fixed-header
          width="370"
          hide-default-footer
          :items-per-page="9999"
          item-key="subId"
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
  props: ['header','data', 'year'],
  data() {
    return {
    }
  },
  computed: {
    dataWithIDs() {
      return this.data.map((item, index) => {
         item.subId = this.header+index;
         return item
      })
    },
    headers() {
      let headers = [
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
      ];
      if(this.year === 'all') {
        headers.push({
          text: 'Year', value: 'year',
          sortable: false
        })
      }
      return headers
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tooltip-root {
  max-width: 400px;
  padding: 0;
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
.tableContainer {
  margin: 0 -9px 0;
}
</style>
