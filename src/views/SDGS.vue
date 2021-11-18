<template>
  <div class="">
    <div id="svg-container">

    </div>
    <v-row class="bars-container" justify="center">
      <div class="sdg-goal" v-for="(goal, index) in sdgs" :key="goal">
        <img :src="`https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${parseGoalNumber(index)}.png`">
      </div>
    </v-row>
  </div>
</template>
<script>

import { mapState } from 'vuex';
// import * as d3 from 'd3';

export default {
  name: 'SDGS',
  data:() => ({
    svgContainer: null,
    sdgs: ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on Land", "Peace, justice, and strong institutions", "Partnerships for the goals"]
  }),
  computed: {
    ...mapState({
      SIDSDataWithDonors: state => state.SIDSDataWithDonors,
    }),
    // barsData() {
    //   // return this.sdgs.map(sdg => {
    //   //
    //   // })
    // }
  },
  methods: {
    initBars() {
      // let barsMargin = { top: 60, right: 0, bottom: 0, left: 19 },
      // svgWidth = 1100, svgHeight = 60,
      // barsHeight = svgHeight - barsMargin.top - barsMargin.bottom,
      // barsWidth = svgWidth - barsMargin.left - barsMargin.right,
      // sourceNames = [],
      // sourceCount = [];

    },
    parseGoalNumber(number) {
      let goalNmber = (number + 1).toString();
      if(goalNmber.length < 2) {
        goalNmber = '0' + goalNmber;
      }
      return goalNmber
    }
  }
}
</script>
<style media="screen">
  .sdg-goal {
    width: 65px;
    padding: 3px;
  }
  .sdg-goal img {
    max-width: 100%;
  }
</style>
