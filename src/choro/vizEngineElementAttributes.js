import * as d3 from 'd3';
import {getBoundingBox, isNumeric, sort_object} from './vizEngineHelperFunctions';
import { regionCountries, countryListLongitude, sidsDict } from './vizEngineGlobals';



///////////////////////
//////Data Processing function
//////////////////////////////////////

export function processVizElementAttributes() {
  let vizElementAttributes = {};
  let rootThis = this;
  ////problem code, doesn't work in init so moved here instead.
  if (this.bboxInit == 0) {
    d3.select(this.sidsMaps)
      .selectAll("path")
      .each(function () {
        let bbox = getBoundingBox(d3.select(this));
        rootThis.bboxDict[this.id] = bbox;
      });

    [...document.querySelectorAll(".choroText")].forEach((item) => {
        let textBBox = item.getBBox();
        rootThis.textBBoxDict[item.parentNode.id] = textBBox;
    });
    this.bboxInit = 1;
  }
  ////////////////////
  let indicatorDataObj = this.indicatorData["data"][this.indiSelections["year"]];
  //console.log(textBBoxDict)
  for (let country in this.bboxDict) {
    //rename to iso since the svg uses the old codes
    let bBox = this.bboxDict[country],
    textBBox = this.textBBoxDict[country],

    RTa = this.rectTransform(country, bBox, indicatorDataObj, this.indiSelections),
    //MRTa = multiRectTransform(country, bBox, indicatorDataObj, indiSelections);
    VTa = this.vizTransform(country, bBox, indicatorDataObj, this.indiSelections),
    LTa = this.labelTransform(country, bBox, indicatorDataObj, this.indiSelections),
    CTa = this.circleTransform(country, bBox, indicatorDataObj, this.indiSelections),
    TTa = this.textTransform(
      country,
      bBox,
      textBBox,
      indicatorDataObj,
      this.indiSelections
    );

    vizElementAttributes[country] = {
      VT: VTa,
      RT: RTa,
      LT: LTa,
      CT: CTa,
            //MRT: MRTa,
      TT: TTa

    };
  }

  return vizElementAttributes;
}

/////////////////////////
////Transform functions
////////////////////////////////
//
export function circleTransform(country, bBox, indicatorDataObj, indiSelections) {
  let VT = this.vizTransform(country, bBox, indicatorDataObj, indiSelections);

  if (this.indiSelections["viz"] == "choro") {
    return { x: bBox[4], y: bBox[5], r: 0 };
  } else if (this.indiSelections["viz"] == "global") {
    //  console.log(VT,bBox,country)
    let r;
    if (this.mapLocations[country]["countryWidth"] == "no") {
      r = 2;
    } else {
      r = 0;
    }
    return {
      x: (VT["x"] + bBox[4]) * VT["scale"],
      y: (VT["y"] + bBox[5]) * VT["scale"],
      r: r,
    };
  } else if (this.indiSelections["viz"] == "bars") {
    return { x: 0, y: 0, r: 0 };
  } else if (this.indiSelections["viz"] == "Multi-indicator") {
    //the 2.7 must come from the scale factor on the choropleth?
    return { x: (VT["x"] + bBox[4]) / 2.7, y: (VT["y"] + bBox[5]) / 2.7, r: 0 };
  } else if (this.indiSelections["viz"] == "spider") {
    //the 2.7 must come from the scale factor on the choropleth?
    return {
      x: (VT["x"] + bBox[4]) / 1.85,
      y: (VT["y"] + bBox[5]) / 1.85,
      r: 0,
    };
  } else if (this.indiSelections["viz"] == "series") {
    return { x: bBox[4], y: bBox[5], r: 0 };
  }
  //&& typeof val == "number"){
}

export function rectTransform(country, bBox, indicatorDataObj, indiSelections) {
  // console.log(indicatorData)
  let val = indicatorDataObj[country],
  totalHeight = 500,
  totalWidth = 440,
  cx = bBox[4],
  cy = bBox[5],
  output;

  if (this.indiSelections["viz"] == "bars") {
    //if on mvi page, width should be zero but other vars can be same as bar chart

    // if (indiSelections["page"] == "mviTab") {
    //     // return { "x": 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": 0, "height": totalHeight / totalVals - margin }//,"color":color};
    //     output= mviBarChart(country, "Bar Chart", getMVIData(), getChosenCountryListMVI(), 1)

    // }

    // else {

    if (isNumeric(val)) {
      try {
        var filtered = Object.fromEntries(
          Object.entries(indicatorDataObj).filter(([, v]) => isNumeric(v))
        ); // == "number"))

        let sortedData = sort_object(filtered),
        indicatorValues = Object.values(filtered);
        //           console.log(sortedData)
        let rank,
        totalVals;
        if (this.indiSelections["sortby"] == "Rank") {
          //this filter removes any empty elements
          rank = sortedData[country];
          totalVals = indicatorValues.length;
        } else if (this.indiSelections["sortby"] == "Region") {
          let countryOrder = Object.keys(sortedData);
          let pacificListSort = countryOrder.filter((item) =>
            regionCountries["pacific"].includes(item)
          );
          let aisListSort = countryOrder.filter((item) =>
            regionCountries["ais"].includes(item)
          );
          let caribbeanListSort = countryOrder.filter((item) =>
            regionCountries["caribbean"].includes(item)
          );
          let chosenCountryList = caribbeanListSort.concat(
            ["", ""],
            aisListSort,
            ["", ""],
            pacificListSort
          );
          rank = chosenCountryList.indexOf(country);
          //console.log(rank)
          if (rank == -1) {
            console.log(country, val);
          }
          totalVals = indicatorValues.length + 4;
        }

        let topMargin = 0,
        margin = 4;

        let maxx = Math.max(...indicatorValues),
        minn = 0, //Math.min(...indicatorValues)
        normValue = (val - minn) / (maxx - minn);

        //console.log(country,normValue,rank,minn)
        //console.log(totalHeight,totalVals,rank)

        output = {
          x: 160,
          y: (totalHeight / totalVals) * rank + topMargin,
          width: normValue * totalWidth,
          height: totalHeight / totalVals - margin,
        }; //,"color":color};
        // console.log(country,output)
      } catch (error) {
        console.log(error);
        //console.log(country,"no1");
        output = { x: 160, y: 300, width: 0, height: 10 };
      }
    } else {
      //console.log(val)
      output = { x: 160, y: 300, width: 0, height: 0 };
    }

    // }
  } else if (this.indiSelections["viz"] == "global") {
    let leftMargin = 60,

    margin = 2;

    let filtered = Object.fromEntries(
      Object.entries(indicatorDataObj).filter(([, v]) => typeof v == "number")
    );

    let countryOrder = countryListLongitude,

    rank = countryOrder.indexOf(sidsDict[country]),

    //        sortedData = sort_object(filtered);

    indicatorValues = Object.values(filtered),

    totalVals = countryOrder.length;

    let columnBase = {
      y: totalHeight * 0.85,
      x: (650 / totalVals) * rank + leftMargin,
      width: totalWidth / totalVals - margin,
      height: 0,
    };

    if (typeof val != "number" || rank == -1) {
      output = columnBase;
    } else {
      try {
        //console.log(totalVals)

        let maxx = Math.max(...indicatorValues),
        minn = 0, //Math.min(...indicatorValues)
        normValue = (val - minn) / (maxx - minn);

        //console.log(country,normValue,rank,minn)

          //console.log(val, typeof val)

          output = {
            y: totalHeight * 0.85 - (normValue * totalHeight) / 2.5,
            x: (650 / totalVals) * rank + leftMargin,
            width: totalWidth / totalVals - margin,
            height: (normValue * totalHeight) / 2.5,
          }; //,"color":color};
          if (output["y"] > totalHeight * 0.85) {
            output["y"] = totalHeight * 0.85;
          } //so that they don't emerge from the bottom on next animation

        // else if (indiSelections["page"] == "mviTab") {
        //     output= columnBase
        // }
      } catch (error) {
        //console.log(error)
        //console.log(country,"no1");
        output = columnBase;
      }
    }
  } else if (this.indiSelections["viz"] == "choro") {
    output = { x: cx, y: cy, width: 0, height: 5 };
  } else if (
    this.indiSelections["viz"] == "Multi-indicator" ||
    this.indiSelections["viz"] == "spider"
  ) {
    let VTr = this.vizTransform(country, bBox, indicatorDataObj, indiSelections);
    output = {
      x: (totalWidth * (cx + VTr["x"]) * VTr["scale"]) / 620,
      y: (totalHeight * (cy + VTr["y"]) * VTr["scale"]) / 500,
      width: 0,
      height: 5,
    };
  } else if (this.indiSelections["viz"] == "series") {
    output = { x: 160, y: 300, width: 0, height: 0 };
  }
  if (output["width"] < 0) {
    output["width"] = 0;
  }
  if (output["height"] < 0) {
    output["height"] = 0;
  }

  return output;
}
//
export function textTransform(
  country,
  bBox,
  textBBox,
  indicatorDataObj
) {
  let textX = bBox[4],
  textY = bBox[2] - 11,
  totalHeight = 500,
  totalVals = 0,
  x,
  y;
  for (let cou in indicatorDataObj) {
    if (typeof indicatorDataObj[cou] == "number") {
      totalVals += 1;
    }
  }

  if (this.indiSelections["viz"] == "choro") {
    return "scale(1,1) translate(0,0)";
  } else if (this.indiSelections["viz"] == "bars") {
    let RTo = this.rectTransform(country, bBox, indicatorDataObj),
    // console.log(RTo,totalVals,textY)
    output =
      "scale(1,1) translate(" +
      (-textX + 140 - textBBox.width / 2) +
      "," +
      (-textY + RTo["y"] + totalHeight / totalVals / 2) +
      ")";

    return output;
  } else if (this.indiSelections["viz"] == "global") {
    //console.log(country)
    try {
      //VT = vizTransform(country, bBox, indicatorData,indiSelections);
      return (
        "scale(1,1) translate(" +
        (-textX + this.mapLocations[country]["titleX"]) +
        "," +
        (-textY + this.mapLocations[country]["titleY"] - 110) +
        ")"
      );
    } catch (error) {
      //shouldn't have any of these happening?
      //return "translate(" + (-textX) + "," + (-textY) + ")";
      console.log(country);
      return ""; //scale(0.001,0.001)"
    }
  } else if (this.indiSelections["viz"] == "spider") {
    let mviRank = this.indiSelections["countryOrder"].indexOf(country),
    scale;
    if (mviRank == -1) {
        scale = 1//0.001;
    } else {
        scale = 1;
    }
    x = 300 * Math.sin(mviRank / 34 * 2 * 3.14) - textX + 370
    y = -280 * Math.cos(mviRank / 34 * 2 * 3.14) - textY + 250

    // scale = 1;
    // x = 0;
    // y = 0;

    return "scale(" + scale + "," + scale + ") translate(" + x + "," + y + ")";
  } else if (this.indiSelections["viz"] == "series") {
    return ""; //scale(1,1) translate(0,0)";
  }
  // else if (indiSelections["viz"] == "Multi-indicator") {
  //     val = indicatorData[country]
  //     val2 = indicatorData2[country]
  //     if (typeof val == "number" && typeof val2 == "number") {
  //         max = 1
  //         min = 0
  //         scale = .37;

  //         //remove values with no data
  //         indicatorValues = Object.values(indicatorData).filter(function (el) {
  //             return !isNaN(parseFloat(el)) && isFinite(el);
  //         });
  //         maxx = Math.max(...indicatorValues)
  //         minn = Math.min(...indicatorValues)
  //         normValue = (val - minn) / (maxx - minn)

  //         //remove values with no data
  //         indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
  //             return !isNaN(parseFloat(el)) && isFinite(el);
  //         });
  //         maxx2 = Math.max(...indicatorValues2)
  //         minn2 = Math.min(...indicatorValues2)
  //         normValue2 = (val2 - minn2) / (maxx2 - minn2)

  //         //scale(" + scale + "," + scale + ")
  //         x = -textX + (normValue * 1970 + 213) * scale
  //         y = 1200 * scale - textY - (normValue2 * 1240) * scale

  //         return "scale(1,1) translate(" + x + "," + y + ")";

  //     } else {
  //         return "scale(0.001,0.001)"//translate(" + (-textX) + "," + (-textY) + ")";
  //     }
  // }
}

export function labelTransform(country, bBox, indicatorDataObj) {
  let RTl = this.rectTransform(country, bBox, indicatorDataObj);
  //txt = indicatorData[country]
  return { x: RTl.width, y: RTl.y + RTl.height / 2 + 4 };
}
//
export function vizTransform(country, bBox, indicatorDataObj) {
  //console.log(country, bBox, indiSelections["viz"], indicatorData, indicatorData2)
  let cx = bBox[4],
  cy = bBox[5],
  scale,
  x,
  y,
  valX,
  valY;

  if (this.indiSelections["viz"] == "choro") {
    scale = 1;
    x = 0;
    y = 0;
  } else if (this.indiSelections["viz"] == "bars") {
    let rect = this.rectTransform(country, bBox, indicatorDataObj);
    scale = 0.01;
    x = (rect.width / 2 + 160) / scale - cx;
    y = (rect.y + 2) / scale - cy;

    //return "scale(" + scale + ")translate(" + (-cx) + "," + (-cy + normValue * 1200) + ")";
  } else if (this.indiSelections["viz"] == "global") {
    try {
      valX = this.mapLocations[country]["countryX"] * 2;
      valY = this.mapLocations[country]["countryY"] * 2;
      if (this.mapLocations[country]["countryWidth"] == "no") {
        scale = 0.1;
      } else {
        scale = (this.mapLocations[country]["countryWidth"] / bBox[1]) * 2;
      }
    } catch (error) {
      // console.log(error)
      valX = 0;
      valY = 0;
      scale = 0.3;
    }

    //idk why 1.41

    x = -cx + valX / scale / 1.41;
    y = -cy + valY / scale / 1.41 - 154 / scale;
    scale = scale / 1.41;
  } else if (this.indiSelections["viz"] == "spider") {
      let orderedCountryList=this.indiSelections["countryOrder"],
      mviRank = orderedCountryList.indexOf(country);

      if (mviRank == -1) {
          scale = 0
      }
      else {
          scale = .54;
      }
      x = 460 * Math.sin(mviRank / 34 * 2 * 3.14) - cx + 690
      y = -460 * Math.cos(mviRank / 34 * 2 * 3.14) - cy + 450

    // //temp
    // x = 0;
    // y = 0;
    // scale = 0.8;
  } else if (this.indiSelections["viz"] == "series") {
    scale = 0.01;
    x = ((1 - scale) * cx) / scale;
    y = ((1 - scale) * cy) / scale;
  }
  // else if (indiSelections["viz"] == "Multi-indicator") {

  //     val = indicatorData[country]
  //     val2 = indicatorData2[country]

  //     if (typeof val == "number" && typeof val2 == "number") {
  //         max = 1
  //         min = 0
  //         scale = .37;

  //         //remove values with no data
  //         indicatorValues = Object.values(indicatorData).filter(function (el) {
  //             return !isNaN(parseFloat(el)) && isFinite(el);
  //         });
  //         maxx = Math.max(...indicatorValues)
  //         minn = Math.min(...indicatorValues)
  //         normValue = (val - minn) / (maxx - minn)

  //         //remove values with no data
  //         indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
  //             return !isNaN(parseFloat(el)) && isFinite(el);
  //         });
  //         maxx2 = Math.max(...indicatorValues2)
  //         minn2 = Math.min(...indicatorValues2)
  //         normValue2 = (val2 - minn2) / (maxx2 - minn2)

  //         x = -cx + normValue * 1970 + 78 / scale
  //         y = 1200 - cy - normValue2 * 1240 + 65
  //     }

  //     else {
  //         scale = 0
  //         x = -cx
  //         y = -cy
  //     }

  // }

  return { x: x, y: y, scale: scale };
}
//
// function lineTransform(country, bBox, textBBox, indiSelections["viz"], indicatorData) {
//
//     // cx = bBox.x + bBox.width / 2;
//     // cy = bBox.y + bBox.height / 2;
//
//     if (indiSelections["viz"] == "Choropleth") {
//         x1 = bBox[4];
//         x2 = bBox[4];
//         y1 = bBox[2] - 11;
//         y2 = bBox[2] - 11;//[5]
//     }
//
//     else if (indiSelections["viz"] == "Global View") {
//         try {
//             line = mapLocations[country]["line"]
//             x1 = mapLocations[country]["countryX"] * 1.4;
//             y1 = mapLocations[country]["countryY"] * 1.4;
//             if (line == "no") { }
//             else if (line == "left") {
//                 x1 += - textBBox.width / 2;
//                 y1 += - 4;
//             }
//             else if (line == "b-left") {
//                 x1 += - textBBox.width / 3;
//             }
//             else if (line == "right") {
//                 x1 += textBBox.width / 2;
//                 y1 += - 4;
//             }
//             else if (line == "b-right") {
//                 x1 += + textBBox.width / 3;
//             }
//             else if (line == "t-right") {
//                 x1 += textBBox.width / 3;
//                 y1 += - 8;
//             }
//             else if (line == "t-left") {
//                 x1 += - textBBox.width / 3;
//                 y1 += - 8;
//             }
//             else if (line == "top") {
//                 x1 += 0;
//                 y1 += - 8;
//             }
//             else {
//                 x1 += 400;
//             }
//
//             x2 = mapLocations[country]["countryX"] * 1.4;
//             y2 = mapLocations[country]["countryY"] * 1.4;
//             //idk why this is 1.3
//         }
//         catch (error) {
//             x1 = 0;
//             y1 = 0;
//             x2 = 0;
//             y2 = 0;
//         }
//     }
//
//     else if (indiSelections["viz"] == "Bar Chart") {
//         try {
//             val = indicatorData[country]
//
//             max = 1
//             min = 0
//             scale = .5;
//
//             //remove values with no data
//             indicatorValues = Object.values(indicatorData).filter(function (el) {
//                 return !isNaN(parseFloat(el)) && isFinite(el);
//             });
//
//             maxx = Math.max(...indicatorValues)
//             minn = 0//Math.min(...indicatorValues)
//             normValue = (val - minn) / (maxx - minn)
//
//             x2 = 0;
//             y2 = normValue * 600;
//             y1 = normValue * 600;
//             x1 = 30;
//         } catch (error) {
//             x2 = 0;
//             y2 = 0;
//             x1 = 10;
//             y1 = 10;
//         }
//     }
//     else {
//         x1 = 0;
//         x2 = 0;
//         y1 = 0;
//         y2 = 0;
//     }
//
//     return { "x1": x1, "x2": x2, "y1": y1, "y2": y2 };
// }

////////////////////////////////////
/////  Helper functions
////////////////////////////////////

///////////////////////
//Tooltips
////////////////////////
