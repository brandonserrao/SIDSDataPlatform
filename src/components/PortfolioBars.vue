<template>
  <v-row :id="'tab'+id" justify="center">
    <div class="d-none d-lg-block">
      <v-row class="mb-0 svg-row" justify="center">
        <div class="svg-container">
        </div>
      </v-row>
      <v-row class="mt-0 bars-container" justify="center">
        <div class="sdg-goal" v-for="(goal, index) in goals" :key="goal.name">
          <img
            :src="require(`@/assets/media/goals-icons/${goalsType}/${index+1}.png`)"
            height="56"
            :width="barWidth"
            >
        </div>
      </v-row>
      <template v-if="goalsType==='sdgs'">
        <div class="d-none" v-for="(goal, index) in goals" :id="'goalstooltip'+ index" :key="index">
          <portfolio-tooltip :year="year" :header="goal.name" :data="tooltipData[goal.name]"/>
        </div>
      </template>
    </div>
    <v-col class="d-block d-lg-none text-center block-subheader" cols='12'>
      {{projectCount[activeGoal]}} projects
    </v-col>
    <v-col class="d-block d-lg-none text-center block-subheader" cols='12'>
      {{nFormatter(budgetCount[activeGoal])}} budget
    </v-col>
  </v-row>
</template>
<script>

import sidsdata from '@/mixins/SIDSData.mixin'
import format from '@/mixins/format.mixin'
import { mapState } from 'vuex';
import goalsList from '@/assets/goalsList'
import * as d3 from 'd3';
import PortfolioTooltip from '@/components/PortfolioSDGSTooltip'
import tippy from 'tippy.js';

export default {
  name: 'goals',
  components:{
    PortfolioTooltip
  },
  data() {
    return {
      id: this._uid,
      svg:null,
      goals:[],
      svgContainer: null,
      barsMargin: { top: 60, right: 10, bottom: 0, left: 10 },
      svgWidth: 1074,
      svgHeight: 160,
      y1: null,
      y2: null,
      x:null,
      x2:null,
      prevHeight: 0,
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
      bars: null
    }
  },
  props:['year', 'fundingCategory', 'fundingSource', 'region', 'goalsType'],
  mixins:[sidsdata, format],
  computed: {
    ...mapState({
      activeGoal: state => state.goals.activeGoal
    }),
    barsHeight(){ return this.svgHeight - this.barsMargin.top - this.barsMargin.bottom },
    barWidth() {
      let barsWidth = 56;
      if(this.goalsType==='signature-solutions'){
        barsWidth = 138
      }
      return barsWidth
    },
    barsWidth(){
      return this.goals.length * (this.barWidth + 6)
    },
    projectNamesObject () {
      return this.goals.reduce((namedObject, goal, index) => {
        namedObject[goal.name] = this.projectCount[index];
        return namedObject
      }, {})
    },
    budgetNamesObject () {
      return this.goals.reduce((namedObject, goal, index) => {
        namedObject[goal.name] = this.budgetCount[index];
        return namedObject
      }, {})
    },
    barsData() {
      if(this.goalsType === 'samoa') {
        let barsData = goalsList.samoa.map(() => {
          return {
            budget: 0,
            projects: 0
          }
        });
        this.filteredProjects.map(project => {
          let projectSdgs = project.sdg.split(",");
          projectSdgs.map((projectSdg) => {
            const sdgIndex = goalsList.sdgs.findIndex((sdg) => sdg.name === projectSdg);
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
        return barsData
      }
      let sdgsData = this.goals.map(goal => {
        return this.filteredProjects.reduce((data, project) => {
          if(project[goal.type].includes(goal.name)) {
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
    },
    projectCount() {
      return this.barsData.map(data => data.projects)
    },
    budgetCount() {
      return this.barsData.map(data => data.budget)
    },
    tooltipData() {
      let res = {}
      this.goals.map(goal => {
        res[goal.name] = this.filteredProjects.filter((project) => {
          return project.sdg && project.sdg.includes(goal.name)
        });
      })
      return res
    }
  },
  methods: {
    initBars() {
      this.svg = d3.select(`#tab${this.id} .svg-container`).append("svg");
      this.svg.attr('height', this.svgHeight)
          .attr('width', this.svgWidth);
      this.svgContainer = this.svg.append("g")
          .attr('class', 'root-group')
          .attr("transform", "translate(" + this.barsMargin.left + "," + this.barsMargin.top + ")");
      this.y1 = d3.scaleLinear().rangeRound([this.barsHeight, 0])
      this.y2 = d3.scaleLinear().rangeRound([this.barsHeight, 0])

      let x = d3.scaleBand().rangeRound([0, this.barsWidth]);//.padding(0.1),

      x.domain(this.goals.map(goal => goal.name));

      this.y1.domain([0, d3.max(this.projectCount, function (d) { return d; })]);

      let x2 = d3.scaleBand().rangeRound([0, this.barsWidth]);//.padding(0.1),

      x2.domain(this.goals.map(goal => goal.name));
      this.x = x;
      this.x2 = x2;
      this.y2.domain([0, d3.max(this.budgetCount, function (d) { return d; })]);
    },
    drawBars() {

      let rootThis = this;

      this.x.domain(this.goals.map(goal => goal.name));
      this.x2.domain(this.goals.map(goal => goal.name));
      this.x.rangeRound([0, this.barsWidth]);
      this.x2.rangeRound([0, this.barsWidth]);
      this.svg.select(".root-group")
        .transition(700)
        .attr("transform", "translate(" + (this.svgWidth - this.barsWidth)/2 + "," + this.barsMargin.top + ")");

      this.y1.domain([0, d3.max(this.projectCount, function (d) { return d; })]);
      this.y2.domain([0, d3.max(this.budgetCount, function (d) { return d; })]);


      let bars = this.svgContainer.selectAll('.g-bar1');
      bars.data(this.goals)
      .join(
        (enter) => {
          let bar = enter.append('g').attr('class', 'g-bar1');
          bar.append('rect')
            .attr('class', 'bar')
            .attr("x", function (d) { return (rootThis.x(d.name) + rootThis.barWidth/2 - 19) })
            .attr("y", rootThis.barsHeight)
            .attr("width", 16)
            .attr("height", 0)
            .attr("fill", function (d) { return d.color })
            .transition(700)
            .attr("y", function (d) {
              if(rootThis.projectNamesObject[d.name] === 0) {
                return rootThis.barsHeight
              }
              return rootThis.y1(rootThis.projectNamesObject[d.name]);
            })
            .attr("height", function (d) {
              if(rootThis.projectNamesObject[d.name] === 0) {
                return 0
              }
              return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d.name]);
            })
          bar.append("text")
           .text(function (d) {
             if (rootThis.projectNamesObject[d.name] > 0) {
               return rootThis.projectNamesObject[d.name].toString().concat(" Projects");
             }
           })
           .attr("x", function (d) {
               return (rootThis.x(d.name) + rootThis.barWidth/2 - 15);
           })
           .attr("y", function (d, i) {
               return rootThis.getBarLabelsY(d.name, i, "proj");
           })
           .attr("class", "barsLabels barsLabels1")
           .attr("text-anchor", "middle");
         bar.append('rect')
           .attr('class', 'stick')
           .attr("x", function (d) { return (rootThis.x(d.name) + rootThis.barWidth/2 - 12) })//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
           .attr("width", 3)
           .attr("y", function (d, i) {
             return rootThis.getBarLabelsY(d.name, i, "proj") + 2;
           })
           .attr("height", function (d, i) {
               let val = rootThis.y1(rootThis.projectNamesObject[d.name]) - rootThis.getBarLabelsY(d.name, i, "proj") - 2
               if (rootThis.projectNamesObject[d.name] > 0) { return val }
               else { return 0 }
           })
           .style("opacity", 0.4);
        },
        (update) => {
          update.select('.bar').transition(700)
          .attr("fill", function (d) { return d.color })
          .attr("x", function (d) { return (rootThis.x(d.name) + rootThis.barWidth/2 - 19)})
          .attr("height", function (d) {
            if(rootThis.projectNamesObject[d.name] === 0) {
              return 0
            }
            return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d.name]);
          })
          .attr("y", function (d) {
            if(rootThis.projectNamesObject[d.name] === 0) {
              return rootThis.barsHeight
            }
              return rootThis.y1(rootThis.projectNamesObject[d.name]);
          })
          update.select(".barsLabels").transition(700)
          .attr("x", function (d) {return (
            rootThis.x(d.name) + rootThis.barWidth/2 - 15);
          })
          .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d.name, i, "proj");
          })
          .text(function (d) {
            if (rootThis.projectNamesObject[d.name] > 0) {
              return rootThis.projectNamesObject[d.name].toString().concat(" Projects");
            }
          })
          update.select(".stick").transition(700)
            .attr("x", function (d) { return (rootThis.x(d.name) + rootThis.barWidth/2 - 12) })//+ x2.bandwidth()/2.5+ x2.bandwidth()/6;})
            .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d.name, i, "proj") + 2;
            })
            .attr("height", function (d, i) {
                let val = rootThis.y1(rootThis.projectNamesObject[d.name]) - rootThis.getBarLabelsY(d.name, i, "proj") - 2
                if (rootThis.projectNamesObject[d.name] > 0) { return val }
                else { return 0 }
            })
        },
        (exit) => {
          exit.select('rect')
            .transition(700)
            .attr("y", rootThis.barsHeight)
            .attr("height", 0)
            .remove()
          exit.select('text')
            .transition(700)
            .remove()
          exit
            .transition(700)
            .remove()
        }
      )


      let bars2 = this.svgContainer.selectAll('.g-bar2');
      bars2.data(this.goals)
      .join(
        (enter) => {
          let bar = enter.append('g').attr('class', 'g-bar2');
          bar.append('rect')
            .attr('class', 'bar2')
            .attr("x", function (d) { return (rootThis.x2(d.name) + rootThis.barWidth/2 + 9) })
            .attr("y", function (d) {
              if(rootThis.budgetNamesObject[d.name] === 0) {
                return rootThis.barsHeight
              }
              return rootThis.y2(rootThis.budgetNamesObject[d.name]); })
            .attr("width", 16)
            .attr("height", 0)
            .attr("fill", function (d) { return d.color })
            .style("opacity", 0.5)
            .transition(700)
            .attr("height", function (d) {
              if(rootThis.budgetNamesObject[d.name] === 0) {
                return rootThis.barsHeight
              }
              return rootThis.barsHeight - rootThis.y2(rootThis.budgetNamesObject[d.name]);
            })
          bar.append("text")
           .text(function (d) {
             if (rootThis.budgetNamesObject[d.name] > 0) {
               return rootThis.nFormatter(rootThis.budgetNamesObject[d.name]).toString().concat(" USD");
             }
           })
           .attr("x", function (d) {
             return (rootThis.x2(d.name) + rootThis.barWidth/2 + 18)
           })
           .attr("y", function (d, i) {
             return rootThis.getBarLabelsY(d.name, i, "budg");
           })
           .attr("class", "barsLabels barsLabels2")
           .attr("text-anchor", "middle");
         bar.append('rect')
            .attr('class', 'stick2')
           .attr("x", function (d) { return (rootThis.x2(d.name) + rootThis.barWidth/2 + 16) })
           .attr("y", function (d, i) {
             return rootThis.getBarLabelsY(d.name, i, "budg") + 2;
           })
           .attr("width", 3)
           .attr("height", function (d, i) {
               let val = rootThis.y2(rootThis.budgetNamesObject[d.name]) - rootThis.getBarLabelsY(d.name, i, "budg") - 2
               if (rootThis.budgetNamesObject[d.name] > 0) { return val }
               else { return 0 }
           })
           .style("opacity", 0.4);
        },
        (update) => {
          update.select('.bar2').transition(700)
          .attr("x", function (d) { return (rootThis.x2(d.name) + rootThis.barWidth/2 + 9) })
          .attr("y", function (d) {
            if(rootThis.budgetNamesObject[d] === 0) {
              return rootThis.barsHeight
            }
            return rootThis.y2(rootThis.budgetNamesObject[d.name]);
          })
          .attr("height", function (d) {
            if(rootThis.budgetNamesObject[d.name] === 0) {
              return 0
            }
            return rootThis.barsHeight - rootThis.y2(rootThis.budgetNamesObject[d.name]);
          })
          .style("opacity", 0.5)
          .attr("fill", function (d) { return d.color })


          update.select(".barsLabels2").transition(700)
          .text(function (d) {
            if (rootThis.budgetNamesObject[d.name] > 0) {
              return rootThis.nFormatter(rootThis.budgetNamesObject[d.name]).toString().concat(" USD");
            }
          })
          .attr("x", function (d) {
            return (rootThis.x2(d.name) + rootThis.barWidth/2 + 18)
          })
          .attr("y", function (d, i) {
            return rootThis.getBarLabelsY(d.name, i, "budg");
          })
          update.select(".stick2").transition(700)
            .attr("x", function (d) { return (rootThis.x2(d.name) + rootThis.barWidth/2 + 16) })
            .attr("y", function (d, i) {
              return rootThis.getBarLabelsY(d.name, i, "budg") + 2;
            })
            .attr("height", function (d, i) {
                let val = rootThis.y2(rootThis.budgetNamesObject[d.name]) - rootThis.getBarLabelsY(d.name, i, "budg") - 2
                if (rootThis.budgetNamesObject[d.name] > 0) { return val }
                else { return 0 }
            })
        },
        (exit) => {
          exit.select('rect')
            .transition(700)
            .attr("y", rootThis.barsHeight)
            .attr("height", 0)
            .remove()
          exit.select('text')
            .transition(700)
            .remove()
          exit
            .transition(700)
            .remove()
        }
      );

      let hoverbars = this.svgContainer.selectAll('.hoverbar')
      hoverbars.data(this.goals)
      .join(
        (enter) => {
          if(rootThis.goalsType === 'sdgs') {
            let bar = enter.append('g').attr('class', 'hoverbar');
            bar.append('rect')
              .attr('class', 'hoverbar')
              .attr("x", function (d) { return rootThis.x(d.name) - 6; })
              .attr("y", function (d) { return rootThis.y1(rootThis.projectNamesObject[d.name]) - 30; })
              .attr("width", rootThis.x.bandwidth())
              .attr("height", function (d) {
                if(rootThis.projectNamesObject[d.name] === 0) {
                  return 0
                }
                return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d.name]) + 30;
              })
              .attr("opacity", 0)
              .each((data, index, list) => {
                tippy(list[index], {
                  content() {
                    const template = document.getElementById(`goalstooltip${index}`);
                    return template.innerHTML;
                  },
                  theme: 'light',
                  interactive: true,
                  maxWidth:420,
                  allowHTML: true,
                  appendTo: () => document.body
                });
              })
            } else {
              enter.remove()
            }
          },
          (update) => {
            if(rootThis.goalsType === 'sdgs') {
              let bar = update.append('g').attr('class', 'hoverbar');
              bar.append('rect')
                .attr('class', 'hoverbar')
                .attr("x", function (d) { return rootThis.x(d.name) - 6; })
                .attr("y", function (d) { return rootThis.y1(rootThis.projectNamesObject[d.name]) - 30; })
                .attr("width", rootThis.x.bandwidth())
                .attr("height", function (d) {
                  if(rootThis.projectNamesObject[d.name] === 0) {
                    return 0
                  }
                  return rootThis.barsHeight - rootThis.y1(rootThis.projectNamesObject[d.name]) + 30;
                })
                .attr("opacity", 0)
                .each((data, index, list) => {
                  tippy(list[index], {
                    content() {
                      const template = document.getElementById(`goalstooltip${index}`);
                      return template.innerHTML;
                    },
                    theme: 'light',
                    interactive: true,
                    maxWidth:420,
                    allowHTML: true,
                    appendTo: () => document.body
                  });
                })
              } else {
                update.remove()
              }
          },
          (exit) => {
            exit
              .remove()
          }
        )

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
    this.goals = goalsList[this.goalsType];
    this.initBars();
    this.$nextTick(this.drawBars);
  },
  watch: {
    goalsType() {
      this.goals = goalsList[this.goalsType];
    },
    barsData() {
      this.$nextTick(this.drawBars);
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
  .sdg-goal {
    padding: 3px;
  }
  .barsLabels {
    font-family: sans-serif;
    font-size: 10px;
    text-shadow: -1px 1px 2px #f4f5f8, 1px 1px 2px #f4f5f8, 1px -1px 2px #f4f5f8, -1px -1px 2px #f4f5f8;
    fill: black;
  }
</style>
