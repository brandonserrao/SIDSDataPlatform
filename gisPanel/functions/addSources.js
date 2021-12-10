function addSources(sourceURLs) {
  //called when map is loaded

  //pulls in the pointdata about airports volcanoes etc
  d3.json(pointdataFilePath).then(function (d) {
    console.log(d);
    map.addSource("points-source", {
      type: "geojson",
      data: d,
    });
  });

  //LOAD SOURCES (VECTOR TILES)
  for (let idString of Object.keys(sources)) {
    console.log("adding " + idString);
    map.addSource(idString, sources[idString]);
  }

  if (!map.getLayer("allsids")) {
    //LOADING ALLSIDS LAYER IF NOT ADDED BEFORE FOR SOME REASON;
    // WHY NECESSARY??? -> READ ON MAPBOX LAYER VS STYLE VS SOURCE!
    console.log(
      "??? adding allsids layer because it wasnt added for some reason"
    );
    map.addLayer(
      {
        id: "allsids",
        type: "line",
        source: "allsids",
        "source-layer": "allSids",
        layout: {
          visibility: "visible",
        },
        paint: {
          "line-color": "orange",
          "line-width": 1,
        },
      },
      firstSymbolId
    );
  }

  //finished loading in so hide spinner
  hideSpinner();
}
