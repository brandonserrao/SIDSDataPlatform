//ADDING LAYERS TO LAYER SELECTOR OPTIONS
function addToLayersDrop(layers) {
  // $("#layer-id").show();
  document.querySelector("#layer-id").style.display = "block";

  console.log(layers);
  //console.log()
  //console.log(yearList)
  var layersHolder = document.getElementById("layer-drop");
  let length = layersHolder.options.length;

  for (var i = length - 1; i >= 0; i--) {
    layersHolder.options[i] = null;
  }

  for (let x in layers) {
    //console.log(layers[x])
    let option = document.createElement("option");
    option.innerHTML = layers[x].desc + " " + layers[x].time;
    option.setAttribute("id", layers[x].field_name);
    option.setAttribute("value", "hi");
    layersHolder.appendChild(option);
  }
  //console.log(layers.map(x => x.time));
  yearList = layers.map((x) => x.time);
  //console.log(layers);
  //updateTime(layers)
  if (layers[0].title === "Ocean Data") {
    addOcean(layers[0].field_name);
  } else {
    changeDataOnMap(layers[0].field_name);
  }
}
