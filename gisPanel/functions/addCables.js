//add underwater cables
function addCables() {
  if (map.getLayer("underwater")) {
    map.removeLayer("underwater");
  } else if (!map.getSource("underwater-source")) {
    d3.json(cableFilePath).then(function (d) {
      //TODO REPLACE WITH FILEPATH VARIABLE
      //TODO CHANGE DATA FILE PATH
      map.addSource("underwater-source", {
        type: "geojson",
        data: d,
      });

      map.addLayer(
        {
          id: "underwater",
          type: "line",
          source: "underwater-source",

          layout: {
            visibility: "visible",
          },

          paint: {
            "line-color": ["get", "color"],
            "line-width": 2,
          },
        },
        firstSymbolId
      );
    });
  } else {
    map.addLayer(
      {
        id: "underwater",
        type: "line",
        source: "underwater-source",

        layout: {
          visibility: "visible",
        },

        paint: {
          "line-color": ["get", "color"],
          "line-width": 3,
        },
      },
      firstSymbolId
    );
  }

  map.on("click", "underwater", function (e) {
    var popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    popup
      .setLngLat(e.lngLat)
      .setHTML("<b>" + e.features[0].properties["slug"] + "</b>")
      .addTo(map);
  });
}
