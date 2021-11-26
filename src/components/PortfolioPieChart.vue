<template>
  <div class="">
    <div class="pie-chart" :id="chartName">
    </div>
    <div class="d-none" v-for="(axis, index) in data" :id="chartName +'tooltip'+ index" :key="index">
      <portfolio-pieChart-tooltip :header="axis.category" :budget="axis.value" :finance="nFormatter(axis.value)" :percetage="data"/>
    </div>
  </div>
</template>

<script>
import PortfolioPieChartTooltip from '@/components/PortfolioPieChartTooltip';
import * as d3 from 'd3';
import format from '@/mixins/format.mixin'
import tippy from 'tippy.js';

export default {
  name: 'PortfolioMap',
  mixins:[format],
  components:{
    PortfolioPieChartTooltip
  },
  props:{
    chartName: {
      type: String,
      default: 'region'
    },
    colorScheme: {
      type: Function,
      default: ()=>(()=>({}))
    },
    data: {
      type: Array,
      default: ()=>([])
    }
  },
  data() {
    return {
      pie: null,
      arc: null,
      outerArc: null,
      makePie: null,
      radius: 50
    }
  },
  methods: {
    initChart() {
      this.pie = d3.select(`#${this.chartName}`).append("svg").append("g");
      this.pie.append("g")
        .attr("class", "slices").attr("transform", `translate(200, 75)`);
      this.pie.append("g")
        .attr("class", "labels").attr("transform", `translate(200, 75)`);
      this.pie.append("g")
        .attr("class", "lines").attr("transform", `translate(200, 75)`);

      this.arc = d3.arc()
        .outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4);

      this.outerArc = d3.arc()
        .innerRadius(this.radius * 0.9)
        .outerRadius(this.radius * 0.9);

      this.makePie = d3.pie()
        .value(d => d.value)
        .sort(null);
    },
    midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    },
    drawChart() {
      const rootThis = this;

      /* ------- PIE SLICES -------*/
      var slice = this.pie.select(".slices").selectAll("path.slice")
        .data(this.makePie(this.data));

      slice.enter()
        .insert("path")
        .style("fill", function(d) { return rootThis.colorScheme(d.data.category); })
        .attr("class", "slice");

      slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            return rootThis.arc(interpolate(t));
          };
        })
        slice.on('click', function (d) {
          rootThis.setFilter(rootThis.chartName, d.data.category)
        })
      slice.each((data, index, list) => {
        tippy(list[index], {
          content() {
            const template = document.getElementById(`${rootThis.chartName}tooltip${index}`);
            return template.innerHTML;
          },
          theme: 'light',
          interactive: true,
          allowHTML: true,
          appendTo: () => document.body
        });
      })
      slice.exit()
        .remove();

      /* ------- TEXT LABELS -------*/

      let text = this.pie.select(".labels").selectAll("text")
        .data(this.makePie(this.data));
      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("font-size", "12px")
        .text(function (d) {
          if (d.data.value == 0) { return ""; } else {
            return d.data.category + " - " + rootThis.nFormatter(d.data.value, 1);
          }
        });
      let sumall = 0
      for (let source in this.data) {
        sumall += this.data[source].value
      }

      text.text(function (d) {
        if (d.data.value / sumall < 0.0236) { return ""; } else {
          return d.data.category + " - " + rootThis.nFormatter(d.data.value, 1);
        }
      });
      text.transition().duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = rootThis.outerArc.centroid(d2);
            pos[0] = rootThis.radius * (rootThis.midAngle(d2) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            return rootThis.midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      text.exit()
        .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = this.pie.select(".lines").selectAll("polyline")
        .data(this.makePie(this.data));

      polyline.enter()
        .append("polyline");

      polyline.transition().duration(1000)
        .attrTween("points", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = rootThis.outerArc.centroid(d2);
            pos[0] = rootThis.radius * 0.95 * (rootThis.midAngle(d2) < Math.PI ? 1 : -1);
            if (d.data.value / sumall < 0.0236) {
              return []
            }
            return [rootThis.arc.centroid(d2), rootThis.outerArc.centroid(d2), pos];
          };
        });

      polyline.exit()
        .remove();
      },
      setFilter(type, value) {
        this.$emit('changeFilter',{type, value})
      }
    },
    mounted() {
      this.initChart();
      this.drawChart();
      // no idea why but works good only if called twice (same as in old version)
      this.drawChart();
    },
    watch: {
      data() {
        this.$nextTick(this.drawChart);
      }
    },
}
</script>

<style>
.pie-chart {
  height: 500px;
}
.pie-chart svg {
  width: 100%;
  min-height: 200px;
}
.pie-chart polyline {
  opacity: 0.3;
  stroke: black;
  stroke-width: 2 px;
  fill: none;
}
</style>
