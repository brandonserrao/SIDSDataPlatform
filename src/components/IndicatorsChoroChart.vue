<template>
  <div class="choro">
    <div id="choro-legend">
      <img id="choro-legend_region" src="https://sids-dashboard.github.io/SIDSDataPlatform/images/tempChoroLegend.jpg" alt="">
    </div>
    <div id="choro-map">
    </div>
  </div>
</template>

<script>
import service from '@/services';
import * as d3 from 'd3';
import { mapState } from 'vuex';


export default {
  name: 'IndicatorsChoroChart',
  data: function () {
    return {
      mw:800,
      mh:580,
      mainChartSvg: null,
      choroLegendSvg: null,
      sidsSVG: null,
      mapLocations: null,
      sidsMaps: null,
      countryListLongitude:["Belize", "Jamaica", "Cayman Islands", "Cuba", "The Bahamas", "Curaçao", "Aruba", "Haiti", "Dominican Republic",
        "St. Kitts and Nevis", "Sint Maarten","Antigua and Barbuda", "Montserrat", "Dominica", "St. Lucia"
        , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname", "", "",
        "Cabo Verde", "Guinea-Bissau",
        "São Tomé and Príncipe", "Comoros", "Bahrain", "Mauritius", "Seychelles", "Maldives", "Singapore", "", "",
        "Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
        "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Niue", "Samoa", "Cook Islands"],
      indexCodes:["mvi"]
    }
  },
  props:['indicatorCode'],
  computed: {
    ...mapState({
      profileData: state => state.indicators.profileData,
    })
  },
  methods:{
    initChart() {

    },
    appendLinesMapAndRegions() {
      this.mainChartSvg
        .append("svg:image")
        .attr("x", -18)
        .attr("y", -415)
        .attr("width", 879)
        .attr("height", 1000)
        .attr("xlink:href", "graphics/SIDS_map_clean-01.png")
        .attr("opacity", 0)
        .attr("class", "choroMap")
        .attr("z-index", -10);

      this.mainChartSvg
        .append("line")
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .attr("x1", 80)
        .attr("y1", 263)
        .attr("x2", 740)
        .attr("y2", 263)
        .classed("regionLine");

      this.mainChartSvg
        .append("line")
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .attr("x1", 80)
        .attr("y1", 363)
        .attr("x2", 740)
        .attr("y2", 363)
        .classed("regionLine");

      this.mainChartSvg
        .append("text")
        .attr("x", 775)
        .attr("y", 460)
        .text("Pacific")
        .style("fill", "#" + this.regionColors("Pacific", "Y").substring(1))
        .attr("id", "pacificRegionTitle")
        .attr("class", "block-subheader");
      this.mainChartSvg
        .append("text")
        .attr("x", 760)
        .attr("y", 130)
        .text("Caribbean")
        .style("fill", "#" + this.regionColors("Caribbean", "Y").substring(1))
        .attr("id", "caribbeanRegionTitle")
        .attr("class", "block-subheader");
      this.mainChartSvg
        .append("text")
        .attr("x", 785)
        .attr("y", 335)
        .text("AIS")
        .style("fill", "#" + this.regionColors("AIS", "Y").substring(1))
        .attr("id", "aisRegionTitle")
        .attr("class", "block-subheader");
    },
    createInitSVGTemplate() {
      this.mainChartSvg = d3.select("#choro-map")
        .append("svg")
        .attr('width', 800)
        .attr('height', 580);
      this.choroLegendSvg = d3.select("#choro-legend")
              .append("svg")
              .attr("width", 800)
              .attr("height", 60);
    },
    regionColors(region, member) {
      region = region.toLowerCase()
      if (member == "N") { return "black" }
      else if (region == "caribbean") { return "c008080"; }
      else if (region == "pacific") { return "cF0A500"; }
      else if (region == "ais") { return "c97002B"; }
      else { return "black" }
    },
    getBoundingBox(selection) {
        /* get x,y co-ordinates of top-left of bounding box and width and height */
      let element = selection.node(),
      bbox = element.getBBox(),
      cx = bbox.x + bbox.width / 2,
      cy = bbox.y + bbox.height / 2;
      return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
    },
    initCountrySvgs(){
      let rootThis = this;
      d3.select(this.sidsMaps)
      .selectAll("path")
      .on("mouseover", function () {
        if (d3.select(this).classed("countryActive"))
          return; /* no need to change class when county is already selected */
        d3.select(this).attr("class", "countryHover");
      })
      .on("mouseout", function () {
        if (d3.select(this).classed("countryActive")) return;
        d3.select(this).attr("class", function () {
          return (
            rootThis.regionColors(
              rootThis.profileData[this.id].Region,
              rootThis.profileData[this.id]["Member State (Y/N)"]
            ) + " shadow countrySvg"
          );
        });
      })
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!//////

      // .on("click", function () {
      //   zoomed(d3.select(this), this.id); //, rootThis.profileData[this.id].Region);
      //   //d3.select(this).style("fill", "blue");
      // });
      d3.select(this.sidsMaps)
      .selectAll("path")
      .each(function () {
         /* Let's add an id to each group that wraps a path */
        d3.select(this.parentNode).attr("id", this.id);
      });

      d3.select(this.sidsMaps)
      .selectAll("path") // Map countries to regional colors
      .attr("class", function () {
         return (
          rootThis.regionColors(rootThis.profileData[this.id].Region,rootThis.profileData[this.id]["Member State (Y/N)"]
          ) + " shadow countrySvg"
        );
      });
    },
    appendCountryTitles() {
      let rootThis = this;
      d3.select("#allSids")
        .selectAll("g")
        .append("svg:text")
        .text(function () {
          try {
            return rootThis.profileData[this.parentNode.id].Country;
          } catch {
            return this.parentNode.id;
          }
        })
        .attr("x", function () {
          return rootThis.getBoundingBox(d3.select(this.parentNode).select("path"))[4];
        })
        .attr("y", function () {
          return rootThis.getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
        })
        .attr("font-size", 10)
        .classed("choroText", true);
    },
    appendCountryTitles2() {
      d3.select("#allSids")
        .selectAll("g")
        .append("svg:text")
        .classed("choroText2", true);
    },
    appendCountryTitles3() {
      let rootThis = this;
      d3.select("#allSids")
        .selectAll("g")
        .append("svg:text")
        .text(function () {
          try {
            return rootThis.profileData[this.parentNode.id].Country;
          } catch {
            return this.parentNode.id;
          }
        })
        .attr("font-size", 10)
        .attr("fill-opacity", 0)
        .attr("transform", "rotate(45)")
        .attr("y", function () {
          try {
            let text = rootThis.profileData[this.parentNode.id].Country;
            return -1 * 9.65 * rootThis.countryListLongitude.indexOf(text) + 265;
          } catch {
            return 0;
          }
        })
        .attr("x", function () {
          let text = rootThis.profileData[this.parentNode.id].Country,
          index = rootThis.countryListLongitude.indexOf(text);
          if (index >= 0) {
            return 9.65 * index + 345;
          } else {
            //not the best way of making these hidden. should be improved
            return -1000;
          }
        })
        .classed("choroText3", true);
    },
    appendCountryRectangles() {
      let rootThis = this;
      d3.select("#allSids")
        .selectAll("g")
        .append("rect")
        .style("fill", function () {
          return (
            "#" +
            rootThis.regionColors(rootThis.profileData[this.parentNode.id].Region, "Y").substring(1)
          );
        }) //
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect", true);
    },
    appendCountryLabels() {
      let rootThis = this;
      d3.select("#allSids")
        .selectAll("g")
        .append("svg:text")
        .text("")
        .attr("x", function () {
          return rootThis.getBoundingBox(d3.select(this.parentNode).select("path"))[4];
        })
        .attr("y", function () {
          return rootThis.getBoundingBox(d3.select(this.parentNode).select("path"))[5];
        })
        .attr("font-size", 10)
        .attr("fill-opacity", 0)
        .classed("countryLabel", true)
        .attr("visibility", "visible");
    },
    appendCountryCircles() {
      let rootThis = this;
      d3.select("#allSids")
        .selectAll("g") //.selectAll('circle')
        .append("circle")
        .style("fill", function () {
          return (
            "#" +
            rootThis.regionColors(rootThis.profileData[this.parentNode.id].Region, "Y").substring(1)
          );
        })
        .attr("r", 0)
        .classed("choroCircle", true);
    },
    initYAxis() {
      this.mainChartSvg
        .append("g")
        .attr("class", "multiYAxis")
        .attr("visibility", "hidden");
      this.mainChartSvg
        .append("text")
        .attr("class", "yAxisTitle")
        .attr("transform", "rotate(-90)")
        .text(function () {
          return ""; //wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " +
        })
        .attr("text-anchor", "middle")
        .attr("x", -240)
        .attr("font-weight", "bold")
        .attr("fill-opacity", 0);
    },
    handleIndicatorSelect() {
      // this.showDescription(dimensions,index,indicatorCode)
      console.log(this.indicatorCode)
      this.updateVizEngine(this.indicatorCode);
    },
    updateVizEngine() {

    }
  },
  async mounted() {
    d3.select(self.frameElement).style("height", "650px");
    let sidsXML = await service.loadSidsSVG(),
    svgMap = sidsXML.getElementsByTagName("g")[0];
    this.mapLocations = await service.loadMapLocations();
    this.createInitSVGTemplate();
    this.sidsMaps = d3
      .select("#choro-map")
      .selectAll("*")
      .node()
      .appendChild(svgMap);
    this.initCountrySvgs();

    this.appendLinesMapAndRegions();
    this.appendCountryTitles();
    this.appendCountryTitles2();
    this.appendCountryTitles3();
    this.appendCountryRectangles();
    this.appendCountryLabels();
    this.appendCountryCircles();
    this.initYAxis();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* style.css */
.allSids {
  fill: #fee391;
  stroke: #333;
  stroke-width: 1px;
  filter: drop-shadow(1px 1px 0px purple);
}

.countryHover {
  fill: #91eefe;
  filter: drop-shadow(1px 1px 0px purple);
  cursor: pointer;
}

.shadow {
  filter: drop-shadow(1px 1px 0px black);
}

.countryHighlight {
  fill: #fec44f;
}

.region.NI {
  fill: #aaa;
  stroke: #aaa;
}

/* Colors taken from colorbrewer2.org - blue */
.b0-9 {
  fill: #f7fbff;
}

.b1-9 {
  fill: #deebf7;
}

.b2-9 {
  fill: #c6dbef;
}

.b3-9 {
  fill: #9ecae1;
}

.b4-9 {
  fill: #6baed6;
}

.b5-9 {
  fill: #4292c6;
}

.b6-9 {
  fill: #2171b5;
}

.b7-9 {
  fill: #08519c;
}

.b8-9 {
  fill: #08306b;
}

/* Colors taken from colorbrewer2.org - red */
.r0-9 {
  fill: #fff5f0;
}

.r1-9 {
  fill: #fee0d2;
}

.r2-9 {
  fill: #fcbba1;
}

.r3-9 {
  fill: #fc9272;
}

.r4-9 {
  fill: #fb6a4a;
}

.r5-9 {
  fill: #ef3b2c;
}

.r6-9 {
  fill: #cb181d;
}

.r7-9 {
  fill: #a50f15;
}

.r8-9 {
  fill: #67000d;
}

/* Colors taken from colorbrewer2.org - green */
.g0-9 {
  fill: #f7fcf5;
}

.g1-9 {
  fill: #e5f5e0;
}

.g2-9 {
  fill: #c7e9c0;
}

.g3-9 {
  fill: #a1d99b;
}

.g4-9 {
  fill: #74c476;
}

.g5-9 {
  fill: #41ab5d;
}

.g6-9 {
  fill: #238b45;
}

.g7-9 {
  fill: #006d2c;
}

.g8-9 {
  fill: #00441b;
}

.choroText {
  text-anchor: middle;
  color: black;
}

#choro-legend {
  margin: 0;
  padding: 0;
}

#choro-map svg {
  margin-top: 5px;
  margin-bottom: -5px;
  padding-bottom: 0px;
  padding-top: 10px;
  overflow: visible;
}

.indicatorFilter {
  margin: 0;
  text-align: center;
  padding: 0;
  margin-bottom: 5px;
}

#indicatorSubCategorySelect, #indicatorSubCategorySelect2 {
  font-size: 14px;
  height: 30px;
  width: 100%;
}

#indicatorCategorySelect, #indicatorCategorySelect2 {
  font-size: 16px;
  height: 40px;
  margin-top: 28px;
  width: 100%;
}

#indicatorSelectBox2 {
  display: none;
}

.listbox {
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}

.listbox ul {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.listbox li {
  padding: 4px;
  cursor: pointer;
}

.listbox li:hover {
  background-color: #bbb;
}

.listbox li.indiActive {
  background: #4db052;
  font-size: 14px;
  font-weight: bold;
}

.listbox li.indiActive2 {
  background: #b14cb6;
  font-size: 14px;
  font-weight: bold;
}

.listbox li {
  -webkit-transition: background-color 200ms linear;
  -moz-transition: background-color 200ms linear;
  -o-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}

.listbox::-webkit-scrollbar {
  width: 8px;
}

.listbox::-webkit-scrollbar-track {
  background: white;
}

#indicatorSelect {
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelect2 {
  width: 100%;
  height: 100px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelectorColumn {
  margin: 0;
  padding: 0;
}

.c008080 {
  fill: #008080;
}

.cF0A500 {
  fill: #F0A500;
}

.c97002B {
  fill: #97002B;
}

.nodata {
  fill: #F4F5F8;
}

#choroInfoBox p {
  font-size: 12px;
  text-align: left;
}

#choroIndiSource {
  padding: 0;
}

#choroInfoBox h4 {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

#choroInfoBox {
  height: 212px;
  margin: 0;
  padding: 0;
  padding: 12px;
  margin-top: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #e9e6e6;
  border: 0.5px solid gray;
}

#choroInfoBox::-webkit-scrollbar-track {
  background: #e9e6e6;
}

#choroInfoBox::-webkit-scrollbar {
  width: 8px;
}

.textNum, .textNumEnd {
  font-family: sans-serif;
  fill: black;
  font-size: 12px;
}

.choroLegendTitle {
  font-family: sans-serif;
  fill: black;
  font-size: 14px;
  font-weight: bold;
}

#indicatorExportDiv {
  float: right;
  margin-top: -50px;
}

#tooltipIndicatorContent {
  max-width: 350px;
}

#choro-legend {
  height: 57px;
  width: 90%;
  overflow: visible;
}

#choro-legend_region {
  height: 42px;
  margin-left: 120px;
  margin-top: 5px;
  padding: 0;
}

#countryDataPanel h2 {
  padding-top: 40px;
}

.timeSeriesTooltip {
  position: absolute;
  background-color: #f5f5f5;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
}

/*# sourceMappingURL=vizEngine.css.map */

</style>
