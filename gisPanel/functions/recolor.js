function recolorBasedOnWhatsOnPage() {
  if (!map.getLayer(currentGeojsonLayers.hexSize)) {
    console.log("no layer");
    return;
  }

  var features = map.queryRenderedFeatures({
    layers: [currentGeojsonLayers.hexSize],
  });

  //createMask(features);

  //console.log(currentGeojsonLayers.hexSize);
  if (features.length > 0) {
    var uniFeatures;
    if (currentGeojsonLayers.hexSize === "admin1") {
      uniFeatures = getUniqueFeatures(features, "GID_1");
    } else if (currentGeojsonLayers.hexSize === "admin2") {
      uniFeatures = getUniqueFeatures(features, "GID_2");
    } else {
      uniFeatures = getUniqueFeatures(features, "hexid");
    }

    //console.log(uniFeatures.features);
    var selecteData = features.map(
      (x) => x.properties[currentGeojsonLayers.dataLayer]
    );
    //console.log(selecteData);
    var breaks = chroma.limits(selecteData, "q", 4);

    //console.log("BREAK5",breaks);
    var breaks_new = [];
    precision = 1;
    do {
      precision++;
      for (let i = 0; i < 5; i++) {
        breaks_new[i] = parseFloat(breaks[i].toPrecision(precision));
      }
      console.log(breaks_new);
    } while (checkForDuplicates(breaks_new) && precision < 10);
    breaks = breaks_new;

    currentGeojsonLayers.breaks = breaks;
    //console.log(breaks)
    map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-color", [
      "interpolate",
      ["linear"],
      ["get", currentGeojsonLayers.dataLayer],
      breaks[0],
      currentGeojsonLayers.color[0],
      breaks[1],
      currentGeojsonLayers.color[1],
      breaks[2],
      currentGeojsonLayers.color[2],
      breaks[3],
      currentGeojsonLayers.color[3],
      breaks[4],
      currentGeojsonLayers.color[4],
    ]);

    //if the map can't make breaks, say there's no data
    //else, show data
    //DEF COULD BE IMRPOVED

    if (isNaN(breaks[3]) || breaks[1] == 0) {
      map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-opacity", 0.0);
      setTimeout(() => {
        map.setFilter(currentGeojsonLayers.hexSize, null);
      }, 1000);
      addNoDataLegend();
    } else {
      map.setFilter(currentGeojsonLayers.hexSize, [
        ">=",
        currentGeojsonLayers.dataLayer,
        0,
      ]);
      addLegend(
        currentGeojsonLayers.color,
        breaks,
        precision,
        currentGeojsonLayers.dataLayer,
        selecteData
      );
      setTimeout(() => {
        map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-opacity", 0.8);
      }, 400);
    }
  }
}
