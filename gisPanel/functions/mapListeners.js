//--LISTENERS--//
function bindMapListeners() {
  //RECOLORING TRIGGERS----------------------------------
  map.on("dragend", function (e) {
    //recolor hexes/data on dragend
    //LIMIT RECOLORING OF HEXES LARGER DATASETS ENABLED OR IF TOO ZOOMED IN
    if (!(map.getLayer("ocean") || map.getLayer("hex1") || map.getZoom() > 9)) {
      console.log("recolor");
      recolorBasedOnWhatsOnPage();
    }
  });

  map.on("zoomend", function (e) {
    //recolor hexes/data on zoomend
    //if you want the map to recolor on the end of zoom
    console.log(map.getZoom());
    //recolorBasedOnWhatsOnPage(); //KEPT DISABLED; WORKS BUT COLORRAMPS RECOLOR
  });
  //------------------------------------------------------

  //ON MAP DATA CLICK TRIGGERS---------------------------------
  //TODO COMBINE THESE INTO SOMETHING CLEANER
  map.on("click", hexes, function (e) {
    console.log("onDataClick trigger for hexes");
    onDataClick(e);
  });

  map.on("click", admins, function (e) {
    console.log("onDataClick trigger for admins");
    onDataClick(e);
  });

  map.on("click", function (e) {
    //TODO DETERMINE THIS USAGE
    console.log("??? clickDiv creation ???");
    //UNSURE; APPEARS LINKED TO ONCLICKCONTROL
    if (map.getLayer("iso")) {
      map.removeLayer("iso");
      map.removeSource("iso");
    }

    if (map.getSource("clickedone")) {
      map.removeLayer("clickedone");
      map.removeSource("clickedone");
    }

    if (map.getSource("highlightS")) {
      map.removeLayer("highlight");
      map.removeSource("highlightS");
    }

    if (map.getSource("joined")) {
      map.removeLayer("joined");
      map.removeSource("joined");
    }

    // var clickDiv = document.getElementsByClassName("my-custom-control")[0];
    let clickDiv = document.getElementsByClassName("my-custom-control")[0];

    /*clickDiv.style.height = '0px';
    clickDiv.style.width = '0px'; */
    clickDiv.style.display = "none";
    clickDiv.innerHTML = "";
  });
  //------------------------------------------------------------

  //HEX1 AVAILABILITY TRIGGER-----------------------------------
  //FUNCTIONALITY: removed option for hex1 when zoomlevel inappropriate
  //ISSUE: .hexbin-change may not exist/be created/class might not exist

  map.on("zoom", function (e) {
    //TODO FIX FUNCTIONALITY:
    if (map.getZoom() < 5) {
      console.log("disabling option for selecting hex1bins");
      $('.hexbin-change option[value="hex1"]').prop("disabled", true);
      /*       document
        .querySelector('.hexbin-change option[value="hex1"]')
        .style.disabled(true); */
    }

    if (map.getZoom() >= 5) {
      console.log("enabling option for selecting hex1bins");
      $('.hexbin-change option[value="hex1"]').prop("disabled", false);
      /*       document
        .querySelector('.hexbin-change option[value="hex1"]')
        .style.disabled(false); */
      //
    }
  });
  //-------------------------------------------------------------
}
