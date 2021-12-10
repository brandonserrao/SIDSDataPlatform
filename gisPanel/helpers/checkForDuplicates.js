//taken from this example: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
function checkForDuplicates(array) {
  let valuesAlreadySeen = [];

  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    if (valuesAlreadySeen.indexOf(value) !== -1) {
      return true;
    }
    valuesAlreadySeen.push(value);
  }
  return false;
}
