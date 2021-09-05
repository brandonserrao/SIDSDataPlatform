$("#color-switch").on("change", function () {


//console.log(colorSeq)

  var selectedOption = $(this)[0].value;
  console.log(selectedOption)
  var currentColor = currentGeojsonLayers.color;
  console.log(currentGeojsonLayers.dataLayer)

  if (selectedOption === "Original") {

    if(currentGeojsonLayers.dataLayer === 'depth') {
        console.log('hi')
        currentGeojsonLayers.color= colorSeq['ocean']
    }


    else if (currentGeojsonLayers.dataLayer.substring(0, 2) === '1a') {
        currentGeojsonLayers.color= colorDiv.gdpColor;
    } else if (currentGeojsonLayers.dataLayer.substring(0, 2) === '1c') {
        currentGeojsonLayers.color= colorSeq['pop'];

    } else if (currentGeojsonLayers.dataLayer === '7d10') {
        currentGeojsonLayers.color = colorSeq['combo'];
    } else if (currentGeojsonLayers.dataLayer === '7d5') {
        currentGeojsonLayers.color = colorSeq['minty'];
    } else if (currentGeojsonLayers.dataLayer === '7d7') {
        currentGeojsonLayers.color = colorSeq['blues'];
    } else if (currentGeojsonLayers.dataLayer === '7d4') {
        currentGeojsonLayers.color = colorSeq['pinkish'];
    } else if (currentGeojsonLayers.dataLayer === '7d8') {
        currentGeojsonLayers.color = colorSeq['silvers'];
    } else if (currentGeojsonLayers.dataLayer === 'd') {
        //breaks = [-4841, -3805, -2608, -1090, 1322];
        currentGeojsonLayers.color = colorSeq['ocean']
    } else {
        currentGeojsonLayers.color = colorSeq["yellow-blue"];
    }
  }

  if (selectedOption === "invert") {
    var reverse = currentColor.reverse();
    currentGeojsonLayers.color = reverse;
  } else if (selectedOption === "red") {
    currentGeojsonLayers.color = colorSeq['pinkish']
  } else if (selectedOption === "purple") {
    currentGeojsonLayers.color = colorSeq['purple']
  } else if (selectedOption === "blue") {
    currentGeojsonLayers.color = colorSeq['blues'];
  } else if (selectedOption === "colorblind-safe") {
    currentGeojsonLayers.color = colorSeq['colorBlindGreen'];
  }

  console.log(currentGeojsonLayers.breaks)

  map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-color", [
    "interpolate",
    ["linear"],
    ["get", currentGeojsonLayers.dataLayer],
    currentGeojsonLayers.breaks[0],
    currentGeojsonLayers.color[0],
    currentGeojsonLayers.breaks[1],
    currentGeojsonLayers.color[1],
    currentGeojsonLayers.breaks[2],
    currentGeojsonLayers.color[2],
    currentGeojsonLayers.breaks[3],
    currentGeojsonLayers.color[3],
    currentGeojsonLayers.breaks[4],
    currentGeojsonLayers.color[4],
  ]);

  var allColorz = document.getElementsByClassName("population-per-km-img");

  for (var x in allColorz) {
    //console.log(typeof(allColorz[x]))
    //console.log(x);
    if (typeof allColorz[x] === "object") {
      allColorz[x].style.backgroundColor = currentGeojsonLayers.color[x];
    }
  }

  var features = map.queryRenderedFeatures({
    layers: [currentGeojsonLayers.hexSize],
  });

  var selecteData = features.map(
    (x) => x.properties[currentGeojsonLayers.dataLayer]
  );

  //console.log(myHistogram)
  var nGroup = 200;
  var breaks_histogram = chroma.limits(selecteData, "e", nGroup);
  var break_index = 0;
  var histogram_break_count = Array(4).fill(0);
  for (var i = 0; i < nGroup; i++) {
    if (breaks_histogram[i] > currentGeojsonLayers.breaks[break_index + 1])
      break_index += 1;
    histogram_break_count[break_index] += 1;
  }
  var colorRampNew = [];

  for (var i = 0; i < 4; i++) {
    colorRampPart = chroma
      .scale([currentGeojsonLayers.color[i], currentGeojsonLayers.color[i + 1]])
      .mode("lch")
      .colors(histogram_break_count[i]);
    colorRampNew = colorRampNew.concat(colorRampPart);
    //console.log(colorRampNew);
  }
  myHistogram.data.datasets[0].backgroundColor = colorRampNew;

  myHistogram.update();
  //myHistogram.data.datasetsbackgroundColor

  //console.log(currentColor)

  // console.log(gdpColor);
});
