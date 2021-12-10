//adds the overlays (in the top right menu, it the top most right button)
//should be it's own file
function addBoundaryLayer(object) {
  var points = [
    "airports-extended",
    "healthsites",
    "volcano_list",
    "glopal_power_plant",
    "world_port_index",
  ];

  var k = Object.keys(object); //what layer is being added
  var v = Object.values(object)[0]; //true or false if clicked

  var clicked = k[0];

  console.log(v);
  console.log(clicked);

  if (points.includes(clicked)) {
    if (map.getLayer(clicked)) {
      map.removeLayer(clicked);
    } else {
      map.addLayer({
        id: clicked,
        type: "circle",
        source: "points-source",
        filter: ["==", "layer", clicked],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": pointColors[clicked],
          "circle-radius": 7,
          "circle-opacity": 0.7,
        },
      });
    }
    console.log(clicked);

    map.on("click", clicked, (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties[pointDesc[clicked]];

      //console.log(coordinates);
      getIso(coordinates);

      new mapboxgl.Popup({
        className: "popupCustom",
      })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });
  } else if (clicked === "underwater-overlay") {
    addCables();
  } else if (!v) {
    map.removeLayer(clicked);
    console.log("uncheck: " + clicked);
  } else {
    var slayer;
    var color;
    var source;

    if (clicked === "admin1-overlay") {
      source = "admin1";
      slayer = "admin1";
      color = "red";
    } else if (clicked === "admin2-overlay") {
      source = "admin2";
      slayer = "admin2";
      color = "#003399";
    } else if (clicked === "allsids") {
      //console.log('sids!')
      source = "allsids";
      slayer = "allSids";
      color = "orange";
    } else {
      //source = 'pvaph'

      //layer == 'airports=extended', 'healthsites', 'volcano-list', 'glopal_power_plant', ''
      console.log($(this).val());
      //console.log($(this).id())
      console.log($(this));
    }

    map.addLayer(
      {
        id: clicked,
        type: "line",
        source: source,
        "source-layer": slayer,
        layout: {
          visibility: "visible",
        },

        paint: {
          "line-color": color,
          "line-width": 1,
        },
      },
      firstSymbolId
    );

    if (map.getLayer("admin1-overlay")) {
      map.moveLayer(clicked, "admin1-overlay");
    }

    map.on("mouseover", function () {});
  }
}
