<template>
  <div class="">
    <v-row class="mb-0 svg-row" justify="center">
      <div id="svg-container">
      </div>
    </v-row>
    <v-row class="mt-0 bars-container" justify="center">
      <div class="sdg-goal" v-for="(goal, index) in sdgs" :key="goal">
        <img :src="`https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${parseGoalNumber(index)}.png`">
      </div>
    </v-row>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import sidsdata from '@/mixins/SIDSData.mixin'
import format from '@/mixins/format.mixin'
import * as d3 from 'd3';


export default {
  name: 'SDGS',
  data:() => ({
    svgContainer: null,
    sdgs: ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on Land", "Peace, justice, and strong institutions", "Partnerships for the goals"],
    colors: ["#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21",
      "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24",
      "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"
    ]
  }),
  props:['year', 'fundingCategory', 'fundingSource'],
  mixins:[sidsdata, format],
  computed: {
    ...mapState({
      SIDSDataWithDonors: state => state.SIDSDataWithDonors,
    }),
    barsData() {
      let sdgsData = this.sdgs.map(sdg => {
        return this.SIDSDataWithDonors.reduce((data, project) => {
          if(project.sdg.includes(sdg)) {
            return {
              projects: data.projects + 1,
              budget: data.budget + parseInt(project.budget)
            }
          }
          return data
        },{
          projects:0,
          budget:0
        });
      })
      return sdgsData
    }
  },
  methods: {
    initBars() {

      let barsMargin = { top: 60, right: 10, bottom: 0, left: 10 },
      svgWidth = 1125, svgHeight = 160,
      barsHeight = svgHeight - barsMargin.top - barsMargin.bottom,
      barsWidth = svgWidth - barsMargin.left - barsMargin.right,
      projectCount = this.barsData.map(data => data.projects),
      budgetCount = this.barsData.map(data => data.budget),
      projectNamesObject = this.sdgs.reduce((namedObject, sdgName, index) => {
        namedObject[sdgName] = projectCount[index];
        return namedObject
      }, {}),
      budgetNamesObject = this.sdgs.reduce((namedObject, sdgName, index) => {
        namedObject[sdgName] = budgetCount[index];
        return namedObject
      }, {}),
      rootThis = this;
      console.log(projectCount, budgetCount)
      let x = d3.scaleBand().rangeRound([0, barsWidth]),//.padding(0.1),
      y = d3.scaleLinear().rangeRound([barsHeight, 0]);

      x.domain(this.sdgs);
      y.domain([0, d3.max(projectCount, function (d) { return d; })]);

      let svg = d3.select("#svg-container").append("svg");
      svg.attr('height', svgHeight)
          .attr('width', svgWidth);

      svg = svg.append("g")
          .attr("transform", "translate(" + barsMargin.left + "," + barsMargin.top + ")");

      let sticks = svg.selectAll('.stick')
          .data(this.sdgs)
          .enter()
          .append("g");

      sticks.append('rect')
          .attr('class', 'stick')
          .attr("x", function (d) { return (x(d) + x.bandwidth() / 6) + 8; })//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
          .attr("y", function (d) { return y(projectNamesObject[d]) - 22; })
          .attr("width", x.bandwidth() / 25)
          .attr("height", 22)
          .style("opacity", 0.4);

      // Create rectangles
      let bars = svg.selectAll('.bar')
          .data(this.sdgs)
          .enter()
          .append("g");

      // Create rectangles

      bars.append('rect')
          .attr('class', 'bar')
          .attr("x", function (d) { return (x(d) + x.bandwidth() / 16) + 8; })
          .attr("y", function (d) { return y(projectNamesObject[d]); })
          .attr("width", x.bandwidth() / 4)
          .attr("height", function (d) { return barsHeight - y(projectNamesObject[d]); })
          .attr("fill", function (d, i) { return rootThis.colors[i] })

      let x2 = d3.scaleBand().rangeRound([0, barsWidth]),//.padding(0.1),
          y2 = d3.scaleLinear().rangeRound([barsHeight, 0]);

      x2.domain(this.sdgs);
      y2.domain([0, d3.max(budgetCount, function (d) { return d; })]);

      let sticks2 = svg.selectAll('.stick2')
          .data(this.sdgs)
          .enter()
          .append("g");

      sticks2.append('rect')
          .attr('class', 'stick2')
          .attr("x", function (d) { return (x2(d) + x2.bandwidth() / 2.2 + x2.bandwidth() / 10) + 8; })
          .attr("y", function (d) { return y2(budgetNamesObject[d]) - 8; })
          .attr("width", x2.bandwidth() / 25)
          .attr("height", 8)
          .style("opacity", 0.4);

      // Create rectangles
      let bars2 = svg.selectAll('.bar2')
          .data(this.sdgs)
          .enter()
          .append("g");

      bars2.append('rect')
          .attr('class', 'bar2')
          .attr("x", function (d) { return (x2(d) + x2.bandwidth() / 2.2) + 8; })
          .attr("y", function (d) { return y2(budgetNamesObject[d]); })
          .attr("width", x2.bandwidth() / 4)
          .attr("height", function (d) { return barsHeight - y2(budgetNamesObject[d]); })
          .attr("fill", function (d, i) { return rootThis.colors[i] })
          .style("opacity", 0.5);

       bars.append("text")
          .text(function (d) {
              return projectNamesObject[d].toString().concat(" Projects");
          })
          .attr("x", function (d) {
              return (x(d) + x.bandwidth() / 8) + 8;
          })
          .attr("y", function (d) {
              return y(projectNamesObject[d]) - 24;
          })
          .attr("class", "barsLabels")
          .attr("text-anchor", "middle");

        bars2.append("text")
          .text(function (d) {
              return rootThis.nFormatter(budgetNamesObject[d]).concat(" USD");
          })
          .attr("x", function (d) {
              return (x2(d) + x2.bandwidth() / 8 + x2.bandwidth() / 2.3) + 8;
          })
          .attr("y", function (d) {
              return y2(budgetNamesObject[d]) - 10;
          })
          .attr("class", "barsLabels")
          .attr("text-anchor", "middle");

      let hoverbars = svg.selectAll('.hoverbar')
          .data(projectCount)
          .enter()
          .append("g");

      hoverbars.append('rect')
          .attr('class', 'hoverbar')
          .attr("x", function (d) { return x(d) + 2; })
          .attr("y", function (d) { return y(projectNamesObject[d]) - 30; })
          .attr("width", x.bandwidth())
          .attr("height", function (d) { return barsHeight - y(projectNamesObject[d]) + 30; })
          .attr("opacity", 0)

    },
    parseGoalNumber(number) {
      let goalNmber = (number + 1).toString();
      if(goalNmber.length < 2) {
        goalNmber = '0' + goalNmber;
      }
      return goalNmber
    }
  },
  mounted() {
    this.initBars();
  },
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
  .svg-row {
    max-height: 160px;
  }
  .barsLabels {
    font-family: sans-serif;
    font-size: 10px;
    text-shadow: -1px 1px 2px #f4f5f8, 1px 1px 2px #f4f5f8, 1px -1px 2px #f4f5f8, -1px -1px 2px #f4f5f8;
    fill: black;
  }
</style>
