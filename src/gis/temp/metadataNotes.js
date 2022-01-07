hexid, fliX/depth/




name: "GDP per Capita",
    type: "temporal",
    layers: [
      {
        Field_Name: "1a1",
        Description: "GDP per Capita",
        Temporal: 1990,
        "Raster File": "GDP_PPP_30arcsec_v3.nc",
        Band: 1,
        SDG: "1,2,3,5,8,9,15,17",
        samoa_pathway: "1,4,12,13,16",
        pillars: "1,2,3",
        Name: "GDP per Capita",
        Unit: "USD per Capita",
        Desc_long:
          "GDP (PPP) represents total gross domestic production in a given grid cell in constant 2011 international US dollars. ",
        Source_Name: "Kummu et al. (2018)",
        Source_Link: "https://www.nature.com/articles/sdata20184",
      },

      
    name: "Water use",
    type: "layers",
    layers: [
      {
        Field_Name: "6c1",
        Description: "Domestic Water Use (Consumed)",
        Temporal: null,
        "Raster File": "cons_dom.nc",
        Band: 1,
        SDG: "2,3,6,8,10,11,12,15,16,17",
        samoa_pathway: "2,3,4,6,7,9,11,16",
        pillars: "1,2",
        Name: "Water Use",
        Unit: "km<sup>3</sup> yr<sup>-1</sup>",
        Desc_long:
          "Sectoral water withdrawal dataset for the period 1971–2010, which distinguishes six water use sectors, i.e., irrigation, domestic, electricity generation (cooling of thermal power plants), livestock, mining, and manufacturing.",
        Source_Name: "Huang et al. (2018)",
        Source_Link: "https://www.osti.gov/biblio/1437035",
      },


      {
        name: "Predicted Low-voltage Infrastructure",
        type: "single",
        layers: [
          {
            Field_Name: "7a1",
            Description: "predicted low-voltage infrastructure in kilometres",
            Temporal: null,
            "Raster File": "lv.tif",
            Band: 1,
            SDG: "4,6,7,8,9,10,11,15,16",
            samoa_pathway: "1,3,4,,9,12,13,16",
            pillars: "1,2",
            Name: "Predicted Low-voltage Infrastructure",
            Unit: "%",
            Desc_long: "Composite map of the global power system, modeled.",
            Source_Name: "Arderne et al. (2020)",
            Source_Link: "https://www.nature.com/articles/s41597-019-0347-4#citeas",
          },
        ],
      },



      [Wl]
0: Wl
id: "51083610874"
layer:
id: "hex5"
layout: {visibility: undefined}
paint: {fill-color: te, fill-opacity: 0.8}
source: "hex5"
source-layer: "hex5"
type: "fill"
[[Prototype]]: Object
properties:
1a1: 2038538.12
1a2: 3082209.75
1a3: 3002710.5
1b1: 102.6429
1b2: 0.0241
1c1: 64.4528
1c2: 64.1461
1c3: 63.8456
1c4: 63.5514
1c5: 63.2633
7d1: 0.6365
7d5: 0.7435
7d10: 0.6909
dem: 1239.1339
hexid: "51083610874"
[[Prototype]]: Object
source: "hex5"
sourceLayer: "hex5"
state: {}
type: "Feature"
_geometry:
coordinates: Array(1)
0: Array(7)
0: (2) [-71.62965774536133, 18.76331339461342]
1: (2) [-71.61678314208984, 18.739581104154325]
2: (2) [-71.62965774536133, 18.715682894088644]
3: (2) [-71.65557861328125, 18.715682894088644]
4: (2) [-71.66862487792969, 18.739581104154325]
5: (2) [-71.65557861328125, 18.76331339461342]
6: (2) [-71.62965774536133, 18.76331339461342]
length: 7
[[Prototype]]: Array(0)
length: 1
[[Prototype]]: Array(0)
type: "Polygon"
[[Prototype]]: Object
_vectorTileFeature: fs {properties: {…}, extent: 4096, type: 3, _pbf: $s, _geometry: 53635, …}
geometry: (...)
[[Prototype]]: Object
length: 1
[[Prototype]]: Array(0)