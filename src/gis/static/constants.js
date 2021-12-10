const constants = {
  sourceURLs: {
    hex1: "https://sebastian-ch.github.io/sidsDataTest/data/hex1/{z}/{x}/{y}.pbf",
    hex5: "https://sebastian-ch.github.io/sidsDataTest/data/hex5/{z}/{x}/{y}.pbf",
    hex10:
      "https://sebastian-ch.github.io/sidsDataTest/data/hex10/{z}/{x}/{y}.pbf",
    hex5clipped:
      "https://sebastian-ch.github.io/sidsDataTest/data/hex5clipped/{z}/{x}/{y}.pbf",
    admin1:
      "https://sebastian-ch.github.io/sidsDataTest/data/admin1/{z}/{x}/{y}.pbf",
    admin2:
      "https://sebastian-ch.github.io/sidsDataTest/data/admin2/{z}/{x}/{y}.pbf",
    ocean:
      "https://sebastian-ch.github.io/sidsDataTest/data/oceans/{z}/{x}/{y}.pbf",
    allSids:
      "https://sebastian-ch.github.io/sidsDataTest/data/allsids/{z}/{x}/{y}.pbf",
  },
  hexes: ["hex1", "hex5", "hex10", "hex5clipped"],
  admins: ["admin1", "admin2"],
  userLayers: [
    "hex1",
    "hex5",
    "hex10",
    "hex5clipped",
    "admin1",
    "admin2",
    "ocean",
  ],
  nogos: [
    //EXTRACTED FROM WITHIN randomStart()
    0, 1, 2, 4, 12, 16, 24, 25, 26, 27, 28, 29, 31, 32, 41, 43, 45, 47, 48, 50,
    52,
  ],
  styles: [
    {
      title: "Satellite With Labels",
      uri: "mapbox://styles/mapbox/satellite-streets-v11",
    },
    {
      title: "Light",
      uri: "mapbox://styles/mapbox/light-v10",
    },
    {
      title: "Satellite Imagery",
      uri: "mapbox://styles/mapbox/satellite-v9",
    },
    {
      title: "Mapbox Dark",
      uri: "mapbox://styles/mapbox/dark-v10",
    },
  ],
  unwantedMapboxLayers: [
    "admin-1-boundary",
    "admin-1-boundary-bg",
    "road-label",
    "road-number-shield",
    "airport-label",
  ],
};
export default constants;
