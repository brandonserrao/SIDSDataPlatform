function zoomToCountry(selection) {
  //TODO -- pass the DOM option itself and not an object; use the DOM object to directly access the id value
  console.log("selection is:");
  console.log(selection);
  //the selection passed to it (an object of {country: "Text in Option"}) not used within function
  //workaround idea: attach the listener to the individual <option>elements</option>
  let val = $("#country option:selected").attr("id"); //TODO this selector is actually using a jQuery extension and not valid in the CSS spec; requires workaroudn
  // let val = document.querySelector("#country option:selected").id;

  map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-opacity", 0);

  let currbb = _.find(names, ["GID_0", val]);

  let v2 = new mapboxgl.LngLatBounds([currbb.bb[0], currbb.bb[1]]);
  map.fitBounds(v2, {
    linear: true,
    padding: {
      top: 10,
      bottom: 25,
      left: 15,
      right: 5,
    },
    pitch: 0,
  });

  if (currentGeojsonLayers.hexSize === "hex1") {
    showSpinner();
  }

  map.once("idle", function (e) {
    if (!map.getLayer("ocean")) {
      recolorBasedOnWhatsOnPage();

      hideSpinner();
    }
  });
}
