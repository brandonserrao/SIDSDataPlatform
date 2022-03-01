
//handler of color palette switching
  changeColor(colorObject) {
    let map = this.map;
    let selectedColor = colorObject.color;
    let currentColor = globals.currentLayerState.color;

    if (selectedColor === "original") {
      if (globals.currentLayerState.dataLayer === "depth") {
        globals.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
      } else if (globals.currentLayerState.dataLayer.substring(0, 2) === "1a") {
        globals.currentLayerState.color = colors.colorDiv.gdpColor;
      } else if (globals.currentLayerState.dataLayer.substring(0, 2) === "1c") {
        globals.currentLayerState.color = colors.colorSeq["pop"];
      } else if (globals.currentLayerState.dataLayer === "7d10") {
        globals.currentLayerState.color = colors.colorSeq["combo"];
      } else if (globals.currentLayerState.dataLayer === "7d5") {
        globals.currentLayerState.color = colors.colorSeq["minty"];
      } else if (globals.currentLayerState.dataLayer === "7d7") {
        globals.currentLayerState.color = colors.colorSeq["blues"];
      } else if (globals.currentLayerState.dataLayer === "7d4") {
        globals.currentLayerState.color = colors.colorSeq["pinkish"];
      } else if (globals.currentLayerState.dataLayer === "7d8") {
        globals.currentLayerState.color = colors.colorSeq["silvers"];
      } else if (globals.currentLayerState.dataLayer === "d") {
        //breaks = [-4841, -3805, -2608, -1090, 1322];
        globals.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
      } else {
        globals.currentLayerState.color = colors.colorSeq["yellow-blue"];
      }
    }

    if (selectedColor === "invert") {
      // var reverse = currentColor.reverse();
      let reverse = [...currentColor].reverse();
      globals.currentLayerState.color = reverse;
    } else if (selectedColor === "red") {
      globals.currentLayerState.color = colors.colorSeq["pinkish"];
    } else if (selectedColor === "purple") {
      globals.currentLayerState.color = colors.colorSeq["purple"];
    } else if (selectedColor === "blue") {
      globals.currentLayerState.color = colors.colorSeq["blues"];
    } else if (selectedColor === "colorblind-safe") {
      globals.currentLayerState.color = colors.colorSeq["colorBlindGreen"];
    }

    console.log(globals.currentLayerState.breaks);

    map.setPaintProperty(globals.currentLayerState.hexSize, "fill-color", [
      "interpolate",
      ["linear"],
      ["get", globals.currentLayerState.dataLayer],
      globals.currentLayerState.breaks[0],
      globals.currentLayerState.color[0],
      globals.currentLayerState.breaks[1],
      globals.currentLayerState.color[1],
      globals.currentLayerState.breaks[2],
      globals.currentLayerState.color[2],
      globals.currentLayerState.breaks[3],
      globals.currentLayerState.color[3],
      globals.currentLayerState.breaks[4],
      globals.currentLayerState.color[4],
    ]);

    var allColorz = document.getElementsByClassName("population-per-km-img"); //get the hexagons shown in the legend/histogram
    for (var x in allColorz) {
      if (typeof allColorz[x] === "object") {
        allColorz[x].style.backgroundColor = globals.currentLayerState.color[x];
      }
    }

    var features = map.queryRenderedFeatures({
      layers: [globals.currentLayerState.hexSize],
    });

    var selectedData = features.map(
      (x) => x.properties[globals.currentLayerState.dataLayer]
    );

    //recreated histogram
    var nGroup = 200;
    let classBreakMode = "e"; //equidistant (e), quantile (q), logarithmic (l), and k-means (k)
    var breaks_histogram = chroma.limits(selectedData, classBreakMode, nGroup);
    var break_index = 0;
    var histogram_break_count = Array(4).fill(0);
    for (let i = 0; i < nGroup; i++) {
      if (
        breaks_histogram[i] > globals.currentLayerState.breaks[break_index + 1]
      )
        break_index += 1;
      histogram_break_count[break_index] += 1;
    }
    let colorRampNew = [];

    for (var i = 0; i < 4; i++) {
      // colorRampPart = chroma //from in oldcode, appears to never be explicitly assigned to var/let, so appears to have been made an implict global variable; will attempt to implement using let
      let colorRampPart = chroma
        .scale([
          globals.currentLayerState.color[i],
          globals.currentLayerState.color[i + 1],
        ])
        .mode("lch")
        .colors(histogram_break_count[i]);
      // colorRampNew = colorRampNew.concat(colorRampPart); //from in oldcode, appears to never be explicitly assigned to var/let, so appears to have been made an implict global variable; will attempt to implement using let
      colorRampNew = colorRampNew.concat(colorRampPart);
      //console.log(colorRampNew);
    }
    //update the chart with new color ramp
    globals.myHistogram.data.datasets[0].backgroundColor = colorRampNew;
    globals.myHistogram.update();

    map.once("idle", () => {
      this.hideSpinner();
    });
  }

  updateHistogram( //called in addLegend; extracted for cleanliness
    colors,
    breaks,
    precision,
    activeLayer,
    selectedData //i believe this is input from updatingMap based on whats features/data on screen

    /* colors = globals.currentLayerState.colors,
    breaks = globals.currentLayerState.breaks,
    precision = globals.precision, //default added to mirror oldcode behaviour of global set/modified precision value
    activeLayer = globals.lastActive.layer, //should eliminate need for id etc; default value added as fallback to cope with call from recolor function
    selectedData //i believe this is input from updatingMap based on whats features/data on screen
     */
  ) {
    console.log("updateHistogram params passed are:");
    console.log("colors:", colors);
    console.log("breaks:", breaks);
    console.log("precision:", precision);
    console.log("activeLayer:", activeLayer);
    console.log("selectedData:", selectedData);

    //old code

    // histogram-------------------------------------------
    //#clear old canvas
    let old_canvas = document.getElementById("histogram");
    if (typeof old_canvas != "undefined" && old_canvas != null) {
      old_canvas.remove();
      //#recreate an empty canvas element and add it to the frame
      let histogram_frame = document.getElementById("histogram_frame");
      let canvasNode = document.createElement("CANVAS");
      canvasNode.id = "histogram";
      canvasNode.classList.add("histogram_canvas");
      canvasNode.setAttribute("width", 320);
      canvasNode.setAttribute("height", 115);
      histogram_frame.appendChild(canvasNode);
      console.log("new canvasNode added to histogramFrame: ");
      console.log(canvasNode);
    }

    let canvas = document.getElementById("histogram");

    // compute breaks
    let classBreakMode = "e"; //equidistant (e), quantile (q), logarithmic (l), and k-means (k)
    var nGroup = 200; //
    // console.log(`in addHistogram: selectedData = ${selectedData}`);
    // console.log(selectedData);
    //documentation: https://gka.github.io/chroma.js/#chroma-limits
    var breaks_histogram = chroma.limits(selectedData, classBreakMode, nGroup); //n groups, i.e n+1 values
    //console.log("breaks_histogram",breaks_histogram);

    // new color
    var break_index = 0;
    var histogram_break_count = Array(4).fill(0); //??init as length 4; the
    for (let i = 0; i < nGroup; i++) {
      if (breaks_histogram[i] > breaks[break_index + 1]) break_index += 1;
      histogram_break_count[break_index] += 1;
    }
    var colorRampNew = [];
    for (let i = 0; i < 4; i++) {
      //old code did not init with var/let anywhere i could find, so init'ing here
      let colorRampPart = chroma
        .scale([colors[i], colors[i + 1]])
        .mode("lch")
        .colors(histogram_break_count[i]);
      colorRampNew = colorRampNew.concat(colorRampPart);
      //console.log(colorRampNew);
    }

    // precision
    var breaks_precision = [];
    for (let i = 0; i < breaks_histogram.length; i++) {
      breaks_precision.push(this.nFormatter(breaks_histogram[i], precision));
    }
    //console.log("breaks_precision:",breaks_precision)

    var histogram_data = Array(nGroup).fill(0);
    for (let i = 0; i < selectedData.length; i++) {
      for (let j = 0; j < nGroup - 1; j++) {
        if (
          selectedData[i] >= breaks_histogram[j] &&
          selectedData[i] < breaks_histogram[j + 1]
        ) {
          histogram_data[j] += 1;
        }
      }
      if (selectedData[i] >= breaks_histogram[nGroup - 1]) {
        histogram_data[nGroup - 1] += 1;
      }
    }
    //console.log("histogram_data",histogram_data)

    //commented out as never used
    /*     var colorRampN = chroma
      .scale([colors[0], colors[4]])
      .mode("lch")
      .colors(nGroup); // yellow to dark-blue
 */

    // chroma.scale([colors[0], colors[4]]).mode("lch").colors(nGroup);

    var data = {
      labels: breaks_precision.slice(0, -1),
      datasets: [
        {
          data: histogram_data,
          backgroundColor: colorRampNew,
        },
      ],
    };

    var maxY = Math.pow(10, Math.ceil(Math.log10(Math.max(...histogram_data))));
    var minY = Math.pow(10, Math.ceil(Math.log10(Math.min(...histogram_data))));

    //console.log(maxY,minY);
    //console.log(Math.min(...histogram_data));

    var options = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: "70%",
            borderColor: "black",
            label: {
              content: "Your Score",
              enabled: true,
              position: "center",
            },
          },
        ],
      },
      scales: {
        borderWidth: 0,
        yAxes: [
          {
            display: true,
            type: "logarithmic",

            ticks: {
              //scaleStepWidth: 10,
              maxTicksLimit: 4,
              //autoSkip: true,
              //stepSize:10,
              max: maxY,
              //min: 1,

              //toread https://www.chartjs.org/docs/2.9.4/axes/labelling.html?h=callback%3A
              callback: function (
                value //index, //values
              ) {
                // if (index || values) {
                //   console.log(
                //     `in scales>yAxes>ticks: index or values: ${index} ${values}`
                //   );
                // }
                if (value === 100000000) return "100M";
                if (value === 10000000) return "10M";
                if (value === 1000000) return "1M";
                if (value === 100000) return "100K";
                if (value === 10000) return "10K";
                if (value === 1000) return "1K";
                if (value === 100) return "100";
                if (value === 10) return "10";
                if (value === 1) return "1";
                return null;
              },
            },
            afterBuildTicks: function (chartObj) {
              //Build ticks labelling as per your need
              chartObj.ticks = [];
              var ticksScale = maxY;
              while (ticksScale > minY && ticksScale >= 1) {
                //console.log(ticksScale);
                chartObj.ticks.push(ticksScale);
                ticksScale /= 10;
              }
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            gridLines: {
              display: true,
            },
            scaleLabel: {
              display: false,
              // labelString: activeLayer.units,
              labelString: activeLayer.Unit,
            },
            ticks: {
              maxTicksLimit: 10,
            },
          },
        ],
      },
    };

    // console.log("myHistogram data: ");
    // console.log(data);
    // console.log("myHistogram options: ");
    // console.log(option);
    // console.log("myHistogram canvas: ");
    // console.log(canvas);
    console.log("in updateHistogram creating myHistogram");
    globals.myHistogram = Chart.Bar(canvas, {
      data: data,
      options: options,
    });
    console.log(globals.myHistogram);
  }


