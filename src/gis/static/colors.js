//BRANDON - updated using Atlas' color latest color schemes (January 2022)

// This color library includes the color ramps used in UNDP SIDS Geospatial Dashboard.

// Please generally assign each data topic with a unique color scheme
//     considering its data type (qualitative, sequential, diverging),
//     and in most cases associate dark color with high values, vice versa.

// If possible, avoid red-green combination for colorblind-friendly design.

// Recommended resource for single color scheme choices (qual, seq, div): https://colorbrewer2.org/
// Examples of bi-variate color scheme choices: https://nowosad.github.io/post/cbc-bp2/

// TYPE 1-3: Basic Type (Qualitative, Sequential, Diverging)
// TYPE 4-5: Bivariate Type (3*3, 4*4)
// TYPE 6: Special Type

import chroma from "chroma-js";
const colors = {
  // ----------------------------------------------
  // TYPE 1: Qualitative / Categorical Color Ramps
  colorQual: {
    light5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"], // 5 light colors: green, orange, blue, pink, yellow-green
    dark5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"], // 5 light colors: red, blue, green, purple, orange
  },

  // ------------------------------
  // TYPE 2: Sequential Color Ramps (Low to High)
  colorSeq: {
    // single hue
    green: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"], // light -> dark green
    purple: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"], // light -> dark purple
    orange: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"], // light -> dark orange
    pop: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"], // light -> dark pink
    newSun: ["#FEF65C", "#FEE745", "#FFD82F", "#FFC918", "#FFBA01"], // light -> dark yellow
    blues: ["#ABD7EC", "#59C1E8", "#3585DA", "#1061B0", "#003C72"], // light -> dark blue
    silvers: ["#BEBEBE", "#AFAFAF", "#9F9F9F", "#909090", "#808080"], // light -> dark black
    combo: ["#fdfbf6", "#FEE745", "#FFD82F", "#FFC918", "#FFBA01"], // white -> dark yellow
    pinkish: ["#f8eff1", "#f1d2d4", "#e7a9b1", "#c65e6a", "#af3039"], // white -> red

    // single hue (from colorbrewer; recommended)
    blue5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
    green5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
    grey5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
    orange5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
    purple5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
    red5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],

    // multiple hues
    "yellow-blue": chroma.scale(["#fafa6e", "#2A4858"]).mode("lch").colors(5), // yellow -> dark blue
    colorBlindGreen: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"], // yellow -> drak green

    // multiple hues (from colorbrewer; recommended)
    BuGn5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
    BuPu5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
    GnBu5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
    OrRd5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
    PuBu5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
    PuBuGn5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
    PuRd5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
    RdPu5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
    YlGn5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
    YlGnBu5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    YlOrBr5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
    YlOrRd5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],

    // TO-BE-MODIFIED
    ocean: ["#08519c", "#3182bd", "#6baed6", "#bdd7e7", "#eff3ff"], // dark -> light blue (Atlas: move to the TYPE 6)
    sunIndex: ["#fdfbf6", "#FAE7B9", "#FAE39B", "#FADE7C", "#FADA5E"], // light -> dark yellow (Atlas: too similar; consider removing it)
    minty: ["#aaf0d1", "#96e6c2", "#7dd8b5", "#5ec69d", "#3eb489"], // light -> dark green (Atlas: too similar; consider removing it)
  },

  // -----------------------------
  // TYPE 3: Diverging Color Ramps (Low to High)
  // Note: only the variables with a meaningful midpoint of range should be considered in this type.
  colorDiv: {
    "red-blue": ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"], // red -> white -> blue
    "blue-red": ["#0571b0", "#92c5de", "#f7f7f7", "#f4a582", "#ca0020"], // blue -> white -> red

    // from colorbrewer; recommended (color-blind friendly)
    BrBG5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
    PiYG5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
    PRGn5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
    PuOr5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
    RdBu5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    RdYlBu5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],

    // from colorbrewer; but NOT recommended (NOT color-blind friendly)
    RdGy5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
    RdYlGn5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
    Spectral5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],

    // TO-BE-MODIFIED
    gdpColor: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"], // red -> white -> blue (Atlas: use sequential color for GDP)
  },

  // -----------------------------------
  // TYPE 4:  3*3 bi-variate color ramps
  colorQualSeq3: {},
  colorQualDiv3: {},
  colorSeqSeq3: {
    "blue-red-brown": [
      "#e8e8e8",
      "#e4acac",
      "#c85a5a", // white -> red
      "#b0d5df",
      "#ad9ea5",
      "#985356",
      "#64acbe",
      "#627f8c",
      "#574249",
    ], // blue -> brown
    "blue-pink-purple": [
      "#e8e8e8",
      "#d9aeca",
      "#c974ad", // white -> pink
      "#aecbd9",
      "#9f91bb",
      "#8f579d",
      "#74adc9",
      "#6573ab",
      "#55398e",
    ], // blue -> purple
  },
  colorSeqDiv3: {},
  colorDivDiv3: {},

  // -----------------------------------
  // TYPE 5:  4*4 bi-variate color ramps
  colorQualSeq4: {},

  colorQualDiv4: {},

  colorSeqSeq4: {},

  colorSeqDiv4: {},

  colorDivDiv4: {},

  // -----------------------------------
  // TYPE 6: Special Color Ramps
  colorNatural: {
    elevation: ["#117d37", "#71a925", "#d8e260", "#f5ce73", "#8f7a35"],
    "ocean-depth": ["#08519c", "#3182bd", "#6baed6", "#bdd7e7", "#eff3ff"], // dark -> light blue (Atlas: move to the TYPE 6)
  },
};
export default colors;
