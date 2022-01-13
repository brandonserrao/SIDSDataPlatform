import * as d3 from 'd3';

import {
  initVizEngine,
  initCountrySvgs,
  appendCountryTitles,
  appendAllElements,
  appendCountryTitles3,
  appendCountryTitles2,
  appendCountryRectangles,
  appendCountryCircles,
  initYAxis,
  initChoroLegend,
  initXAxis,
  hideChoroLegend,
  showChoroLegend,
  appendMultiRectangles} from './vizEngineInit'


  import { updateVizEngine,
  updateLinesAndMap ,
  updateCountrySvgColors,
  updateCountryPositions,
  countriesWithNoData,
  updateCountryTitles,
  updateRectangles,
  updateLabels,
  updateCircles,
  updateChoroLegend,
  updateIndexRectangles,
  updateBarAxis,
  updateYAxis,
  updateRegionLables,
  updateVizBlocks
} from './vizEngineUpdate';

  import {
    processVizElementAttributes,
    vizTransform,
    rectTransform,
    labelTransform,
    circleTransform,
    textTransform,
    multiRectTransform
  } from './vizEngineElementAttributes'

import {
  getIndexValues,
  preprocessIndexWeights,
  getIndexDataYears,
  getMinMaxObj,
  computeSubindexValues,
  computeIndexValues,
  processSpiderData,
  drawIndexSpider,
  getIndexCountryList } from './processIndexData'

import {
  initTimeSeries,
  updateTimeChart,
  parse
} from './timeSeries'

    // <script src="scripts/vizEngineUpdate.js"></script>
    // <script src="scripts/vizEngineElementAttributes.js"></script>
    // <script src="scripts/vizEngineGlobals.js"></script>
    // <script src="scripts/vizEngineHandlers.js"></script>
    // <script src="scripts/vizEngineHelperFunctions.js"></script>
    // <script src="scripts/vizEngineInit.js"></script>
    // <script src="scripts/processIndexData.js"></script>
export default class Choro {
  constructor({viz, year, countyType, selectedIndis, indicatorCode, page, indicatorMeta, legendContainerSelector, mapContainerSelector, profileData, vizContainerWidth, vizContainerHeight, sidsXML, mapLocations}) {
    this.initState({viz, year, countyType, selectedIndis, indicatorCode, page, indicatorMeta,legendContainerSelector, mapLocations, mapContainerSelector, vizContainerWidth, vizContainerHeight, profileData})
    this.initVizEngine({sidsXML})
  }
  initState({
    viz,
    year,
    countyType,
    page, selectedIndis,
    indicatorMeta,
    indicatorCode,
    mapLocations,
    mapContainerSelector,
    legendContainerSelector,
    vizContainerWidth,
    vizContainerHeight,
    profileData}){
    this.mapLocations = mapLocations;
    this.countyType = countyType || 'All';
    this.page = page || 'mvi' ;
    this.indiSelections = {
      viz,
      sortby: 'rank',
      year,
      mviPreset:'mviLi'
      //   indiSelections["viz"] = $(".selectedViz")[0].children[0].innerHTML;
      //   indiSelections["page"] = $(".selectedPage").attr("id");
      //   indiSelections["sortby"] = $(".selectedSortby")[0].children[0].innerHTML;
      //   indiSelections["year"] = "recentValue"; /// temp until year selector is in place
      //   indiSelections["mviPreset"] = $(".selectedMviPreset")[0].id;
    };
    this.bboxInit = 0;
    this.bboxDict = {};
    this.indicatorMeta = indicatorMeta;
    this.textBBoxDict = {};
    this.legendContainerSelector = legendContainerSelector;
    this.profileData = profileData;
    this.selectedIndis = selectedIndis;
    this.main_chart_svg = d3.select(mapContainerSelector)
      .append("svg")
      .attr("width", vizContainerWidth)
      .attr("height", vizContainerHeight);
    this.choro_legend_svg = d3.select(legendContainerSelector)
      .append("svg")
      .attr("width", vizContainerWidth)
      .attr("height", vizContainerHeight);
    if(indicatorCode!=='region'){
      this.updateVizEngine(indicatorCode)
    }
  }
  updateVizType (vizType) {
    this.indiSelections.viz = vizType;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
  updatePageType ({page, chartType, codes, code}) {
    this.page = page;
    this.indiSelections.viz = chartType;
    if(codes) {
      this.selectedIndis = codes;
    }
    if(code) {
      this.updateVizEngine(code)
    }
  }
  updateSortingType (sorting) {
    this.indiSelections.sortby = sorting;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
  updateMviCodes(codes) {
    this.selectedIndis = codes;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
  updateCountryTypeFilterType(countyType) {
    this.countyType = countyType
    this.updateVizEngine(this.indicatorCodeInitial)
  }
}
Choro.prototype.initVizEngine = initVizEngine;
Choro.prototype.initCountrySvgs = initCountrySvgs;
Choro.prototype.appendCountryTitles = appendCountryTitles;
Choro.prototype.appendAllElements = appendAllElements;
Choro.prototype.appendCountryTitles3 = appendCountryTitles3;
Choro.prototype.appendCountryTitles2 = appendCountryTitles2;
Choro.prototype.appendCountryRectangles = appendCountryRectangles;
Choro.prototype.appendCountryCircles = appendCountryCircles;
Choro.prototype.initYAxis = initYAxis;
Choro.prototype.updateVizEngine = updateVizEngine;
Choro.prototype.updateLinesAndMap = updateLinesAndMap;
Choro.prototype.initChoroLegend = initChoroLegend;
Choro.prototype.processVizElementAttributes = processVizElementAttributes;
Choro.prototype.updateCountrySvgColors = updateCountrySvgColors;
Choro.prototype.vizTransform = vizTransform;
Choro.prototype.rectTransform = rectTransform;
Choro.prototype.labelTransform = labelTransform;
Choro.prototype.circleTransform = circleTransform;
Choro.prototype.textTransform = textTransform;
Choro.prototype.updateCountryPositions = updateCountryPositions;
Choro.prototype.countriesWithNoData = countriesWithNoData;
Choro.prototype.updateCountryTitles = updateCountryTitles;
Choro.prototype.updateRectangles = updateRectangles;
Choro.prototype.updateLabels = updateLabels;
Choro.prototype.updateCircles = updateCircles;
Choro.prototype.updateChoroLegend = updateChoroLegend;
Choro.prototype.hideChoroLegend = hideChoroLegend;
Choro.prototype.showChoroLegend = showChoroLegend;
Choro.prototype.updateIndexRectangles = updateIndexRectangles
Choro.prototype.updateBarAxis = updateBarAxis;
Choro.prototype.initXAxis = initXAxis;
Choro.prototype.updateYAxis = updateYAxis;
Choro.prototype.getIndexCountryList = getIndexCountryList;
Choro.prototype.drawIndexSpider = drawIndexSpider;
Choro.prototype.processSpiderData = processSpiderData;
// Choro.prototype.mviBarChart = mviBarChart;
// Choro.prototype.mviColumnChart = mviColumnChart;
Choro.prototype.appendMultiRectangles = appendMultiRectangles;
Choro.prototype.getIndexValues = getIndexValues
Choro.prototype.preprocessIndexWeights = preprocessIndexWeights
Choro.prototype.getIndexDataYears = getIndexDataYears
Choro.prototype.getMinMaxObj = getMinMaxObj
Choro.prototype.computeSubindexValues = computeSubindexValues
Choro.prototype.computeIndexValues = computeIndexValues
Choro.prototype.processSpiderData = processSpiderData
Choro.prototype.drawIndexSpider = drawIndexSpider
Choro.prototype.getIndexCountryList = getIndexCountryList
Choro.prototype.multiRectTransform = multiRectTransform;
Choro.prototype.updateVizBlocks = updateVizBlocks;
Choro.prototype.initTimeSeries = initTimeSeries;
Choro.prototype.updateTimeChart = updateTimeChart;
Choro.prototype.parse = parse;
Choro.prototype.updateRegionLables = updateRegionLables;
