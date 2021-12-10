function changeDataOnMap(selection) {
  console.log(selection);
  console.log(currentGeojsonLayers.hexSize);

  if (map.getLayer("ocean")) {
    //$('.hexsize').toggle()

    if (!selection.includes("fl")) {
      map.removeLayer("ocean");

      currentGeojsonLayers.hexSize = "hex5";

      map.addLayer({
        id: "hex5",
        type: "fill",
        source: "hex5",
        "source-layer": "hex5",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.0,
        },
      });
    }
  }
  remove3d();

  //console.log(map.getStyle().layers)
  //console.log(selection);
  currentGeojsonLayers.dataLayer = selection;
  console.log(currentGeojsonLayers.dataLayer);

  if (!map.getSource("hex5")) {
    //console.log('no source')
    addHexSource();
  } else {
    //console.log('source!')
  }

  if (!map.getLayer(currentGeojsonLayers.hexSize)) {
    var current = _.find(sourceData, function (o) {
      return o.name === currentGeojsonLayers.hexSize;
    });

    map.addLayer({
      id: currentGeojsonLayers.hexSize,
      type: "fill",
      source: currentGeojsonLayers.hexSize,
      "source-layer": current.layer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0,
      },
    });

    if (firstSymbolId) {
      map.moveLayer(currentGeojsonLayers.hexSize, firstSymbolId);
    }
  }
  setTimeout(() => {
    var features = map.queryRenderedFeatures({
      layers: [currentGeojsonLayers.hexSize],
    });

    if (features) {
      var uniFeatures;
      if (currentGeojsonLayers.hexSize === "admin1") {
        uniFeatures = getUniqueFeatures(features, "GID_1");
      } else if (currentGeojsonLayers.hexSize === "admin2") {
        uniFeatures = getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = getUniqueFeatures(features, "hexid");
      }

      //console.log(uniFeatures);
      var selecteData = uniFeatures.map((x) => x.properties[selection]);
      //console.log(selecteData);
      var max = Math.max(...selecteData);
      var min = Math.min(...selecteData);

      //var colorz = chroma.scale(['lightyellow', 'navy']).domain([min, max], 5, 'quantiles');
      var breaks = chroma.limits(selecteData, "q", 4);
      //console.log("BREAK",breaks)
      var breaks_new = [];
      var precision = 1;
      do {
        precision++;
        for (let i = 0; i < 5; i++) {
          breaks_new[i] = parseFloat(breaks[i].toPrecision(precision));
        }
        //console.log(breaks_new);
      } while (checkForDuplicates(breaks_new) && precision < 10);
      breaks = breaks_new;

      var colorRamp = colorSeq["yellow-blue"];

      if (selection.substring(0, 2) === "1a") {
        colorRamp = colorDiv.gdpColor;
      } else if (selection.substring(0, 2) === "1c") {
        colorRamp = colorSeq["pop"];
      } else if (selection === "7d10") {
        colorRamp = colorSeq["combo"];
      } else if (selection === "7d5") {
        colorRamp = colorSeq["minty"];
      } else if (selection === "7d7") {
        colorRamp = colorSeq["blues"];
      } else if (selection === "7d4") {
        colorRamp = colorSeq["pinkish"];
      } else if (selection === "7d8") {
        colorRamp = colorSeq["silvers"];
      } else if (selection === "d") {
        breaks = [-4841, -3805, -2608, -1090, 1322];
        colorRamp = colorSeq["ocean"];
      }

      currentGeojsonLayers.breaks = breaks;
      currentGeojsonLayers.color = colorRamp;

      map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-color", [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "yellow",
        [
          "interpolate",
          ["linear"],
          ["get", selection],
          breaks[0],
          colorRamp[0],
          breaks[1],
          colorRamp[1],
          breaks[2],
          colorRamp[2],
          breaks[3],
          colorRamp[3],
          breaks[4],
          colorRamp[4],
        ],
      ]);

      //map.setFilter(currentGeojsonLayers.hexSize,['>=',selection, 0])
      if (isNaN(breaks[3]) || breaks[1] == 0) {
        //setTimeout(() => { map.setFilter(currentGeojsonLayers.hexSize, null) }, 500);

        map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-opacity", 0.0);
        setTimeout(() => {
          map.setFilter(currentGeojsonLayers.hexSize, null);
        }, 100);
        addNoDataLegend();
      } else {
        map.setFilter(currentGeojsonLayers.hexSize, [">=", selection, 0]);

        //console.log(selecteData)
        //console.log(max)

        addLegend(colorRamp, breaks, precision, selection, selecteData);
        setTimeout(() => {
          map.setPaintProperty(
            currentGeojsonLayers.hexSize,
            "fill-opacity",
            0.8
          );
        }, 100);
      }
    }
  }, 1000);

  map.moveLayer("allsids", firstSymbolId);
}

//manages the change when you chang the resolution
function changeHexagonSize(sel) {
  console.log(sel);
  console.log(currentGeojsonLayers.hexSize);

  //console.log(map.getStyle())
  if (map.getLayer("ocean")) {
    $(".hexsize").toggle();
    map.removeLayer("ocean");
  }

  remove3d();
  currentGeojsonLayers.hexSize = sel;
  console.log(sel);

  //var slayer;

  for (var x in userLayers) {
    if (map.getLayer(userLayers[x])) {
      map.removeLayer(userLayers[x]);
    }
  }

  var current = _.find(sourceData, function (o) {
    return o.name === currentGeojsonLayers.hexSize;
  });

  console.log(current);
  map.addLayer(
    {
      id: sel,
      type: "fill",
      source: sel,
      "source-layer": current.layer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0,
      },
    },
    firstSymbolId
  );

  if (sel === "hex1") {
    $(".loader-gis").show();

    map.once("idle", function (e) {
      $(".loader-gis").hide();
    });
  }

  if (map.getStyle().name === "Mapbox Satellite") {
    map.moveLayer(sel);
  }

  map.once("idle", function (e) {
    console.log("idle after hex change");
    recolorBasedOnWhatsOnPage();

    //console.log('change bins');
    //map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', 0.7)
    map.moveLayer(sel, "allsids");
  });
}
