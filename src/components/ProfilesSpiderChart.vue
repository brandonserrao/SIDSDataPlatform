<template>
  <div class="graph-container">
      <h4 class="text-center"
        :style="{color: graphOptions.textColor}">
        {{headerText}}
      </h4>
      <div class="d-none" v-for="(axis, index) in graphRanks[0].axes" :id="`${pillarName}${index}`" :key="index">
        <profiles-spider-chart-tooltip
          :header="axis.axis"
          :rank="axis.value"
          :value="graphData[0].axes[index].value"
          :source="keyMetadata[axis.axis].source"
          :definition="keyMetadata[axis.axis].longDefinition"
          :link="keyMetadata[axis.axis].sourceLink"
        />
      </div>
    <div :id="`graph${pillarName}`">
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { mapState } from 'vuex';
import tippy from 'tippy.js';
import ProfilesSpiderChartTooltip from '@/components/ProfilesSpiderChartTooltip';

export default {
  name: 'ProfilesSpiderChart',
  components:{
    ProfilesSpiderChartTooltip
  },
  props: {
    activeCountries: {
      type: Array,
      default: ()=>[]
    },
    pillarName: {
      type: String,
      default: 'Climate'
    },
    graphOptions: {
      type: Object,
      default: ()=>({})
    },
    headerText: {
      type: String,
      default: ''
    }
  },
  data: ()=>({
    defaultGraphOptions: {
      w: 500,        //Width of the circle
      h: 500,        //Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 3,        //How many levels or inner circles should there be drawn
      maxValue: 42,       //What is the value that the biggest circle will represent
      labelFactor: 1.25,   //How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 80,     //The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35,   //The opacity of the area of the blob
      dotRadius: 4,       //The size of the colored circles of each blog
      opacityCircles: 0.1,   //The opacity of the circles of each blob
      strokeWidth: 2,     //The width of the stroke around each blob
      roundStrokes: false,  //If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10),  //Color function,
      format: '.2%',
      unit: '',
      legend: false,
      spin: 0,
      textFormat: 1
    }
  }),
  computed:{
    ...mapState({
      allKeyData: state => state.allKeyData,
      keyMetadata: state => state.keyMetadata
    }),
    graphData() {
      console.log(this.keyMetadata, 'mData')
      return this.activeCountries.map(country => {
        return {
          name:country,
          axes: this.allKeyData[country][this.pillarName]
        }
      })
    },
    graphRanks() {
      let rankName = `${this.pillarName}Rank`;
      if(this.pillarName === 'MVI2') {
        rankName = 'MVI2'
      }
      return this.activeCountries.map(country => {
        return {
          name:country,
          axes: this.allKeyData[country][rankName]
        }
      })
    },
    fullGraphOptions(){
      return Object.assign({} ,this.defaultGraphOptions, this.graphOptions);
    },
    maxAxisValue() {
      return this.graphRanks.reduce((maxCountriesValue, country)=>{
        const currentCountryMax = country.axes.reduce((maxAxesValue, axe)=>{
          if(isNaN(parseInt(axe.value))) {
            return maxAxesValue
          }
          return maxAxesValue > axe.value ? maxAxesValue : axe.value;
        }, this.fullGraphOptions.maxValue);
        return maxCountriesValue > currentCountryMax ? maxCountriesValue : currentCountryMax;
      }, this.fullGraphOptions.maxValue);
    }
  },
  methods:{
    drawGraph(){
      let rootThis = this;
      const wrap = (text, width) => {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
          word  =  words.pop();
          while (word) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
            word  =  words.pop();
          }
        });
      }

      let allAxis = this.graphRanks[0].axes.map((i) => i.axis),  //Names of each axis
      total = allAxis.length,          //The number of different axes
      radius = Math.min(this.fullGraphOptions.w / 2, this.fullGraphOptions.h / 2),   //Radius of the outermost circle
      angleSlice = Math.PI * 2 / total,    //The width in radians of each "slice"
      rScaleNormal = d3.scaleLinear()
          .range([0, radius])
          .domain([0, this.maxAxisValue]),
      rScale,
      HALF_PI = Math.PI / 2;

      //Scale for the radius
      if (this.pillarName == "MVI2" || this.pillarName=="customIndex") {
        rScale = rScaleNormal;
      } else {
        rScale = d3.scaleLinear()
          .range([0, radius])
          .domain([this.maxAxisValue, 1]);
      }

      const parent = d3.select(`#graph${this.pillarName}`);

      //Remove whatever chart with the same id/class was present before
      parent.select("svg").remove();

      //Initiate the radar chart SVG
      let svg = parent.append("svg")
        .attr("width", this.fullGraphOptions.w + this.fullGraphOptions.margin.left + this.fullGraphOptions.margin.right)
        .attr("height", this.fullGraphOptions.h + this.fullGraphOptions.margin.top + this.fullGraphOptions.margin.bottom)
        .attr("class", "radar")
        .attr("display", "inline-block")
        .attr("margin", "auto")
        .attr("pointer-events","none");

      //Append a g element
      let g = svg.append("g")
        .attr("transform", "translate(" + (this.fullGraphOptions.w / 2 + this.fullGraphOptions.margin.left) + "," + (this.fullGraphOptions.h / 2 + this.fullGraphOptions.margin.top) + ")");

      //Filter for the outside glow
      let axisGrid = g.append("g").attr("class", "axisWrapper");


      let filter = g.append('defs').append('filter').attr('id', 'glow');
      filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
      let feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      //Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1, (this.fullGraphOptions.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / this.fullGraphOptions.levels * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", this.fullGraphOptions.opacityCircles)
        .style("filter", "url(#glow)");

      //Text indicating at what % each level is
      axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (this.fullGraphOptions.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * radius / this.fullGraphOptions.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "black")

      if (this.pillarName == "MVI2"||this.pillarName=="customIndex") {
        axisGrid.selectAll(".axisLabel").text(d => this.nFormatter(this.maxAxisValue * d / this.fullGraphOptions.levels))
      }
      else {
        axisGrid.selectAll(".axisLabel").text(d => this.rankFormat(this.nFormatter(this.maxAxisValue - this.maxAxisValue * d / this.fullGraphOptions.levels + 1)))
      }

      //Create the straight lines radiating outward from the center
      let axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScaleNormal(this.maxAxisValue * 1.1) * Math.cos(angleSlice * i - HALF_PI - this.fullGraphOptions.spin))
        .attr("y2", (d, i) => rScaleNormal(this.maxAxisValue * 1.1) * Math.sin(angleSlice * i - HALF_PI - this.fullGraphOptions.spin))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px")
        .style("pointer-events","none");


      if (this.pillarName != "customIndex") {
        axis.append("text")
          .attr("class", "legend")
          .style("font-size", "10px")
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("x", (d, i) => this.fullGraphOptions.textFormat * rScaleNormal(this.maxAxisValue * this.fullGraphOptions.labelFactor) * Math.cos(angleSlice * i - HALF_PI - this.fullGraphOptions.spin))
          .attr("y", (d, i) => -15 / this.fullGraphOptions.textFormat ** 3 + rScaleNormal(this.maxAxisValue * this.fullGraphOptions.labelFactor) * Math.sin(angleSlice * i - HALF_PI - this.fullGraphOptions.spin))
          .text(d => d)
          .call(wrap, this.fullGraphOptions.wrapWidth)
          .style("pointer-events","auto")
          .attr("id", (d, i) => `${this.pillarName}axis${i}`)
          this.graphRanks[0].axes.map((axis, i) => {
            tippy(`#${this.pillarName}axis${i}`, {
              content() {
                const template = document.getElementById(`${rootThis.pillarName}${i}`);
                return template.innerHTML;
              },
              theme: 'light',
              interactive: true,
              allowHTML: true,
              appendTo: () => document.body
            });
          })
          // .on('mouseover', function (d) {
          //   let sourceLink;
          //   try { sourceLink = this.keyMetadata[0][d].sourceLink }
          //   catch (error) { sourceLink = "Link" }
          //   let pillarData, indicatorValue, sourceName, longDefinition;
          //   try {
          //     pillarData = this.graphRanks[0][`${this.pillarName}Rank`]
          //     for (let el in pillarData) {
          //       if (pillarData[el].axis == d) {
          //         indicatorValue = pillarData[el].value
          //       }
          //     }
          //   }
          //   catch (error) { indicatorValue = "No Data" }
          //
          //   try {
          //     sourceName = this.keyMetadata[0][d].sourceName;
          //   }
          //   catch (error) { sourceName = "Source" }
          //
          //   try {
          //     longDefinition = this.keyMetadata[0][d].longDefinition
          //   }
          //   catch (error) {
          //     longDefinition = d
          //   }
          //
          //   let value = parseFloat(this.graphData[0].axes.filter(obj => { return obj.axis === d })[0].value);
          //   value = value>0.001 ? value=value.toFixed(3) : value=value.toString();
          //   // TODO: store colors somwhere
          //   let pillarColors = { "Blue": "#0BC6FF", "Climate": "#0DB14B", "Digital": "#F58220" }
          //   let pillarColor = pillarColors[this.pillarName]
          //   document.getElementById('tooltipIndicatorContent').innerHTML = '<h4 style="color:' + pillarColor + '">' + d +
          //     '</h4><h6 style="display:inline">Definition: ' + '</h6><p>' + longDefinition + '</p><h6 style="margin-top:4px;">' + "Source: " + sourceName + '</h6><a href="' + sourceLink +
          //     '"><h6 style="color:black">' + "Rank: " + this.rankFormat(indicatorValue.toString()) + '</h6></a>' +
          //     '<h6 style="color:blue">' + "Value: " + value  + '</h6></a>';
          //
          //   tooltip3.setAttribute('data-show', '');
          //   keyIndicatorPopperInstance[d].update();
          //
          // })
          // .on('mouseout', function () {
          //   tooltip3.removeAttribute('data-show');
          // })
          // .on('click', function (d) {
          //   window.open(this.keyMetadata[0][d].sourceLink, '_blank');
          // });
      }
      const radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

      let blobWrapper = g.selectAll(".radarWrapper")
        .data(this.graphRanks)
        .enter().append("g")
        .attr("class", "radarWrapper");

      const tooltip2 = g.append("text")
        //.attr("class", "tooltip")
        .attr('x', 0)
        .attr('y', 0)
        .attr("class", "spiderTooltip")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style('display', 'none')
        .attr("text-anchor", "middle")
        .attr("z-index", 100)
        .attr("dy", "0.35em");

      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", d => radarLine(d.axes))
        .style("fill", (d, i) => this.fullGraphOptions.color(i))
        .style("fill-opacity", this.fullGraphOptions.opacityArea)
        .style("pointer-events","auto")
        .on('mouseover', function (d) {
          //Dim all blobs
          parent.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1);
          //Bring back the hovered over blob
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);

          //tooltip with name of country
          tooltip2
            .attr('x', 0)
            .attr('y', 0)
            .transition()
            .style('display', 'block')
            .text(function () {
              return rootThis.allKeyData[d.name]["Profile"].Country
            });
        })
        .on('mouseout', () => {
            //Bring back all blobs
            parent.selectAll(".radarArea")
              .transition().duration(200)
              .style("fill-opacity", rootThis.fullGraphOptions.opacityArea);
            tooltip2.transition()
              .style('display', 'none').text('');
          });
      //Create the outlines
      blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d) { return radarLine(d.axes); })
            .style("stroke-width", this.fullGraphOptions.strokeWidth + "px")
            .style("stroke", (d, i) => this.fullGraphOptions.color(i))
            .style("fill", "none")
            .style("filter", "url(#glow)")
            .style("pointer-events","none");

      //Append the circles
      blobWrapper.selectAll(".radarCircle")
            .data(d => d.axes)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", rootThis.fullGraphOptions.dotRadius)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - HALF_PI - rootThis.fullGraphOptions.spin))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - HALF_PI - rootThis.fullGraphOptions.spin))
            .style("fill", "#ffffff")//(d) => this.fullGraphOptions.color(d.id))
            .style("fill-opacity", 0.8)
            .style("pointer-events","none");

      const tooltip = g.append("text")
            .attr('x', 0)
            .attr('y', 0)
            .attr("class", "spiderTooltip")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style('display', 'none')
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")

      //Wrapper for the invisible circles on top
      const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(rootThis.graphRanks)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(d => d.axes)
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", rootThis.fullGraphOptions.dotRadius * 1.5)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - HALF_PI - rootThis.fullGraphOptions.spin))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - HALF_PI - rootThis.fullGraphOptions.spin))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d) {
              if(rootThis.pillarName !== 'MVI2'){
                tooltip
                  .attr('x', this.cx.baseVal.value)
                  .attr('y', this.cy.baseVal.value - 10)
                if (this.pillarName == "MVI") {
                  tooltip.transition()
                    .style('display', 'block')
                    .text(rootThis.nFormatter(d.value,2));
                } else if (this.pillarName=="customIndex") {
                  tooltip.transition()
                    .style('display', 'block')
                    .text(this.nFormatter(d.value,2)+", "+d.axis);
                } else {
                  tooltip.transition()
                    .style('display', 'block')
                    .text(function () {
                      let value = rootThis.graphData[0].axes.filter(obj => { return obj.axis === d.axis })[0].value
                      if (isNaN(value)) {
                        return ""
                      }
                      else {
                        return rootThis.nFormatter(value,2) + ", " + rootThis.rankFormat(d.value.toString()) + rootThis.fullGraphOptions.unit;
                      }
                    })
                  }
                }
              })
              .on("mouseout", function () {
                tooltip.transition()
                  .style('display', 'none').text('');
              });

              d3.select("#spiderLegend").select("svg").remove();

              //Initiate the radar chart SVG
              let svgLegend = d3.select("#spiderLegend").append("svg")
                .attr("width", "100%")
                .attr("height", 40)

              if (this.fullGraphOptions.legend !== false && typeof this.fullGraphOptions.legend === "object") {
                let legendZone = svgLegend;//.append('g');
                let names = this.graphRanks.map(el => el.name);
                let legend = legendZone.append("g")
                  //.attr("class", "legend")
                  .attr("height", 40)
                  .attr("width", "100%")
                  .attr('transform', `translate(${this.fullGraphOptions.legend.translateX},${this.fullGraphOptions.legend.translateY})`)
                  .style("background-color", "red");
                // Create rectangles markers
                legend.selectAll('rect')
                  .data(names)
                  .enter()
                  .append("rect")
                  .attr("x", 20)
                  .attr("y", 5)
                  .attr("width", 10)
                  .attr("height", 10)
                  .style("fill", (d, i) => this.fullGraphOptions.color(i));
                // Create labels
                legend.selectAll('text')
                  .data(names)
                  .enter()
                  .append("text")
                  .attr("x", this.fullGraphOptions.w - 52)
                  .attr("y", (d, i) => i * 20 + 9)
                  .attr("font-size", "9px")
                  .attr("fill", "#737373")
                  .text(d => this.allKeyData[d]["Profile"].Country);
              }
              return svg;
    },

    // TODO: move these to mixins
    rankFormat(num) {
      if (num < 20 && num > 10) {
        return num.toString() + "th"
      }
      else if (num.slice(-1) == 1) { return num.toString() + "st" }
      else if (num.slice(-1) == 2) { return num.toString() + "nd" }
      else if (num.slice(-1) == 3) { return num.toString() + "rd" }
      else { return num.toString() + "th" }
    },
    nFormatter(num, digits) {
      let si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" }
      ];
      let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  },
  watch: {
    activeCountries() {
      this.$nextTick(this.drawGraph);
    }
  },
  mounted() {
    this.drawGraph();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .graph-container{
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
