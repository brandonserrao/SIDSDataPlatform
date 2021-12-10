function addNoDataLegend() {
  let infoBoxTitle = document.getElementById("infoBoxTitle");
  let infoBoxText = document.getElementById("infoBoxText");
  let infoBoxLink = document.getElementById("infoBoxLink");

  infoBoxTitle.innerHTML = "No Data for this Region";
  infoBoxText.innerHTML = "";
  infoBoxLink.innerHTML = "";

  let legendTitle = document.getElementById("legendTitle");
  let legend = document.getElementById("updateLegend");
  legend.innerHTML = "";
  legendTitle.innerHTML = "";

  let element = document.getElementById("histogram");
  if (typeof element != "undefined" && element != null) {
    // $("#histogram").remove();
    document.querySelector("#histogram").remove();
  }
}

function addLegend(colors, breaks, precision, current, dataset) {
  //console.log(allLayers)

  var legData = _.find(allLayers, ["field_name", current]);

  var infoBoxTitle = document.getElementById("infoBoxTitle");
  var infoBoxText = document.getElementById("infoBoxText");
  var infoBoxLink = document.getElementById("infoBoxLink");

  infoBoxTitle.innerHTML = "";
  infoBoxText.innerHTML = "";
  infoBoxLink.innerHTML = "";

  infoBoxTitle.innerHTML = legData.desc + " " + legData.time;
  infoBoxText.innerHTML = legData.desc_long;
  infoBoxLink.innerHTML =
    "<strong>Reference: </strong>" +
    legData.source_name +
    ' - <a href="' +
    legData.link +
    '" target="_blank">' +
    legData.link +
    "</a>";

  var legendTitle = document.getElementById("legendTitle");
  var legend = document.getElementById("updateLegend");
  legend.innerHTML = "";
  legendTitle.innerHTML = "";
  legendTitle.innerHTML = "<span>" + legData.units + "</span>";

  for (var x in colors) {
    var containerDiv = document.createElement("div");
    containerDiv.classList.add("col-flex");
    containerDiv.classList.add("align-items-center");

    var words = document.createElement("div");
    words.classList.add("population-per-km-text");
    //words.innerHTML = Number.parseFloat(breaks[x]).toFixed(3)
    words.innerHTML = nFormatter(breaks[x], precision);
    //words.innerHTML = Number(nFormatter(breaks[x], 2))
    var hexI = document.createElement("div");
    hexI.classList.add("population-per-km-img");
    hexI.style.backgroundColor = colors[x];

    containerDiv.appendChild(words);
    containerDiv.appendChild(hexI);
    legend.appendChild(containerDiv);
  }

  //console.log("colors",colors)
  //console.log("breaks",breaks)
  //console.log("precision",precision)
  //console.log("current",current)
  //console.log("dataset",dataset)

  // histogram
  var element = document.getElementById("histogram");
  if (typeof element != "undefined" && element != null) {
    $("#histogram").remove();
  }
  $("#histogram_frame").append(
    '<canvas id="histogram" width="320" height="115"><canvas>'
  );
  var canvas = document.getElementById("histogram");

  // break
  var nGroup = 200;
  var breaks_histogram = chroma.limits(dataset, "e", nGroup);
  //console.log("breaks_histogram",breaks_histogram);

  // old color
  /*
    var histogram_color = Array(nGroup).fill("");
    var color_index=0;
    for (var i = 0; i < nGroup; i++)   
    {        
        if (breaks_histogram[i]>breaks[color_index+1])
            color_index+=1;    
        histogram_color[i]=colors[color_index];
    }
    */

  // new color
  var break_index = 0;
  var histogram_break_count = Array(4).fill(0);
  for (var i = 0; i < nGroup; i++) {
    if (breaks_histogram[i] > breaks[break_index + 1]) break_index += 1;
    histogram_break_count[break_index] += 1;
  }
  var colorRampNew = [];
  for (var i = 0; i < 4; i++) {
    colorRampPart = chroma
      .scale([colors[i], colors[i + 1]])
      .mode("lch")
      .colors(histogram_break_count[i]);
    colorRampNew = colorRampNew.concat(colorRampPart);
    //console.log(colorRampNew);
  }

  // precision
  var breaks_precision = [];
  for (i = 0; i < breaks_histogram.length; i++) {
    breaks_precision.push(nFormatter(breaks_histogram[i], precision));
  }
  //console.log("breaks_precision:",breaks_precision)

  var histogram_data = Array(nGroup).fill(0);
  for (var i = 0; i < dataset.length; i++) {
    for (var j = 0; j < nGroup - 1; j++) {
      if (
        dataset[i] >= breaks_histogram[j] &&
        dataset[i] < breaks_histogram[j + 1]
      ) {
        histogram_data[j] += 1;
      }
    }
    if (dataset[i] >= breaks_histogram[nGroup - 1]) {
      histogram_data[nGroup - 1] += 1;
    }
  }
  //console.log("histogram_data",histogram_data)

  var colorRampN = chroma
    .scale([colors[0], colors[4]])
    .mode("lch")
    .colors(nGroup); // yellow to dark-blue

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
  var option = {
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
            callback: function (value, index, values) {
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
            labelString: legData.units,
          },
          ticks: {
            maxTicksLimit: 10,
          },
        },
      ],
    },
  };

  myHistogram = Chart.Bar(canvas, {
    data: data,
    options: option,
  });
}
