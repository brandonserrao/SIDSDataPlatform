<template>
  <div class="mt-5">
  <v-row>
    <v-col cols='12'>
      <h2 class="page-header">{{view === 'indicators' ? 'Development Indicators' : 'Towards a Multidimensional Vulnerability Index'}}</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols='3'>
      <indicators-nav/>
    </v-col>
  </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import IndicatorsNav from '@/components/IndicatorsNav.vue'

export default {
  name: 'DevelopmentIndicators',
  props:['view'],
  components: {
    IndicatorsNav
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
</style>
