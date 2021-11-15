<template>
  <v-row>
    <portfolio-map></portfolio-map>
    <portfolio-bar></portfolio-bar>
    <portfolio-pie-chart></portfolio-pie-chart>
  </v-row>
</template>

<script>
// @ is an alias to /src
import PortfolioMap from '@/components/PortfolioMap'
import PortfolioBar from '@/components/PortfolioBar'
import PortfolioPieChart from '@/components/PortfolioPieChart'
export default {
  name: 'Portfolio',
  components: {
    PortfolioMap,
    PortfolioBar,
    PortfolioPieChart
  }
}
</script>
