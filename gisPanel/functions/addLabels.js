//adds/remove labels
function addLabels(object) {
  let sel = Object.values(object)[0];
  console.log(sel);
  console.log(basemapLabels);

  // console.log($('#addLabels')[0].innerText)
  if (sel === "On") {
    basemapLabels.forEach(function (x) {
      //console.log(x);
      map.addLayer(x);
      if (x.type === "line") {
        if (map.getLayer(currentGeojsonLayers.hexSize)) {
          map.moveLayer(x.id, currentGeojsonLayers.hexSize);
        }
      }
    });
    //$('#addLabels').toggle();
    //$('#addLabels')[0].innerText = 'Remove Labels'
  } else {
    basemapLabels.forEach(function (x) {
      map.removeLayer(x.id);
    });

    //$('#addLabels')[0].innerText = 'Add Labels'
  }
}
