function addOcean(layer) {
  // $("#icon3d").hide();
  // $(".hexsize").toggle(); //TODO -double check this
  document.querySelector("#icon3d").style.display = "none";
  document.querySelector(".hexsize").style.display = "none";

  remove3d();
  /*
  const userLayers = [ //!!! restating what already exists outside?
    "hex5",
    "hex5clipped",
    "hex10",
    "admin1",
    "admin2",
    "hex1",
  ];
*/
  for (let x in userLayers) {
    if (map.getLayer(userLayers[x])) {
      // map.setPaintProperty(userLayers[x], 'fill-opacity', 0)
      map.removeLayer(userLayers[x]);
    }
  }

  // TODO - EXTRACT THESE HARDCODED VALUES AND STRINGS
  currentGeojsonLayers.breaks = [-4841, -3805, -2608, -1090, 0];
  currentGeojsonLayers.color = [
    "#08519c",
    "#3182bd",
    "#6baed6",
    "#bdd7e7",
    "#eff3ff",
  ];
  currentGeojsonLayers.dataLayer = layer;
  currentGeojsonLayers.hexSize = "ocean";
  map.addLayer(
    {
      id: "ocean",
      type: "fill",
      source: "ocean",
      "source-layer": "oceans",
      layout: {
        visibility: "visible",
      },
      filter: ["<", "depth", 0],
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "depth"],
          -4841,
          "#08519c",
          -3805,
          "#3182bd",
          -2608,
          "#6baed6",
          -1090,
          "#bdd7e7",
          1322,
          "#eff3ff",
        ],
        "fill-opacity": 0.8,
      },
    },
    firstSymbolId
  );

  setTimeout(() => {
    var features = map.queryRenderedFeatures({
      layers: ["ocean"],
    });

    if (features) {
      let uniFeatures;
      uniFeatures = getUniqueFeatures(features, "depth");
      let selecteData = uniFeatures.map((x) => x.properties["depth"]); //TODO - FIX THIS VARIABLE NAME
      addLegend(
        currentGeojsonLayers.color,
        currentGeojsonLayers.breaks,
        2,
        layer,
        selecteData
      );
    }
  }, 600);
}
