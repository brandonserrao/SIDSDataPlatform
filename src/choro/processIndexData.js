

// function getIndexValues(indexObj,indicatorCode){
//     subindexList= Object.keys(subindexWeights)
//     const checkboxes = document.querySelectorAll(
//       'input[name="mviIndicator"]:checked'
//     );
//     customMviIndicators = [];
//     checkboxes.forEach((el) => {
//       customMviIndicators.push(el.id);
//     });




// }


  function getCustomIndicatorSelection(){
    const checkboxes = document.querySelectorAll('input[name="mviIndicator"]:checked');
    selectedIndis = []
    checkboxes.forEach((el) => { selectedIndis.push(el.id) })
    return selectedIndis
  }

function processSpiderData(indexData,subindexWeights,indiSelections,orderedCountryList) {
    selectedIndis=getCustomIndicatorSelection()
console.log(selectedIndis)
    spiderData=[]
    for (i = 0; i < mviDimensionList.length; i++) {
        //	console.log(countryList[i])
        //	console.log(allKeyData[countryList[i]])
        ////need to convert countryList[i] to code

        spiderAxes = []
        for (index in orderedCountryList) {

            newCountryData = {}
            country = orderedCountryList[index]


            val = 0
            for (j = 3; j >= i; j = j - 1) {
                dimVal = 0
                indiCount = 0
                for (indi in mviDimensions[mviDimensionList[j]]) {
                    indi = mviDimensions[mviDimensionList[j]][indi]
                                        if (selectedIndis.includes(indi)) {
                        try {
                            //countryName = allKeyData[country].Profile.Country
                            newVal = indexData[mviIndicatorsDict[indi]]["data"][indiSelections["year"]][country]
                            //console.log( newVal)
                            if (typeof newVal == 'number') {
                                dimVal += newVal
                                indiCount += 1
                            }
                        }
                        //errors
                        catch (error) {
                            //outputting errors
                            //console.log(error,indi)
                        }
                    }
                    //)
                    //add all checked indicaotr standardized values in this dimension to value

                }
                if (indiCount > 0) {
                    val += dimVal / indiCount / 4

                }

            }
            // console.log(country,val)
            newCountryData['axis'] = country
            newCountryData['value'] = val
            spiderAxes.push(newCountryData)

        }
        spiderData.push({ name: mviDimensionList[i], axes: spiderAxes })
    }
    console.log(spiderData)
return spiderData
}

function drawIndexSpider(spiderData,subindexList){
    
  var margin = { top: 85, right: 45, bottom: 0, left: 0 },
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20
  );

var radarChartOptionsCustom = {
  w: 500,
  h: 420,
  margin: margin,
  maxValue: 10,
  levels: 6,
  spin: 0,
  roundStrokes: false,
  color: d3.scale
    .ordinal()
    .range(["#0DB14B", "#f0db3a", "#CC333F", "#00A0B0", "#FFFFFF"]), //,
  //				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
};


spidderData = processSpiderData(indexData,subindexList,indiSelections)

  svg_radar_5 = RadarChart( "#indexSpider", radarChartOptionsCustom,  subindexList, "customIndex", {customIndex: spiderData } );


}



// function getIndexValue(country, selectedViz) {
//   console.log("jj");
//   MBC = mviBarChart( country, selectedViz,  getIndexData(),  getChosenCountryListMVI(),  1); //["width"]
//   return MBC;
// }

function mviBarChart(country, indiSelections, mviData, chosenCountryListMVI, dim) {
    dat = mviData[dim - 1];
    dimensionName = dat.name;
    try {
      val = dat["axes"].filter(function (el) {
        return el.axis == country;
      })[0].value;
      maxVal = mviData[0]["axes"].filter(function (el) {
        return el.axis == country;
      })[0].value;
    } catch (error) {
      val = 0;
      maxVal = 0;
    }
  
    rank = chosenCountryListMVI.indexOf(country);
  
    totalVals = chosenCountryListMVI.length;
    totalHeight = 500;
    totalWidth = 440;
    selectedPage = indiSelections["page"]
  
    if (rank == -1) {
      return { x: 160, y: 300, width: 0, height: 0 };
    } else {
      try {
        topMargin = 0;
  
        margin = 4;
        values = [];
        for (key in mviData[0]["axes"]) {
          values.push(mviData[0]["axes"][key].value);
        }
        maxx = Math.max(...values);
        minn = 0; //
        normValue = (val - minn) / (maxx - minn);
        normMaxValue = (maxVal - minn) / (maxx - minn);
        //console.log(country,normValue,rank,minn)
        if (selectedPage == "countryDataTab") {
          //console.log(val, typeof val)
  
          return {
            x: 160,
            y: (totalHeight / totalVals) * rank + topMargin,
            width: 0,
            height: totalHeight / totalVals - margin,
          }; //,"color":color};
        } else if (selectedPage == "mviTab") {
          return {
            value: val,
            x: (normMaxValue - normValue) * totalWidth + 160,
            y: (totalHeight / totalVals) * rank + topMargin,
            width: normValue * totalWidth,
            height: totalHeight / totalVals - margin,
          }; //,"color":color};
        }
      } catch (error) {
        //console.log(error)
        //console.log(country,"no1");
        return { x: 160, y: 300, width: 0, height: 10 };
      }
    }
  }
  
  function mviColumnChart( country, indiSelections, mviData, chosenCountryListMVI, dim) {
    
    dat = mviData[dim - 1];

    dimensionName = dat.name;
    try {
      val = dat["axes"].filter(function (el) {
        return el.axis == country;
      })[0].value;
    } catch (error) {
      val = 0;
    }
    rank = chosenCountryListMVI.indexOf(country);
  
    totalHeight = 500;
    totalWidth = 650;
    selectedPage = indiSelections["page"]
  
    if (rank == -1) {
      return { x: 160, y: 300, width: 0, height: 30 };
    } else {
      try {
        leftMargin = 60;
        totalVals = chosenCountryListMVI.length;
        margin = 8;
  
        maxx = 70;
        minn = 0; //Math.min(...indicatorValues)
        normValue = (val - minn) / (maxx - minn);
  
        //console.log(country,normValue,rank,minn)
        if (selectedPage == "countryDataTab") {
          //console.log(val, typeof val)
  
          return {
            y: 160,
            x: (totalHeight / totalVals) * rank + leftMargin,
            height: 50,
            width: totalHeight / totalVals - margin,
          }; //,"color":color};
        } else if (selectedPage == "mviTab") {
          return {
            y: totalHeight * 0.85 - (normValue * totalHeight) / 2,
            x: (totalWidth / totalVals) * rank + leftMargin,
            height: (normValue * totalHeight) / 2,
            width: totalWidth / totalVals - margin,
          }; //,"color":color};
        }
      } catch (error) {
        console.log(error);
        //console.log(error)
        //console.log(country,"no1");
        return { x: 160, y: 300, width: 00, height: 10 };
      }
    }
  }
 



function getIndexCountryList(indiSelections,subindexList) {
    selectedIndis=getCustomIndicatorSelection()
    selectedSortby=indiSelections["sortby"]
     if (selectedSortby == "Region") {
        chosenCountryListMVI = mviCountryListSpider;
      }
      else if (selectedSortby == "Rank") {

        mviValues={}

  for (index in mviCountryListSpider) {
    newCountryData = {};
    country = mviCountryListSpider[index];

    val = 0;
    for (j = 3; j >= 0; j = j - 1) {
      dimVal = 0;
      indiCount = 0;
      for (indi in mviDimensions[subindexList[j]]) {
        indi = mviDimensions[subindexList[j]][indi];
        if (selectedIndis.includes(indi)) {
          try {
            //countryName = allKeyData[country].Profile.Country
            newVal = indexData[mviIndicatorsDict[indi]]["data"][indiSelections["year"]][country];///////////////////////////
            //console.log(typeof newVal)
            if (typeof newVal == "number") {
              dimVal += newVal;
              indiCount += 1;
            }
          } catch (error) {
            ///outputting errors
            //console.log(error,country,indi)
          }
        }
      }
      if (indiCount > 0) {
        val += dimVal / indiCount / 4;
      }
    }
    mviValues[country] = val;
  }

sortedMviData = sort_object(mviValues);
sortedCountryList = Object.keys(sortedMviData);
console.log(sortedMviData);

      //this filter removes any empty elements
      chosenCountryListMVI = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value
    } 
    return chosenCountryListMVI;
}
//   selectedPage = $(".selectedPage").attr("id");
//   selectedViz = $(".selectedViz")[0].innerHTML;

//   selectedSortby = $(".selectedSortby")[0].innerHTML;
//   if (selectedViz == "Spider") {
//     if (selectedSortby == "Rank") {
//       //this filter removes any empty elements
//       chosenCountryListMVI = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value
//     } else if (selectedSortby == "Region") {
//       chosenCountryListMVI = mviCountryListSpider;
//     }
//   } else if (selectedViz == "Global View") {
//     chosenCountryListMVI = mviCountryListLongitude;
//   } else if (selectedViz == "Bar Chart") {
//     if (selectedSortby == "Rank") {
//       //this filter removes any empty elements

//       chosenCountryListMVI = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value
//     } else if (selectedSortby == "Region") {
//       chosenCountryListMVI = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value

//       pacificListSort = sortedCountryList.filter((item) =>
//         pacificList2.includes(item)
//       );
//       aisListSort = sortedCountryList.filter((item) => aisList2.includes(item));
//       caribbeanListSort = sortedCountryList.filter((item) =>
//         caribbeanList2.includes(item)
//       );

//       chosenCountryListMVI = caribbeanListSort.concat(
//         ["", ""],
//         aisListSort,
//         ["", ""],
//         pacificListSort
//       );
//     } else {
//       chosenCountryListMVI = mviCountryListLongitude;
//     }
//   }

//   return chosenCountryListMVI;
// }










//   if (selectedPage == "mviTab") {
//     d3.selectAll(".countrySvg") /* Map  counties to  data */
//       .attr("class", function (d) {
//         if (mviCountryListSpider.includes(countryJson[this.id].Country)) {
//           return (
//             regionColors(countryJson[this.id].Region, "Y") +
//             " shadow countrySvg"
//           );
//         } else {
//           return "nodata countrySvg";
//         }
//       });}  



// if (selectedViz == "Spider" || selectedViz == "Bar Chart") {
//     $("#sortbySelect").show();
//     var x = $(".selectedSortby").parent();
//     $(".sortbyShader")
//       .stop()
//       .animate(
//         {
//           width: x.width() + 32,
//           left: x.position().left,
//         },
//         400
//       );
//     var x = $(".selectedSortby").parent();
//     $(".sortbyShader")
//       .stop()
//       .animate(
//         {
//           width: x.width() + 32,
//           left: x.position().left,
//         },
//         400
//       );
//   } else {
//     $("#sortbySelect").hide();
//   }


// if (selectedViz != "Bar Chart") {
//     d3.select(sidsMaps)
//       .selectAll(".countryLabel")
//       .transition()
//       .duration(1200)
//       .attr("fill-opacity", 0);
//   }

// labelTransformData = {};
// $(".countryLabel").each(function () {
//   var country = countryJson[this.parentNode.id].Country;
//   var bBox = getBoundingBox(d3.select(this.parentNode).select("path"));
//   dat = mviBarChart(
//     country,
//     selectedViz,
//     mviData,
//     chosenCountryListMVI,
//     1
//   );
//   labelTransformData[country] = dat;
// });
// console.log(labelTransformData);
// d3.select(sidsMaps)
//   .selectAll(".countryLabel")
//   .transition()
//   .duration(1200)
//   .attr("x", function () {
//     return (
//       labelTransformData[countryJson[this.parentNode.id].Country][
//         "width"
//       ] + 170
//     );
//   })
//   .attr("y", function () {
//     return (
//       labelTransformData[countryJson[this.parentNode.id].Country]["y"] +
//       10
//     );
//   })
//   .attr("fill-opacity", function () {
//     if (
//       !mviCountryListSpider.includes(
//         countryJson[this.parentNode.id].Country
//       ) ||
//       selectedViz != "Bar Chart"
//     ) {
//       return 0;
//     } else {
//       return 1;
//     }
//   })
//   .text(function () {
//     (val = mviValues[countryJson[this.parentNode.id].Country]), 2;

//     if (typeof val == "number") {
//       return nFormatter(val, 2);
//     } else {
//       return "";
//     }
//   });
