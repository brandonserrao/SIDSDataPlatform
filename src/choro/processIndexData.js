import {
  indexWeightsDict
} from './index-data';

import {
  sidsDict,
  countryListSpider
} from './vizEngineGlobals';

import {
  normalizeIndex,
  sort_object,
  isNumeric
} from './vizEngineHelperFunctions';

import {
  RadarChart
} from './radar.js';

import * as d3 from 'd3';


export function getIndexValues(indexData) {
  let indexWeights = this.preprocessIndexWeights()

  let indexYears = this.getIndexDataYears(indexData)

  let minMaxObj = this.getMinMaxObj(indexData, indexWeights, indexYears)

  let allValues = this.computeSubindexValues(indexData, indexWeights, indexYears, minMaxObj)

  allValues.index = { data: this.computeIndexValues(allValues,indexWeights,indexYears) };
  return allValues;
}

export function preprocessIndexWeights(){

  let indexWeights = JSON.parse(JSON.stringify(indexWeightsDict[this.indicatorCode]));//deep copy

  if (this.indicatorCode == "mvi-index-index") {
    for (let subindexCode in indexWeights["subindices"]) {
      let subindexWeight=0
      for (let subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
// TODO: include subindexList filter
        if (!this.selectedIndis.includes(subsubindexCode)) {
          delete  indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode];
        } else {
         // indexWeights[subindexCode]["subindices"][subsubindexCode] = 1;
          subindexWeight=1
        }
      }
      indexWeights["subindices"][subindexCode]["weight"]=subindexWeight
    }
  }

  let weightTotalObj={},
  indexWeightTotal=0;
  for (let subindexCode in indexWeights["subindices"]) {
    let subindexWeightTotal=0
    for (let subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
      subindexWeightTotal += indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]
    }
    indexWeightTotal += indexWeights["subindices"][subindexCode]["weight"]
    weightTotalObj[subindexCode]=subindexWeightTotal
  }
  weightTotalObj.index=indexWeightTotal

  for (let subindexCode in indexWeights["subindices"]) {
    for (let subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
      if(weightTotalObj[subindexCode]!=0) {
        indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]=indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]/weightTotalObj[subindexCode]
      }
      else {
        indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]=0
      }
    }
    if(weightTotalObj["index"]!=0){
      indexWeights["subindices"][subindexCode]["weight"]=indexWeights["subindices"][subindexCode]["weight"]/weightTotalObj["index"]
    } else {
      indexWeights["subindices"][subindexCode]["weight"]=0
    }
  }
  return indexWeights;
}

export function getIndexDataYears(indexData){
  let indexYears;
  if (this.indiSelections["viz"] == "series") {
    indexYears = Object.keys(indexData[Object.keys(indexData)[0]]["data"]);
  } else {
    indexYears = [this.indiSelections["year"]];
  }
  return indexYears;
}

export function getMinMaxObj(indexData, indexWeights){
  let minMaxObj={};
  for(let subindexCode in indexWeights["subindices"]){
    for(let subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]){
      let minn=9999999,
      maxx=-9999999,
      indexYears=["recentValue"]
      for(let i in indexYears){
        let year=indexYears[i],
        arr = Object.values(indexData[subsubindexCode]["data"][year]).filter((item) => isNumeric(item)),
        min = Math.min(...arr),
        max = Math.max(...arr);
        if(min<minn){
          minn=min}
        if(max>maxx){maxx=max}
      }
      let minMax={"maxx":maxx,"minn":minn}
      minMaxObj[subsubindexCode]=minMax
    }
  }
  return minMaxObj
}

export function computeSubindexValues(indexData,indexWeights,indexYears,minMaxObj){
  let allValues = {};
  for (let subindexCode in indexWeights["subindices"]) {
    let subindexValues = {},
    subindexWeight=indexWeights["subindices"][subindexCode]["weight"];
    for (let i in indexYears) {
      let yearValues = {},
      year = indexYears[i],
      noData = [];

      for (let country in sidsDict) {
        let subindexValue = 0;
        for(let subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
          let subsubindexWeight =indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]*100;
          if (Object.keys(indexData[subsubindexCode]["data"]).includes(year)) {
            let subsubindexValue = indexData[subsubindexCode]["data"][year][country];

            if (isNaN(subsubindexValue) || subsubindexValue==0) {
              if (!noData.includes(country)) {
                noData.push(country);
              }
            } else {
              let normValue;
              if(indexWeights["normalization"] == true){
                normValue = normalizeIndex(subsubindexValue,minMaxObj[subsubindexCode]["minn"],minMaxObj[subsubindexCode]["maxx"])
              } else {
                normValue = subsubindexValue;
              }
              subindexValue += normValue * subsubindexWeight;
            }
          }
          else{
            if (!noData.includes(country)) {
              noData.push(country);
            }
          }
        }
        if (!noData.includes(country)) {
          yearValues[country] = subindexValue*subindexWeight; //this is dangerous since will have some subindices but not necessarily all
        }
      }
      subindexValues[year] = yearValues;
    }
    allValues[subindexCode] = { data: subindexValues };
  }
  return allValues;
}

export function computeIndexValues(allValues,indexWeights,indexYears){
  let indexValues = {};
  for (let i in indexYears) {
    let yearValues = {},
    year = indexYears[i],
    noData = [];
    for (let country in sidsDict) {
      let indexValue = 0;
      for (let subindexCode in indexWeights["subindices"]) {
        if (Object.keys(allValues[subindexCode]["data"]).includes(year)) {
          let subindexValue = allValues[subindexCode]["data"][year][country];
          if(isNumeric(subindexValue)){
            indexValue += subindexValue;
          }
          else{
            if (!noData.includes(country)) {
              noData.push(country);
            }
          }
        }
      }
      if (!noData.includes(country)) {
        yearValues[country] = indexValue;
      }
    }
    indexValues[year] = yearValues;
  }
  return indexValues;
}

export function processSpiderData() {
  let subindexList=Object.keys(this.indexWeights["subindices"]),
  spiderData = [];
  for (let i = 0; i < subindexList.length; i++) {
      let spiderAxes = [];
      for(let countryIndex in this.countryOrder){
        let country = this.countryOrder[countryIndex],
        newCountryData = {},
        val=0;
        newCountryData["axis"] = country;
        for(let j = subindexList.length-1; j>=i; j=j-1){
          val += this.indexData[subindexList[j]]["data"]["recentValue"][country];
        }
        newCountryData["value"] = val
        spiderAxes.push(newCountryData);
    }
    spiderData.push({ name: subindexList[i], axes: spiderAxes });
  }

  return spiderData;
}

export function drawIndexSpider() {
  let subindexList=Object.keys(this.indexWeights["subindices"]),
  margin = { top: 55, right: 50, bottom: 0, left: 0 };
  // width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right;
  // height = Math.min(
  //   width,
  //   window.innerHeight - margin.top - margin.bottom - 20
  // );
  let radarChartOptionsCustom = {
    w: 500,
    h: 420,
    margin: margin,
    maxValue: 0,
    levels: 6,
    spin: 0,
    roundStrokes: false,
    color: d3.scaleOrdinal()
      .range(["#0DB14B", "#f0db3a", "#CC333F", "#00A0B0", "#FFFFFF"]), //,
    //				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
  };

  //spiderData = processSpiderData(

   RadarChart(
    "#indexSpider",
    radarChartOptionsCustom,
    subindexList,
    "customIndex",
    { customIndex: this.spiderData }
  );
}

export function getIndexCountryList() {
  // let subindexList=Object.keys(this.indexWeights["subindices"]),
  let selectedSortby = this.indiSelections["sortby"],
  chosenCountryList;
  if (selectedSortby == "region") {
    chosenCountryList = countryListSpider.filter(item => Object.keys(this.indexData["index"]["data"]["recentValue"]).includes(item))
  } else if (selectedSortby == "rank") {
    let mviValues = this.indexData["index"]["data"]["recentValue"],
    sortedMviData = sort_object(mviValues),
    sortedCountryList = Object.keys(sortedMviData);

    //this filter removes any empty elements
    chosenCountryList = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value
  }
  return chosenCountryList;
}
