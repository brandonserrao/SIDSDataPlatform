function fillBasemapLabels() {
  let layers = map.getStyle().layers;
  //this loop adds all symbol and line layers to an object that it used to add or remove the labels
  for (let i in layers) {
    if (layers[i].type === "symbol" || layers[i].type === "line") {
      basemapLabels.push(layers[i]);
    }
  }
}
