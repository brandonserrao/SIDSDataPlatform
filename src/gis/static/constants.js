const constants = {
  sourceURLs: {
    hex1:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5clipped/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/hex1/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    hex5:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5clipped/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/hex5/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    hex10:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5clipped/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/hex10/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    hex5clipped:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/hex5clipped/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/hex5clipped/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    admin1:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/admin1/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/admin1/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    // "https://sebastian-ch.github.io/sidsDataTest/data/admin1/{z}/{x}/{y}.pbf",
    admin2:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/admin2/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/admin2/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    ocean:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/oceans/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/oceans/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
    allSids:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/sids/vectortiles/oceans/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/allsids/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
  },
  /* sourceURLs: {
    hex1: "https://sebastian-ch.github.io/sidsDataTest/data/hex1/{z}/{x}/{y}.pbf",
    hex5: "https://sebastian-ch.github.io/sidsDataTest/data/hex5/{z}/{x}/{y}.pbf",
    hex10:
      "https://sebastian-ch.github.io/sidsDataTest/data/hex10/{z}/{x}/{y}.pbf",
    hex5clipped:
      "https://sebastian-ch.github.io/sidsDataTest/data/hex5clipped/{z}/{x}/{y}.pbf",
    admin1:
      // "https://undpngddlsgeohubdev01.blob.core.windows.net/vectortiles/SIDS/tiles/admin1/{z}/{x}/{y}.pbf?sp=r&st=2021-12-20T19:56:41Z&se=2025-12-21T03:56:41Z&spr=https&sv=2020-08-04&sr=c&sig=YDP%2B60KZ%2FThM%2FM4Po1H8nnx8fhNmbH%2FoKqO6chWcKnE%3D",
      "https://sebastian-ch.github.io/sidsDataTest/data/admin1/{z}/{x}/{y}.pbf",
    admin2:
      "https://sebastian-ch.github.io/sidsDataTest/data/admin2/{z}/{x}/{y}.pbf",
    ocean:
      "https://sebastian-ch.github.io/sidsDataTest/data/oceans/{z}/{x}/{y}.pbf",
    allSids:
      "https://sebastian-ch.github.io/sidsDataTest/data/allsids/{z}/{x}/{y}.pbf",
  }, */
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
