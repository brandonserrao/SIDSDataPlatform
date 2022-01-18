<template>
  <v-row :id="'tab'+id" justify="center">
    <div class="d-none d-lg-block">
      <v-row class="mb-0 svg-row" justify="center">
        <div class="svg-container">
        </div>
      </v-row>
      <v-row class="mt-0 bars-container" justify="center">
        <div class="samoa-goal" v-for="(goal, index) in samoaPriorities" :key="goal">
          <img
          :src="`https://sids-dashboard.github.io/SIDSDataPlatform/icons/samoaIcons/100w/Asset%20${index+1}samoaIcons.png`"
          height="56"
          width="56"
          >
        </div>
      </v-row>
    </div>
    <v-col class="d-block d-lg-none text-center block-subheader" cols='12'>
      {{projectCount[activeGoal]}} projects
    </v-col>
    <v-col class="d-block d-lg-none text-center block-subheader" cols='12'>
      {{nFormatter(budgetCount[activeGoal])}} budget
    </v-col>
  </v-row>
</template>
<script type="text/javascript">
// import { mapState } from 'vuex';
import sidsdata from '@/mixins/SIDSData.mixin'
import { mapState } from 'vuex';
import format from '@/mixins/format.mixin'
import * as d3 from 'd3';
export default {
  name: 'SAMOA',
  data() {
    return {
      id:this._uid,
      svgContainer: null,
      sdgs: ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on Land", "Peace, justice, and strong institutions", "Partnerships for the goals"],
      samoaPriorities: ["Sustainable, inclusive and equitable economic growth", "Climate Change", "Sustainable Energy",
        "Disaster Risk Reduction", "Oceans and Seas", "Food Security and Nutrition", "Water and Sanitation", "Sustainable Transportation",
        "Sustainable Consumption and Production", "Chemical and Waste management", "Health and NCDs",
        "Gender Equality", "Social Development", "Biodiversity", "Invasive species", "Means of Implementation"],
      colors: ["#A21942", "#3F7E44", "#FCC30B", "#19486A", "#0A97D9",
          "#DDA63A", "#26BDE2", "green", "blue", "#FD9D24", "#4C9F38",
          "#FF3A21", "#DD1367", "#0A97D9", "#00689D", "#00A99D", "#F4F5F8"
      ],
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
      barsMargin: { top: 60, right: 20, bottom: 0, left: 20 },
      svgWidth: 1032,
      svgHeight: 160,
      y1: null,
      y2: null,
      prevHeight: 0
    }
  },
  props:['year', 'fundingCategory', 'fundingSource', 'region'],
  mixins:[sidsdata, format],
  computed: {
    ...mapState({
      activeGoal: state => state.goals.activeGoal
    }),
    barsHeight(){ return this.svgHeight - this.barsMargin.top - this.barsMargin.bottom },
    barsWidth(){ return this.svgWidth - this.barsMargin.left - this.barsMargin.right },
    barsData() {
      let barsData = this.samoaPriorities.map(() => {
        return {
          budget: 0,
          projects: 0
        }
      });
      this.filteredProjects.map(project => {
        let projectSdgs = project.sdg.split(";");
        projectSdgs.map((sdg) => {
          const sdgIndex = this.sdgs.findIndex((sdgList) => sdgList === sdg);
          if(sdgIndex !== -1) {
            let priorities = this.sdgToSamoa[sdgIndex+1];
            priorities.map((priority) => {
              let budget = project.budget / projectSdgs.length / priorities.length;
              barsData[priority-1].budget = barsData[priority-1].budget + budget;
              barsData[priority-1].projects = barsData[priority-1].projects + 1;
            })
          }
        })
      })
      return barsData;
    },
    projectCount() {
      return this.barsData.map(data => data.projects)
    },
    budgetCount() {
      return this.barsData.map(data => data.budget)
    },
    projectNamesObject () {
      return this.samoaPriorities.reduce((namedObject, name, index) => {
        namedObject[name] = this.projectCount[index];
        return namedObject
      }, {})
    },
    budgetNamesObject () {
      return this.samoaPriorities.reduce((namedObject, name, index) => {
        namedObject[name] = this.budgetCount[index];
        return namedObject
      }, {})
    },
  },
  methods: {
    initBars() {
      let svg = d3.select(`#tab${this.id} .svg-container`).append("svg");
      svg.attr('height', this.svgHeight)
          .attr('width', this.svgWidth);

      this.svgContainer = svg.append("g")
          .attr("transform", "translate(" + this.barsMargin.left + "," + this.barsMargin.top + ")");
      this.y1 = d3.scaleLinear().rangeRound([this.barsHeight, 0])
      this.y2 = d3.scaleLinear().rangeRound([this.barsHeight, 0])
    },
    drawBars() {

      let rootThis = this;
      let x = d3.scaleBand().rangeRound([0, this.barsWidth]);//.padding(0.1),

      x.domain(this.samoaPriorities);
      this.y1.domain([0, d3.max(this.projectCount, function (d) { return d; })]);

      let x2 = d3.scaleBand().rangeRound([0, this.barsWidth]);//.padding(0.1),

      x2.domain(this.samoaPriorities);
      this.y2.domain([0, d3.max(this.budgetCount, function (d) { return d; })]);

      // Create rectangles
      let bars = this.svgContainer.selectAll('.bar')
          .data(this.samoaPriorities)
          .enter()
          .append("g");

      // Create rectangles

      bars.append('rect')
          .attr('class', 'bar')
          .attr("x", function (d) { return (x(d) + x.bandwidth() / 16) + 8; })
          .attr("y", function (d) { return rootThis.y1(rootThis.projectNamesObject[d]); })
          .attr("width", x.bandwidth() / 4)
          .attr("height", function (d) { return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d]); })
          .attr("fill", function (d, i) { return rootThis.colors[i] })


      // Create rectangles
      let bars2 = this.svgContainer.selectAll('.bar2')
          .data(this.samoaPriorities)
          .enter()
          .append("g");

      bars2.append('rect')
          .attr('class', 'bar2')
          .attr("x", function (d) { return (x2(d) + x2.bandwidth() / 2.2) + 8; })
          .attr("y", function (d) { return rootThis.y2(rootThis.budgetNamesObject[d]); })
          .attr("width", x2.bandwidth() / 4)
          .attr("height", function (d) { return rootThis.barsHeight - rootThis.y2(rootThis.budgetNamesObject[d]); })
          .attr("fill", function (d, i) { return rootThis.colors[i] })
          .style("opacity", 0.5);

      let sticks = this.svgContainer.selectAll('.stick')
          .data(this.samoaPriorities)
          .enter()
          .append("g");

      sticks.append('rect')
          .attr('class', 'stick')
          .attr("x", function (d) { return (x(d) + x.bandwidth() / 6) + 8; })//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
          .attr("width", x.bandwidth() / 25)
          .attr("y", function (d, i) {
            return rootThis.getBarLabelsY(d, i, "proj") + 2;
          })
          .attr("height", function (d, i) {
              let val = rootThis.y1(rootThis.projectNamesObject[d]) - rootThis.getBarLabelsY(d, i, "proj") - 2
              if (rootThis.projectNamesObject[d] > 0) { return val }
              else { return 0 }
          })
          .style("opacity", 0.4);

      let sticks2 = this.svgContainer.selectAll('.stick2')
          .data(this.samoaPriorities)
          .enter()
          .append("g");

      sticks2.append('rect')
          .attr('class', 'stick2')
          .attr("x", function (d) { return (x2(d) + x2.bandwidth() / 2.2 + x2.bandwidth() / 10) + 8; })
          .attr("y", function (d, i) {
            return rootThis.getBarLabelsY(d, i, "budg") + 2;
          })
          .attr("width", x2.bandwidth() / 25)
          .attr("height", function (d, i) {
              let val = rootThis.y2(rootThis.budgetNamesObject[d]) - rootThis.getBarLabelsY(d, i, "budg") - 2
              if (rootThis.budgetNamesObject[d] > 0) { return val }
              else { return 0 }
          })
          .style("opacity", 0.4);

       bars.append("text")
          .text(function (d) {
            if (rootThis.projectNamesObject[d] > 0) {
              return rootThis.projectNamesObject[d].toString().concat(" Projects");
            }
          })
          .attr("x", function (d) {
              return (x(d) + x.bandwidth() / 8) + 8;
          })
          .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d, i, "proj");
          })
          .attr("class", "barsLabels barsLabels1")
          .attr("text-anchor", "middle");

        bars2.append("text")
          .text(function (d) {
            if (rootThis.budgetNamesObject[d] > 0) {
              return rootThis.nFormatter(rootThis.budgetNamesObject[d]).concat(" USD");
            }
          })
          .attr("x", function (d) {
              return (x2(d) + x2.bandwidth() / 8 + x2.bandwidth() / 2.3) + 8;
          })
          .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d, i, "budg");
          })
          .attr("class", "barsLabels barsLabels2")
          .attr("text-anchor", "middle");

    },
    parseGoalNumber(number) {
      let goalNmber = (number + 1).toString();
      if(goalNmber.length < 2) {
        goalNmber = '0' + goalNmber;
      }
      return goalNmber
    },
    updateBars() {
      let rootThis = this;

      d3.selectAll(".bar")   // change the line
          .data(this.samoaPriorities)

      d3.selectAll(".bar2")   // change the line
          .data(this.samoaPriorities)

      this.y1.domain([0, d3.max(this.projectCount, function (d) { return d; })]);

      this.y2.domain([0, d3.max(this.budgetCount, function (d) { return d; })]);

      d3.selectAll(".bar")
        .transition()
        .duration(750)
        .attr("height", function (d) {
            return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d]);
        })
        .attr("y", function (d) {
            return rootThis.y1(rootThis.projectNamesObject[d]);
        })

      d3.selectAll(".bar2")
        .transition()
        .duration(750)
        .attr("height", function (d) {
          return rootThis.barsHeight - rootThis.y2(rootThis.budgetNamesObject[d]);
        })
        .attr("y", function (d) {
          return rootThis.y2(rootThis.budgetNamesObject[d]);
        })

        d3.selectAll(".stick")
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d, i, "proj") + 2;
            })
            .attr("height", function (d, i) {
                let val = rootThis.y1(rootThis.projectNamesObject[d]) - rootThis.getBarLabelsY(d, i, "proj") - 2
                if (rootThis.projectNamesObject[d] > 0) { return val }
                else { return 0 }
            })

        d3.selectAll(".stick2")
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d, i, "budg") + 2;
            })
            .attr("height", function (d, i) {
                let val = rootThis.y2(rootThis.budgetNamesObject[d]) - rootThis.getBarLabelsY(d, i, "budg") - 2
                if (rootThis.budgetNamesObject[d] > 0) { return val }
                else { return 0 }
            })
        d3.selectAll('.barsLabels1')
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
                return rootThis.getBarLabelsY(d, i, "proj");
            })
            .text(function (d) {
              if (rootThis.projectNamesObject[d] > 0) {
                return rootThis.projectNamesObject[d].toString().concat(" Projects");
              }
            })

        d3.selectAll('.barsLabels2')
            .transition()
            .duration(750)
            .attr("y", function (d, i) {
                return rootThis.getBarLabelsY(d, i, "budg");
            })
            .text(function (d) {
              if (rootThis.budgetNamesObject[d] > 0) {
                return rootThis.nFormatter(rootThis.budgetNamesObject[d]).concat(" USD");
              }
            })

    },
    getBarLabelsY(d, i, type) {
      if (i == 0) {
          this.prevHeight = -20
      }
      let offset = 0,
      projectPref = 3,
      projVal,
      budgVal;
      if (Math.abs((100 - this.y1(this.projectNamesObject[d]) + 20) - this.prevHeight) < 10) {
          projectPref = -3
      }
      let b = 100 - this.y2(this.budgetNamesObject[d]),
      p = 100 - this.y1(this.projectNamesObject[d])

      if (p - b >= 12) {
          projVal = p + 10
          budgVal = b + 10
      }
      else if (p >= b - projectPref && p - b < 12) {
          projVal = p + 20
          budgVal = p + 8
      }
      else if (b >= p + projectPref && b - p < 12) {
          projVal = b + 8
          budgVal = b + 20
      }
      else if (b - p >= 12) {
          projVal = p + 10
          budgVal = b + 10
      }
      if (this.prevHeight >= projVal && this.prevHeight - projVal < 10) {
          offset = 10 + this.prevHeight - projVal
      }
      else if (projVal > this.prevHeight && projVal - this.prevHeight < 10) {
          offset = 10 - projVal + this.prevHeight
      }
      this.prevHeight = budgVal + offset
      if (type == "budg") { return 100 - budgVal - offset }
      else if (type == "proj") { return 100 - projVal - offset }
    }
  },
  mounted() {
    this.id = this._uid;
    this.initBars();
    this.$nextTick(this.drawBars);
  },
  watch: {
    barsData() {
      this.$nextTick(this.updateBars);
    }
  },
}
</script>
<style media="screen">
  .bars-container{
    display: flex;
    flex: 1 0 auto;
    flex-wrap: nowrap;
    max-width: 100%;
    margin: 0px;
  }
  .svg-row {
    height: 160px;
  }
  .samoa-goal {
    width: 62px;
    height: 62px;
    padding: 3px;
  }
  .samoa-goal img {
    max-width: 100%;
  }
  .barsLabels {
    font-family: sans-serif;
    font-size: 10px;
    text-shadow: -1px 1px 2px #f4f5f8, 1px 1px 2px #f4f5f8, 1px -1px 2px #f4f5f8, -1px -1px 2px #f4f5f8;
    fill: black;
  }
</style>
