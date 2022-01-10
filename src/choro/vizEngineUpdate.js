import * as d3 from 'd3';

import {
  indexDict,
  hues,
  mviDimensions,
  mviDimensionList,
  mviCountryListLongitude
} from './vizEngineGlobals';

import {
  regionColors,
  getRandomInt,
  getIsoByName,
  nFormatter,
  getBoundingBox
} from './vizEngineHelperFunctions';

import {
  indexCodes
} from './index-data';

///////////////////////
//////Main update function
//////////////////////////////////////


export function updateVizEngine(indicatorCode) {
  console.log('upd', indicatorCode)

  this.indicatorCodeInitial = indicatorCode;
  this.indicatorCode = indicatorCode;

  if(this.page=="mvi"){
    this.indicatorCode = "mvi-index-index";
  }

  if (this.indicatorCode == "region") {
    this.indicatorCode = "hdr137506-compositeIndices";///temp so has something to attach to data
  }

  if (indexCodes.includes(this.indicatorCode)) {
    this.vizMode = "index";
    this.apiCode="indexData-" + indexCodes[this.indicatorCode];
  } else {
    this.vizMode = "indicator";
    let codeSplit = this.indicatorCode.split("-");
    this.apiCode="indicatorData-"+codeSplit[codeSplit.length - 1]
  }
    // updateVizSliders();
//   //package selections
//   indiSelections = {};
//   indiSelections["viz"] = $(".selectedViz")[0].children[0].innerHTML;
//   indiSelections["page"] = $(".selectedPage").attr("id");
//   indiSelections["sortby"] = $(".selectedSortby")[0].children[0].innerHTML;
//   indiSelections["year"] = "recentValue"; /// temp until year selector is in place
//   indiSelections["mviPreset"] = $(".selectedMviPreset")[0].id;
//
//   ///also selectedRegion, selected statType
//
//   console.log(indiSelections,indicatorCode)
//
//     ///update all and page elements
    // updateVizBlocks(indiSelections);
    this.updateLinesAndMap();
//   ////////
//   /////get indicator data,,proceed only once indicator data has been pulled
//
//
//
  d3.json(
    "https://sids-dashboard.github.io/api/data/"+  this.apiCode + ".json"
  ).then((dat) => {
    if(vizMode=="indicator"){
      this.indicatorData = dat[this.indicatorCode];
    }
    if(this.vizMode=="index"){
      this.indiexData = this.getIndexValues(dat)
      this.indicatorData = this.indiexData["index"]
      this.indexWeights = JSON.parse(JSON.stringify(indexWeightsDict[indexCode]));//deep copy
      this.indiSelections["countryOrder"] = this.getIndexCountryList()

      let spiderData = this.processSpiderData()

      this.indiSelections["spiderData"]=spiderData
      this.drawIndexSpider()
    }
//
//    console.log(indicatorData)
      let quantize = quantizeData(this.indicatorData,this.indiSelections),
      noData = this.countriesWithNoData();
//
    if(!this.firstIndicatorInit){
      this.initChoroLegend(quantize);// require data to be loaded
      this.initXAxis()//messes chorolegend if it is too soon
    this.firstIndicatorInit=1; }
//
//     //main update functions////
      let vizElementAttributes = this.processVizElementAttributes();
//     ///////////
//
      console.log(vizElementAttributes, noData , 'values')
      this.updateCountrySvgColors(quantize);//currently color data is computed here (quantize)
      this.updateCountryPositions(vizElementAttributes);
      this.updateCountryTitles(vizElementAttributes, noData);
      this.updateRectangles(vizElementAttributes);
      this.updateIndexRectangles()
      this.updateLabels(vizElementAttributes, noData); //selectedPage, selectedViz, selectedYear,selectedSortby, indicatorData, noData)
      this.updateCircles(vizElementAttributes);
// //    updateCountryLines(vizElementAttributes);
    // updateChoroTooltips(indicatorData, indiSelections);
      this.updateChoroLegend(quantize);
      this.updateBarAxis();
      this.updateYAxis();
    // if (this.indiSelections["viz"] == "series") {
    //     ///this should pass in data directly or else it won't update based on the customMvi
    //     dataset = parse(dat);
    //     optionSelected = {
    //       countryGroupOption: tempTimeChartSelection,
    //       datasetOption: indicatorCode,
    //     };
    //     console.log({ dataset, optionSelected });
    //     updateTimeChart({ dataset, optionSelected });
    //   }
//
//       updateVizSliders()//again, just for fun
  });

}

///////////////////////
//////Run all update functions
//////////////////////////////////////
//
//
function quantizeData(indicatorData,indiSelections){
    let indicatorDataYear = indicatorData["data"][indiSelections["year"]],
    hueNum = getRandomInt(0, 3),

    max = Math.max(
        ...Object.values(indicatorDataYear).filter(function (el) {
          return !isNaN(parseFloat(el)) && isFinite(el);
        })
      ),
    min = 0;

      // Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))

      //quantize is the scale used for the choropleth and the legend
    let quantize = d3
      .scaleQuantize()
      .domain([min, max])
      .range(
        d3.range(9).map(function (i) {
          return hues[hueNum] + i + "-9";
        })
      );

   return quantize
}
//
export function countriesWithNoData() {
  let rootThis = this,
    /// make list of counties with no data (this should probably be refactored to create a list of countries with data)? Or just simplify this
  noData = [];
  d3.select(this.sidsMaps)
    .selectAll("path") /* Map  counties to  data */
    .each(function () {
      try {
        // console.log(this.id)
        let iso = this.id;
        ////need to update this to indiSelections["year"] variable
        rootThis.indiSelections["year"] = "recentValue";
        let value = rootThis.indicatorData["data"][rootThis.indiSelections["year"]][iso];
        //console.log(value)
        if (value == "No Data" || typeof value != "number") {
          noData.push(iso);
        }
      } catch (error) {console.log(error)} //console.log(error)}//console.log(error) }
    });
  return noData
}
//
// ///////////////////////
// //////Element update functions
// //////////////////////////////////////
// //
//
// function updateVizBlocks(indiSelections){
//
//     if (indiSelections["viz"] == "Spider") {
//         $("#indexSpider").css("display", "block");
//         console.log("show me the spider")
//       } else {
//         $("#indexSpider").css("display", "none");
//         console.log("hidey spidey?")
//       }
//
//       if (indiSelections["viz"] == "Time Series") {
//         $("#timeSeriesContainer").css("display", "block");
//       } else {
//         $("#timeSeriesContainer").css("display", "none");
//       }
//
//       if (indiSelections["page"] == "countryDataTab") {
//         if (indiSelections["viz"] == "Multi-indicator") {
//           //     $("#indicatorSelectBox2").css("display", "block");
//           $("#choroInfoBox").css("display", "none");
//         } else {
//           //      $("#indicatorSelectBox2").css("display", "none");
//           $("#choroInfoBox").css("display", "block");
//         }
//       } else {
//         //    $("#indicatorSelectBox2").css("display", "none");////need to figure out to hide the new menu
//         $("#choroInfoBox").css("display", "none");
//       }
//       if (
//         indiSelections["viz"] == "Info" ||
//         indiSelections["viz"] == "Time Series"
//       ) {
//         $("#choro_map_container").css("display", "none"); //"opacity", "0");
//       } else {
//         //opacity so it doesn't mess with the titles
//         $("#choro_map_container").css("display", "block"); //("opacity", "1");
//
//         // $("#timeSeriesContainerPage").css("display", "none")
//       }
//       if (indiSelections["viz"] == "Info") {
//         $("#mviInfoPage").show();
//       } else {
//         $("#mviInfoPage").hide();
//       }
//
//         ///hide or show Sortby Select
//   if (
//     indiSelections["viz"] == "Bar Chart" ||
//     indiSelections["viz"] == "Spider"
//   ) {
//     $("#sortbySelect").show();
//   } else {
//     $("#sortbySelect").hide();
//   }
//
//    ///hide vizselect slider if in "Region" mode (need a way to reactivate this mode in key indicators)
//    if (indicatorGlobal == "Region"&&indiSelections["page"]=="countryDataTab") {
//     document.getElementById("vizSelect").style.visibility = "hidden";
//   } else {
//     document.getElementById("vizSelect").style.visibility = "visible";
//       }
//
//
//
// }
//
// function updateVizSliders() {
//
//     if (vizMode=="index") {
//         $("#infoLi").show();
//         $("#choroLiLi").text("Spider");
//
//       } else {
//         $("#infoLi").hide();
//         $("#choroLiLi").text("Choropleth");
//       }
//
//     x = $(".selectedViz");
//   $(".vizShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
//
//   x = $(".selectedMviPreset");
//   $(".mviPresetShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
//
//   x = $(".selectedSortby");
//
//   $(".sortbyShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
// }
//
export function updateCountrySvgColors(quantize) {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],
  rootThis = this;
  ///draw choropleth scale
  if (this.indiSelections["viz"] !== "mvi") {
    /* break the data values into 9 ranges of €100 each   */


    d3.select(this.sidsMaps)
      .selectAll("path") /* Map  counties to  data */
      .attr("class", function () {
        try {
          let value = indicatorDataYear[this.id];
          if (value == "No Data" || typeof value != "number") {
            //hide country name
            if (this.indicatorCode == "Region") {
              //console.log("region",this.id)
              return (
                regionColors(
                  rootThis.profileData[this.id].Region,
                  rootThis.profileData[this.id]["Member State (Y/N)"]
                ) + " shadow countrySvg"
              );
            } else {
              //console.log("nodata",this.id)
              return "nodata countrySvg";
            }
          } else {
           if (
              rootThis.indiSelections["viz"] == "Multi-indicator" ||
              rootThis.indiSelections["viz"] == "bars" ||
              rootThis.indiSelections["viz"] == "spider" ||
              rootThis.indiSelections["viz"] == "global" ||
              rootThis.indicatorCode == "Region"
            ) {
              return (
                regionColors(rootThis.profileData[this.id].Region, "Y") +" shadow countrySvg"
              );
            } else {
              return quantize(value) + " shadow countrySvg";
            }
          }
        } catch (error) {
          console.log("broken?", this.id);
          return "nodata";
        }
      })
      .on("mouseout", function () {
        if (d3.select(this).classed("countryActive")) return;
        d3.select(this).attr("class", function () {
          /* reset county color to quantize range */
          let  stat = indicatorDataYear[this.id];

          if (rootThis.indicatorCode == "Region") {
            return (
              regionColors(rootThis.profileData[this.id].Region, "Y") +
              " shadow countrySvg"
            );
          } else {
            if (typeof stat == "undefined" || stat == "No Data") {
              //hide country name
              return "nodata countrySvg";
            } else {
              //show country name
              return quantize(stat) + " shadow countrySvg";
            }
          }
        });
      });
  } else {
    d3.select("#choro_map_container")
      .selectAll("path") /* Map  counties to  data */
      .attr("class", function () {
        try {
          return (
            regionColors(rootThis.profileData[this.id].Region, "Y") +
            " shadow countrySvg"
          );
        } catch(e) {
          console.log(e);
        }
      });
  }
}
//
export function updateCountryPositions(vizElementAttributes) {
  //update country svg positions
  d3.select(this.sidsMaps)
    .selectAll(".countrySvg")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function () {
      let VTz = vizElementAttributes[this.id]["VT"];
      try {
        return (
          "scale(" +
          VTz["scale"] +
          "," +
          VTz["scale"] +
          ")translate(" +
          VTz["x"] +
          "," +
          VTz["y"] +
          ")"
        );
      } catch (error) {
        return "";
      }
    });
}

export function updateCountryTitles(
  vizElementAttributes,
  noData
) {
  //indicatorCode,indiSelections["page"], indiSelections["viz"], indiSelections["sortby"],indiSelections["year"], indicatorData,vizElementAttributes,noData) {
  let rootThis = this;
  d3.select(this.sidsMaps)
    .selectAll(".choroText")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function () {
      let country = getIsoByName(this.innerHTML);

      // var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
      // textBBox = this.getBBox()
      // TT = textTransform(country, bBox, textBBox, indiSelections["viz"], indicatorData);//, indicatorData2);
      //console.log(country)
      try {
        return vizElementAttributes[country]["TT"];
      } catch (error) {
        console.log("broken", this.innerHTML, noData);
      }
    });

  d3.select(this.sidsMaps).selectAll(".choroText2").style("pointer-events", "none");
  d3.select(this.sidsMaps).selectAll(".choroText3").style("pointer-events", "none");
  d3.select(this.sidsMaps)
    .selectAll(".countryLabel")
    .style("pointer-events", "none");

  if (this.indiSelections["viz"] == "global") {
    d3.selectAll('.choroText').attr('fill-opacity', 0)
    d3.selectAll('.choroText2').attr('fill-opacity', 0)
    d3.selectAll('.choroText3').attr('fill-opacity', 1)
  } else {
    d3.selectAll('.choroText2').attr('fill-opacity', 0)
    d3.selectAll('.choroText3').attr('fill-opacity', 0)
  }

  // if (this.indiSelections["page"] == "mvi"){
  //
  //     d3.selectAll(".choroText").each(function () {
  //         //which is this only mviCountryListSpider? it doesn't check which tab is selected
  //         ///console.log(indicator, indiSelections["page"], indiSelections["viz"])
  //         if(noData.includes(country)) {
  //             d3.select(this).attr("fill-opacity", 0)
  //         }
  //         else {
  //             d3.select(this).attr("fill-opacity", 1)
  //         }
  //     })
  //
  //     d3.selectAll(".choroText2").each(function (d) {
  //         d3.selectAll(this).attr("fill-opacity", 0)
  //     })
  //     d3.selectAll(".choroText3").each(function (d) {
  //
  //         d3.selectAll(this).attr("fill-opacity", 0)
  //     })
  //
  // }

    if (this.indiSelections["viz"] == "series") {
      d3.selectAll('.choroText').attr('fill-opacity', 0)
    } else {
      d3.selectAll('.choroText').each(function () {
        let country = getIsoByName(this.innerHTML);
        //   console.log(this.innerHTML)
        if (
          rootThis.indicatorCode == "Region" &&
          rootThis.indiSelections["viz"] == "choro"
        ) {
          d3.select(this).attr('fill-opacity', 1);
        } else {
          if (
            noData.includes(country) ||
            rootThis.indiSelections["viz"] == "global"
          ) {
            let scale
            d3.select(this).attr('fill-opacity', 0);
            if (rootThis.indiSelections["viz"] == "bars") {
              scale = 1;
            } //.05
            else if (rootThis.indiSelections["viz"] == "choro") {
              scale = 1;
            }
            d3.select(this)
              .transition()
              .duration(1200)
              .attr("transform", "scale(" + scale + "," + scale + ")");
          } else {
            d3.select(this).attr("fill-opacity", 1);
          }
        }
      });
    }

  // else if (indiSelections["page"] == "mviTab"&&indiSelections["viz"]=="Bar Chart") {
  //     chosenCountryListMVI=getChosenCountryListMVI()
  // //    console.log(chosenCountryListMVI)
  //     d3.select(sidsMaps).selectAll(".choroText")
  //     .transition()
  //     .duration(1200) //make transition time relative to to/from viz
  //     .attr("transform", function (d) {
  //         //    console.log(this.innerHTML)
  //         var country = this.innerHTML;

  //         var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
  //         textX = bBox[4]
  //         textY = bBox[2] - 11;
  //         textBBox = this.getBBox()
  //         if (chosenCountryListMVI.includes(country)) {

  //             //console.log(textBBox)

  //             MBC = mviBarChart(country, indiSelections["viz"], getMVIData(), getChosenCountryListMVI(), 1)["y"]
  //             // console.log(bBox,textBBox,TT,country)
  //             totalVals = 40
  //             totalHeight = 500
  //             rank = MBC / 12.45  //almost totalHeight/totalVals
  //             //console.log(rank)
  //             return "scale(1,1) translate(" + (-textX + 140 - textBBox.width / 2) + "," + (-textY + totalHeight / totalVals * (rank + .5)) + ")"
  //         } else {
  //             return "scale(1,1) translate(" + (-textX + 140 - textBBox.width / 2) + "," + (-textY)+")"
  //         }

  //     })
  // }

  //     if (indiSelections["page"] == "mviTab"){
  //     if (indiSelections["viz"] == "Global View") {
  //         $(".choroText2").each(function (d) {
  //             $(this).css("fill-opacity", 1)
  //         })
  //         $(".choroText3").each(function (d) {
  //             $(this).css("fill-opacity", 0)
  //         })
  //     }
  //     else {
  //         $(".choroText2").each(function (d) {
  //             $(this).css("fill-opacity", 0)
  //         })
  //         $(".choroText3").each(function (d) {
  //             $(this).css("fill-opacity", 0)
  //         })
  //     }
  // }

  if (this.indiSelections["viz"] == "Multi-indicator") {
    d3.select(".yAxisTitle")
      .transition()
      .duration(1000)
      .attr("fill-opacity", 1);
  } else {
    d3.select(".yAxisTitle")
      .transition()
      .duration(1000)
      .attr("fill-opacity", 0);
  }
}

export function updateLabels(vizElementAttributes, noData) {
  //indiSelections["page"], indiSelections["viz"], indiSelections["year"],indiSelections["sortby"],indicatorData, noData) {

    // labelTransformData = {}
    // $(".countryLabel").each(function () {
    //     var country = this.parentNode.id
    //     bBox=bboxDict[country]
    //     dat = labelTransform(country, bBox, indiSelections["viz"], indiSelections["year"],indiSelections["sortby"],indicatorData,indiSelections["page"])//, indicatorData2)
    //     labelTransformData[country] = dat

    // });
    let rootThis = this;
    d3.select(this.sidsMaps)
      .selectAll(".countryLabel")
      .transition()
      .duration(1200)
      .attr("x", function () {
        return vizElementAttributes[this.parentNode.id]["LT"]["x"] + 170;
      })
      .attr("y", function () {
        return vizElementAttributes[this.parentNode.id]["LT"]["y"];
      })
      .attr("fill-opacity", function () {
        if (
          noData.includes(this.parentNode.id) ||
          rootThis.indiSelections["viz"] != "bars"
        ) {
          return 0;
        } else {
          return 1;
        }
      })
      .text(function () {
        let country = this.parentNode.id;
        return nFormatter(
          rootThis.indicatorData["data"][rootThis.indiSelections["year"]][country],
          3
        );
      });

}

export function updateRectangles(vizElementAttributes) {
  d3.select(this.sidsMaps)
    .selectAll(".choroRect")
    .transition()
    .duration(1200)
    .attr("x", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["x"];
    })
    .attr("y", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["y"];
    })
    .attr("width", function () {
        // if(vizMode=="indicator"){
      return vizElementAttributes[this.parentNode.id]["RT"]["width"];
        // }
        // if(vizMode=="index"){
        //     return 0;
        // }
    })
    .attr("height", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["height"];
    });
}
//
export function updateIndexRectangles() {
  let rootThis = this;
if(this.indiSelections["page"]=="countryDataTab"){
    let rectTransformData = {},
    rectList = document.querySelectorAll(".choroRectMvi");

    [...rectList].each(function () {
        let country = this.parentNode.id,
        bBox = getBoundingBox(d3.select(this.parentNode).select("path")),
        dat = rootThis.rectTransform( country, bBox, rootThis.indicatorData, rootThis.indiSelections )
        rectTransformData[country] = dat
    });

    d3.select(this.sidsMaps).selectAll(".choroRectMvi")
        .transition()
        .duration(1200)
        .attr("x", function () { return rectTransformData[this.parentNode.id]["x"] })
        .attr("y", function () { return rectTransformData[this.parentNode.id]["y"] })
        .attr("width", 0)
        .attr("height", function () { return rectTransformData[this.parentNode.id]["height"] })

  }

else {


        for (let i = 1; i < mviDimensionList.length+1; i++) {
            let rectTransformData = {};//get for index!

            if (this.indiSelections.viz == "spider"||this.indiSelections=="Time Series") {
                d3.selectAll(".choroRect" + i).each(function () {
                var country = this.parentNode.id;
                var bBox = rootThis.bboxDict[country]// getBoundingBox(d3.select(this.parentNode).select("path"));
                let dat = rootThis.rectTransform( country, bBox, rootThis.indicatorData, rootThis.indicatorData );
                dat["width"]=0
                rectTransformData[country] = dat;
                });
            }

            else if (this.indiSelections.viz == "global") {
                    d3.selectAll(".choroRect" + i).each(function () {
                    var country = this.parentNode.id;
                    let dat = rootThis.mviColumnChart( country, rootThis.indicatorData,  rootThis.indiSelections["spiderData"],  mviCountryListLongitude,   i );
                    rectTransformData[country] = dat;
                });
            }

            else if (this.indiSelections.viz == "bars") {
                rectTransformData = {};
                d3.selectAll(".choroRect" + i).each(function () {
                    var country = this.parentNode.id;
                    let dat = rootThis.mviBarChart(  country, rootThis.indiSelections, rootThis.indiSelections["spiderData"],  chosenCountryListMVI,  i );
                    rectTransformData[country] = dat;
                });
            }

    console.log(i)
        d3.select(this.sidsMaps)
        .selectAll(".choroRect"+i)

        .transition()
        .duration(1200)
        .attr("x", function () { console.log("sfdg"); return rectTransformData[  this.parentNode.id]["x"]; })
        .attr("y", function () {    return rectTransformData[  this.parentNode.id      ]["y"];    })
        .attr("width", function () {     return rectTransformData[  this.parentNode.id   ]["width"];   })
        .attr("height", function () {   return rectTransformData[  this.parentNode.id    ]["height"];    });
    }
    }

}
export function updateCircles(vizElementAttributes) {
  d3.select(this.sidsMaps)
    .selectAll(".choroCircle")
    .transition()
    .duration(1200)
    .attr("cx", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["x"];
    })
    .attr("cy", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["y"];
    })
    .attr("r", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["r"];
    });
}

// function updateCountryLines(vizElementAttributes) {
//   d3.select(sidsMaps).selectAll(".countryLine");
//   // .transition()
//   // .duration(1200)
//   // .attr("cx", function () { return vizElementAttributes[this.parentNode.id]["CT"]["x"] })
//   // .attr("cy", function () { return vizElementAttributes[this.parentNode.id]["CT"]["y"] })
//   // .attr("r", function () { return vizElementAttributes[this.parentNode.id]["CT"]["r"] })
// }
//
export function updateLinesAndMap() {
  if (this.indiSelections["viz"] == "choro") {
    this.main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 1);
  } else {
    this.main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 0);
  }
  let rootThis = this;
  d3.selectAll(".choroMap")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("opacity", function () {
      if (rootThis.indiSelections["viz"] == "global") {
        return 0.7;
      } else {
        return 0;
      }
    });
}
//
export function updateBarAxis() {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],
  barAxis = d3.select(".barAxis");
  const x = d3.scaleLinear();
  var margin = { left: 160, right: 5 };
  var xAxis = d3.axisTop(x);
  var width = 440;
  var height = 90;

  let max = Math.max(
    ...Object.values(indicatorDataYear).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    })
  ),
  min = 0;

  if (this.indiSelections["viz"] == "Multi-indicator") {
    margin.left = 60;
    width = 440;
    min = Math.min(
      ...Object.values(indicatorDataYear).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
      })
    );
  }

  xAxis.tickFormat(d3.format(".2s"));
  x.domain([min, max]).range([0, width]);

  if (
    this.indiSelections["viz"] == "choro" ||
    this.indiSelections["viz"] == "global" ||
    this.indiSelections["viz"] == "Spider" ||
    this.indiSelections["viz"] == "Info" ||
    this.indiSelections["viz"] == "series"
  ) {
    x.range([0, 0]);
    setTimeout(function () {
      barAxis.attr("visibility", "hidden");
    }, 1100);
  } else if (this.indiSelections["viz"] == "bars"||this.indiSelections["viz"] == "Multi-indicator") {
    barAxis.attr("visibility", "visible");
  }

  barAxis
    .transition()
    .duration(1200)
    .attr("transform", `translate(${margin.left}, ${height / 2})`)
    .call(xAxis);
}
//
// // function updateMviBarAxis(pillarData,indiSelections) {
//
// //     values = []
// //     for (key in pillarData[0]["axes"]) {
// //         values.push(pillarData[0]["axes"][key].value)
// //     }
//
// //     barAxis = d3.select(".barAxis")
// //     const x = d3.scaleLinear();
// //     var margin = { left: 160, right: 5 };
// //     var xAxis = d3.axisTop(x);
// //     var width = 440
// //     var height = 90
//
// //     max = Math.max(...values)
// //     min = 0
//
// //     if (indiSelections["viz"] == "Multi-indicator") {
// //         margin.left = 90;
// //         width = 700
// //         min = Math.min(...values)
// //     }
//
// //     // console.log(max, min)
//
// //     xAxis.tickFormat(d3.format(".2s"));
// //     x
// //         .domain([min, max])
// //         .range([0, width]);
//
// //     if (indiSelections["viz"] == "Choropleth" || indiSelections["viz"] == "Global View" || indiSelections["viz"] == "Spider"||indiSelections["viz"]=="Time Series") {
// //         x.range([0, 0]);
// //         setTimeout(function () { barAxis.attr("visibility", "hidden") }, 1100)
//
// //     }
// //     else if (indiSelections["viz"] == "Bar Chart") { barAxis.attr("visibility", "visible") }
// //     else if (indiSelections["viz"] = "Multi-indicator") { barAxis.attr("visibility", "visible") }
//
// //     barAxis
// //         .transition().duration(1200)
// //         .attr("transform", `translate(${margin.left}, ${height / 2})`)
// //         .call(xAxis);
// // }
//
export function updateYAxis() {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],

  yAxisContainer = d3.select(".multiYAxis");
  const yScale = d3.scaleLinear();
  var yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.format(".2s"));

  var margin = { left: 45, right: 5, top: 245 },
  height;

  if (
    this.indiSelections["viz"] == "choro" ||
    this.indiSelections["viz"] == "bars" ||
    this.indiSelections["viz"] == "spider" ||
    this.indiSelections["viz"] == "series"
  ) {
    yScale.range([0, 0]);
    //setTimeout(function(){
    yAxisContainer.attr("visibility", "hidden");
    //},900)
  } else if (this.indiSelections["viz"] == "global") {
    height = 180;
    margin = { left: 45, right: 5, top: 245 };

    // indicatorData2 = wdiFull[indicator2]["data"]//[indiSelections["year"]]

    let max = Math.max(
      ...Object.values(indicatorDataYear).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
      })
    ),
    // min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))
    min = 0;

    yScale.domain([min, max]).range([height, 0]);

    yAxisContainer.attr("visibility", "visible");
    // }
    // else {
    //   yScale.range([0, 0]);
    //   //setTimeout(function(){
    //   yAxisContainer.attr("visibility", "hidden")
    // }
  }
  //else if (indiSelections["viz"] == "Multi-indicator") {
  //     var margin = { left: 45, right: 5, top: 10 };
  //     var height = 460
  //     try {
  //         indicator2 = $(".indiActive2")[0].id
  //     }
  //     catch (error) { indicator2 = "HumanDevelopmentIndex" }
  //     indicatorData2 = wdiFull[indicator2]["data"]//[indiSelections["year"]]

  //     max = Math.max(...Object.values(indicatorData2).filter(function (el) {
  //         return !isNaN(parseFloat(el)) && isFinite(el);
  //     }))
  //     min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))

  //     yScale
  //         .domain([min, max])
  //         .range([height, 0]);

  //     yAxisContainer.attr("visibility", "visible")
  // }

  yAxisContainer
    .transition()
    .duration(1200)
    .call(yAxis)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // main_chart_svg.selectAll(".yAxisTitle")
  //     .text(function (d, i) {
  //         return wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " +
  //     })
}
//
export function updateChoroLegend(quantize) {


    // hueNum=2

    //     quantize = d3.scale.quantize()
    //     .domain([min,max])
    //     .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

    let choro_legend_container = d3
        .select(this.legendContainerSelector),
    choroLegend = choro_legend_container
      .selectAll("g.choroLegendEntry");

    choroLegend.data(quantize.range());

    //var choroLegend = d3.select("#choro_legend_container").selectAll('g.choroLegendEntry')

    choro_legend_container.select(".choroLegendTitle").text(() => {
      //extent will be a two-element array, format it however you want:
      //return format(extent[0]) + " - " + format(+extent[1])
      // if (indiSelections["page"] == "mviTab") {
      //     return "Multidimensional Vulnerability Index"
      // }
      // else {

      return this.indicatorMeta[this.indicatorCode]["Indicator"]; //["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " +

      // }
    });

    choroLegend.selectAll("rect").attr("class", function (d) {
      return d;
    });
  // if(indicatorGlobal=="Region"){ hideChoroLegend(choroLegend);}
    // console.log("info?", indiSelections["viz"])
    if (this.indiSelections["viz"] == "choro" ) {
      this.showChoroLegend(choroLegend, quantize);
    } else if (
      this.indiSelections["viz"] == "bars" ||
      this.indiSelections["viz"] == "Multi-indicator" ||
      this.indiSelections["viz"] == "Info" ||
      this.indiSelections["viz"] == "Time Series" ||
      this.indiSelections["viz"] == "spider" ||
      this.indiSelections["viz"] == "global"
    ) {
      this.hideChoroLegend(choroLegend, quantize);//only hide rectangles and labels
    }
    if (
      this.indiSelections["viz"] == "Info" ||
      this.indiSelections["viz"] == "global"
    ) {
        this.choro_legend_svg
        .selectAll(".choroLegendTitle")
        .transition().duration(1200)
        .attr("fill-opacity", 0);
    } else {
        this.choro_legend_svg
        .selectAll(".choroLegendTitle")
        .transition().duration(1200)
        .attr("fill-opacity", 1);
    }
  }

// function updateChoroTooltips(indicatorData, indiSelections) {
//   const countryMaps = $("#allSids path, .regionTitle");
//   regionAverages = {};
//   regionRank = {};
//   indicatorDataYear = indicatorData["data"][indiSelections["year"]];
//
// //   if (indiSelections["page"] == "countryDataTab") {
//     indiMax = Math.max(
//       ...Object.values(indicatorDataYear).filter(
//         (val) => typeof val == "number"
//       )
//     );
//     countryMaps.each(function (index) {
//       if (countryMaps[index].id.includes("RegionTitle")) {
//         region = countryMaps[index].id.replace("RegionTitle", "");
//         regionTitles = {
//           ais: "AIS",
//           pacific: "Pacific",
//           caribbean: "Caribbean",
//         };
//         regionLists = {
//           ais: regionCountries["ais"],
//           pacific: regionCountries["pacific"],
//           caribbean: regionCountries["caribbean"],
//         };
//         tooltipTitle = regionTitles[region] + " Region";
//         total = 0;
//
//         for (countryIndex in regionLists[region]) {
//           val = indicatorDataYear[regionLists[region][countryIndex]];
//           if (typeof val == "number") {
//             total += val;
//           }
//         }
//         regionColor = regionColor = regionColors(region, "Y").substring(1);
//
//         regionValuesLength = Object.values(
//           filterObject(indicatorDataYear, regionLists[region])
//         ).filter((val) => typeof val == "number").length;
//         if (regionValuesLength == 0) {
//           regionValuesLength = 1;
//         }
//         regionVal = total / regionValuesLength;
//         regionRank[region] = 1;
//         allVals = Object.values(indicatorDataYear).filter(
//           (val) => typeof val == "number"
//         );
//         for (val in allVals) {
//           //console.log(allVals[val],regionVal)
//           if (allVals[val] > regionVal) {
//             regionRank[region]++;
//           }
//         }
//         // console.log(regionValuesLength)
//         content = "Average: " + nFormatter(regionVal, 3);
//         regionAverages[region] = regionVal;
//       } else {
//         iso = countryMaps[index].id;
//         country = sidsDict[iso];
//         tooltipTitle = country;
//         try {
//           secondLine = "Value: " + indicatorDataYear[iso].toFixed(2);
//         } catch (error) {
//           secondLine = "No Data";
//         }
//         if ((indiSelections["year"] = "recentValue")) {
//           year = indicatorData["data"]["recentYear"][iso];
//         } else {
//           year = indiSelections["year"];
//         }
//         thirdLine = "Year: " + year;
//         content = secondLine + "</h6><h6>" + thirdLine;
//         regionColor = regionColors(countryJson[iso].Region, "Y").substring(1);
//       }
//       $("#tooltipChoro" + index.toString()).html(
//         '<h4 style="color:#' +
//           regionColor +
//           '">' +
//           tooltipTitle +
//           "</h4><h6>" +
//           content +
//           "</h6></div>"
//       ); //<div class="arrow" data-popper-arrow></div>
//       // console.log(index+": yo");
//     });
// //   } else if ((indiSelections["page"] = "mviTab")) {
// //     // indiMax = 1
// //     // regionTitles = { "ais": "AIS", "pacific": "Pacific", "caribbean": "Caribbean" }
// //     // countryMaps.each(function (index) {
// //     //     if (countryMaps[index].id.includes("RegionTitle")) {
// //     //         region = countryMaps[index].id.replace("RegionTitle", "")
// //     //         tooltipTitle = regionTitles[region] + " Region"
// //     //         population = 0
// //     //         for (countryIndex in regionCountries[region]) {
// //     //           //  console.log(region, countryIndex)
// //     //             population += countryJson[regionCountries[region][countryIndex]].Population
// //     //         }
// //     //         regionColor = regionColor = regionColors(region, "Y").substring(1)
// //     //         content = "Population: " + nFormatter(population, 3)
// //     //         regionAverages[region] = population
// //     //     }
// //     //     else {
// //     //         try {
// //     //             tooltipTitle = countryJson[countryMaps[index].id].Country
// //     //         }
// //     //         catch { tooltipTitle = countryMaps[index].id }
// //     //         // console.log(tooltipTitle)
// //     //         // console.log(wdiFull[indicator]["year"])
// //     //      //   console.log("yaaaaaah")
// //     //         try {
// //     //             MBC = getMviValue(tooltipTitle,indiSelections)
// //     //             secondLine = "MVI Value: " +nFormatter(MBC["value"],2)
// //     //           //  console.log(mviData)//+ getMVIData//-----get MVI value//wdiFull[indicator]["data"][tooltipTitle].toFixed(2)
// //     //         }
// //     //         catch (error) { secondLine = "No Data" }
// //     //         thirdLine = "Year: " + 2018 /// <-- replace with year variable when refactored
// //     //         regionColor = regionColors(countryJson[countryMaps[index].id].Region, "Y").substring(1)
// //     //         $('#tooltipChoro' + (index).toString()).html('<h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6>' + secondLine + '</h6><h6>' + thirdLine + '</h6></div>')//<div class="arrow" data-popper-arrow></div>
// //     //         // console.log(index+": yo");
// //     //     }
// //     // });
// //   }
//
//   //console.log(regionAverages, indiMax, regionRank, allVals.length)
//
//   if (
//     indiSelections["viz"] == "Choropleth" ||
//     indiSelections["viz"] == "Time Series"
//   ) {
//     regionTitleVals = {
//       opacity: 1,
//       pacificX: 775,
//       pacificY: 460,
//       caribbeanX: 760,
//       caribbeanY: 130,
//       aisX: 785,
//       aisY: 335,
//     };
//   } else if (
//     indiSelections["viz"] == "Bar Chart" ||
//     indiSelections["viz"] == "Multi-indicator"
//   ) {
//     if (indiSelections["sortby"] == "Rank") {
//       regionTitleVals = {
//         opacity: 1,
//         pacificX: 775,
//         pacificY: 330,
//         caribbeanX: 760,
//         caribbeanY: 170,
//         aisX: 785,
//         aisY: 250,
//       };
//       regionTitleHeight = 400;
//       // if(indiSelections["page"]=="mviTab"){
//       //     countryListLength=34
//       //     regionTitleVals = { "opacity": 1, "pacificX": 775, "pacificY": 330, "caribbeanX": 760, "caribbeanY": 170, "aisX": 785, "aisY": 250 }
//       // }
//       // else if(indiSelections["page"]=="countryDataTab"){
//       countryListLength = allVals.length;
//       if (countryListLength > 0) {
//         regionTitleVals = {
//           opacity: 1,
//           pacificX: 715,
//           pacificY:
//             regionTitleHeight * (regionRank["pacific"] / countryListLength) +
//             60,
//           caribbeanX: 700,
//           caribbeanY:
//             regionTitleHeight * (regionRank["caribbean"] / countryListLength) +
//             60,
//           aisX: 725,
//           aisY:
//             regionTitleHeight * (regionRank["ais"] / countryListLength) + 60,
//         };
//       } else {
//         regionTitleVals = {
//           opacity: 1,
//           pacificX: 715,
//           pacificY: 450,
//           caribbeanX: 700,
//           caribbeanY: 110,
//           aisX: 725,
//           aisY: 300,
//         };
//       }
//       // }
//     } else if (indiSelections["sortby"] == "Region") {
//       regionTitleVals = {
//         opacity: 1,
//         pacificX: 715,
//         pacificY: 450,
//         caribbeanX: 700,
//         caribbeanY: 110,
//         aisX: 725,
//         aisY: 300,
//       };
//     }
//   } else if (indiSelections["viz"] == "Global View") {
//     regionTitleVals = {
//       opacity: 1,
//       pacificX: 675,
//       pacificY: 70,
//       caribbeanX: 30,
//       caribbeanY: 115,
//       aisX: 370,
//       aisY: 85,
//     };
//   } else if (indiSelections["viz"] == "Spider") {
//     if (indiSelections["sortby"] == "Rank") {
//       regionTitleVals = {
//         opacity: 1,
//         pacificX: 775,
//         pacificY: 330,
//         caribbeanX: 760,
//         caribbeanY: 170,
//         aisX: 785,
//         aisY: 250,
//       };
//     } else {
//       regionTitleVals = {
//         opacity: 1,
//         pacificX: 20,
//         pacificY: 100,
//         caribbeanX: 670,
//         caribbeanY: 90,
//         aisX: 530,
//         aisY: 530,
//       };
//     }
//   }
//
//   // console.log( regionTitleHeight, regionRank["pacific"], countryListLength)
//   d3.select("#pacificRegionTitle")
//     .transition()
//     .duration(1000)
//     .attr("x", regionTitleVals["pacificX"])
//     .attr("y", regionTitleVals["pacificY"])
//     .attr("fill-opacity", regionTitleVals["opacity"]);
//   d3.select("#caribbeanRegionTitle")
//     .transition()
//     .duration(1000)
//     .attr("x", regionTitleVals["caribbeanX"])
//     .attr("y", regionTitleVals["caribbeanY"])
//     .attr("fill-opacity", regionTitleVals["opacity"]);
//   d3.select("#aisRegionTitle")
//     .transition()
//     .duration(1000)
//     .attr("x", regionTitleVals["aisX"])
//     .attr("y", regionTitleVals["aisY"])
//     .attr("fill-opacity", regionTitleVals["opacity"]);
// }
