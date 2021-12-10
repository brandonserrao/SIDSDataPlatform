//adds the voronoi layer, currently uses the chart button.
//to switch, just add the id 'voro' to any button
//currently has some issues around 180 meridian

$("#voro").on("click", function () {
  //removes voro and bbox layer if they're already on
  if (map.getLayer("vz")) {
    map.removeLayer("vz");
    map.removeSource("vz");
    map.removeLayer("bbox13");
    map.removeSource("bbox13");
  } else {
    //gets sids layer that's visible
    var countryii = map.queryRenderedFeatures({
      layers: ["allsids"],
    });

    var newOne1 = [];
    var propers = {};

    //converts tiles to outline

    countryii.forEach(function (f) {
      var geom = f.geometry;
      var props = f.properties;
      var id = f.id;
      propers[id] = props;

      if (geom.type === "MultiPolygon") {
        console.log(f);
        for (var i = 0; i < geom.coordinates.length; i++) {
          var poly = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: geom.coordinates[i],
            },
            id: id,
            properties: props,
          };
          newOne1.push(poly);
        }
      } else {
        newOne1.push(f);
      }
    });

    var fc = turf.featureCollection(countryii);
    var thebbox = turf.bbox(fc);
    console.log(thebbox);

    //creates 25 random points within bbox

    var randoPoints = turf.randomPoint(25, {
      bbox: thebbox,
    });
    console.log(randoPoints);

    //creates voronoi's off those points
    var voronoiz = turf.voronoi(randoPoints, {
      bbox: thebbox,
    });
    console.log(voronoiz);

    //random colors for voronois if you want
    for (var x in voronoiz.features) {
      voronoiz.features[x].properties.color =
        "#" + (Math.random().toString(16) + "000000").substring(2, 8);
    }

    var thebboxActual = turf.bboxPolygon(thebbox);

    map.addSource("bbox13", {
      type: "geojson",
      data: thebboxActual,
    });

    map.addLayer({
      id: "bbox13",
      source: "bbox13",
      type: "line",
      paint: {
        "line-color": "red",
        "line-width": 3,
      },
    });

    map.addSource("vz", {
      type: "geojson",
      data: voronoiz,
    });

    map.addLayer({
      id: "vz",
      source: "vz",
      type: "line",
      paint: {
        //   'line-color': ['get', 'color'], if you want random colors
        "line-color": "orange",
        "line-width": 3,
      },
    });

    map.fitBounds(thebbox, {
      padding: 50,
    });
  }
});
