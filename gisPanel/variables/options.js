let mapOptions = {
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [-71.5, 19.0],
  zoom: 7,
  maxZoom: 14,
};

// let sourceOptions = {}; //not finished; meant to allow customizing sources loaded initally

//WRT OVERLAY (TOPRIGHTMOST BUTTON)
//objects for boundary layers
//sets colors for points
let pointColors = {
  "airports-extended": "blue",
  healthsites: "red",
  volcano_list: "orange",
  glopal_power_plant: "green",
  world_port_index: "yellow",
};

//this is the id the popup uses to show the name
let pointDesc = {
  "airports-extended": "Airport_Na",
  healthsites: "name", //conflicting with power plants in geojson, need to change name
  volcano_list: "Volcano_Na",
  glopal_power_plant: "name",
  world_port_index: "PORT_NAME",
};
