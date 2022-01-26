const constants = {
  sourceURLs: {
    hex1: "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex1/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    hex5: "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    hex10:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex10/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    hex5clipped:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5clipped/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    admin1:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/admin1/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    admin2:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/admin2/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    ocean:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/oceans/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
    allSids:
      "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/allsids/{z}/{x}/{y}.pbf?sv=2020-08-04&st=2022-01-06T07%3A39%3A53Z&se=2023-01-07T07%3A39%3A00Z&sr=c&sp=racwl&sig=uN7Z2aqOpU9upKl2zP4hEh1VfgMVwYixgml8uS216g8%3D",
  },
  hexes: ["hex1", "hex5", "hex10", "hex5clipped"],
  admins: ["admin1", "admin2"],
  userLayers: [
    //user manipulable/toggleable data layers
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
      name: "Mapbox Satellite Streets",
      // title: "Satellite With Labels",
      uri: "mapbox://styles/mapbox/satellite-streets-v11",
    },
    {
      name: "Mapbox Light",
      // title: "Light",
      uri: "mapbox://styles/mapbox/light-v10",
    },
    {
      name: "Satellite Imagery", //double check for correct name
      // title: "Satellite Imagery",
      uri: "mapbox://styles/mapbox/satellite-v9",
    },
    {
      name: "Mapbox Dark",
      // title: "Mapbox Dark",
      uri: "mapbox://styles/mapbox/dark-v10",
    },
  ],
  unwantedMapboxLayers: [
    "admin-1-boundary",
    "admin-1-boundary-bg",
    "road-label",
    "road-number-shield",
    "road-exit-shield",
    "airport-label",
  ],
};
export default constants;
