function getFirstSymbolId() {
  //TODO: DECIPHER AND MOVE THIS OUT -------------------------------
  // Find the index of the first symbol layer in the map style
  // we put all hex/admin layers below the words
  //for (let i = 0; i < layers.length; i++) {
  let layers = map.getStyle().layers;
  for (let i = 0; i < layers.length; i++) {
    //???TODO NEEDS EXAMINATION
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }
}
