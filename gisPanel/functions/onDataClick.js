//ORIGINALLY IN ONCLICKCONTROL.JS
function onDataClick(clicked) {
  console.log(clicked);

  var clickDiv = document.getElementsByClassName("my-custom-control")[0];
  clickDiv.style.display = "block";
  clickDiv.style.height = "100px";
  clickDiv.style.width = "200px";

  clickDiv.innerHTML =
    "<h4><b>Value: </b>" +
    clicked.features[0].properties[
      currentGeojsonLayers.dataLayer
    ].toLocaleString() +
    " " +
    document.getElementById("legendTitle").textContent +
    "</h4>";

  var legData = _.find(allLayers, [
    "field_name",
    currentGeojsonLayers.dataLayer,
  ]);

  //console.log(legData);

  if (map.getSource("highlightS")) {
    map.removeLayer("highlight");
    map.removeSource("highlightS");
  }

  if (map.getSource("clickedone")) {
    map.removeLayer("clickedone");
    map.removeSource("clickedone");
  }

  var currId = clicked.features[0].id;

  var feats = map.queryRenderedFeatures({
    layers: [currentGeojsonLayers.hexSize],
    filter: ["==", "hexid", currId],
  });

  console.log(feats);

  //var testAdmin = map.querySourceFeatures()

  var fc = turf.featureCollection(feats);
  // console.log(fc);
  var dis = turf.dissolve(fc);

  map.addSource("clickedone", {
    type: "geojson",
    data: dis,
  });

  map.addLayer({
    id: "clickedone",
    source: "clickedone",
    type: "line",
    paint: {
      "line-color": "purple",
      "line-width": 3,
    },
  });
}
