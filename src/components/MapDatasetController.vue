<template>
  <div class="">
    <v-card class="mb-4">
      <button class="printout debug" @click="printout">
        Printout Datasets to Console
      </button>
      <v-row>
        <v-col cols="6">
          <v-list dense>
            <v-list-item-group v-model="activeGoalType" mandatory>
              <v-list-item
                v-for="(item, i) in goalTypes"
                :key="i"
                :value="item.value"
                @change="resetGoalModel"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list v-if="activeGoalType === 'pillars'" dense>
            <v-list-item-group v-model="activePillar" mandatory>
              <v-list-item v-for="(item, i) in pillars" :key="i" :value="i + 1">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-slide-group
            v-else
            class="goals-slider"
            @click:next="goalUpdateNext($event)"
            @click:prev="goalUpdatePrev($event)"
            show-arrows
            ref="slider"
          >
            <v-slide-item
              v-for="(n, index) in activeGoalTypes"
              :key="n"
              :value="index + 1"
            >
              <v-menu open-on-hover bottom>
                <template v-slot:activator="{ on }">
                  <img
                    v-on="on"
                    :src="getGoalImage(index)"
                    height="56"
                    width="56"
                  />
                </template>
                <div class="goals-tooltip-content">
                  <img
                    v-for="(n, index) in activeGoalTypes"
                    @click="selectGoal(index + 1)"
                    :key="n"
                    :src="getGoalImage(index)"
                    class="tooltip-image"
                    height="56"
                    width="56"
                  />
                </div>
              </v-menu>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-select
            class="map-input"
            dense
            v-model="activeDatasetName"
            :items="filteredDatasets"
            item-text="name"
            item-value="name"
            label="Dataset"
            @input="emitUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="activeDataset && activeDataset.type === 'layers'" dense>
        <v-col>
          <v-select
            dense
            class="map-input"
            v-model="activeLayerName"
            item-text="Description"
            item-value="Description"
            :items="activeDataset.layers"
            label="Layer"
            @input="emitUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        v-else-if="activeDataset && activeDataset.type === 'temporal'"
        dense
      >
        <v-col>
          <v-slider
            class="map-input"
            v-model="activeLayerName"
            :tick-labels="ticksLabels"
            :max="activeDataset.layers.length - 1"
            step="1"
            ticks="always"
            tick-size="4"
            @input="emitUpdate"
          ></v-slider>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="activeLayer">
      <v-card-subtitle>
        <b
          >{{ activeLayer.Description }}
          {{ activeDataset.type === "temporal" ? activeLayer.Temporal : "" }}</b
        >
      </v-card-subtitle>
      <v-card-text>
        {{ activeLayer.Desc_long }}<br />
        <b>Reference</b> {{ activeLayer.Source_Name }} <br />
        <a :href="activeLayer.Source_Link" target="_blank">
          {{ activeLayer.Source_Link }}
        </a>
      </v-card-text>
    </v-card>

    <!-- New Legend/Histogram -->
    <v-card
      v-if="displayLegend"
      :onload="_onloadLegend()"
      class="histogram_frame"
    >
      <div id="histogram_frame" class="pic app-body population-per-km col-flex">
        <div class="row-flex space-evenly" id="legendTitle"></div>
        <div class="row-flex space-evenly" id="updateLegend"></div>
        <canvas
          ref="canvas_histogram"
          id="histogram"
          width="320"
          height="115"
        ></canvas>
      </div>
    </v-card>

    <!-- OLDCODE - HISTOGRAM/LEGEND FRAME -->
    <!-- 
    <div>
      <div class="pic app-body population-per-km col-flex" id="histogram_frame">
        <div class="row-flex space-evenly" id="legendTitle">
          Select a Dataset and Layer to view data on the map.
        </div>

        <div class="row-flex space-evenly" id="updateLegend"></div>
      </div>
    </div>
     -->
  </div>
</template>

<script>
import datasets from "@/gis/static/layers";
import globals from "@/gis/static/globals";
/* 
import * as d3 from "d3";
import chroma from "chroma-js"; */
import Chart from "chart.js"; //disabled temporarily because of myHistogram/Chart.js issue

export default {
  name: "MapDatasetController",
  props: ["displayLegend", "map"],
  data() {
    return {
      // histogramCanvasElement: this.$refs.canvas_histogram,
      histogramCanvasElement: null,
      activeGoal: 1,
      activeDatasetName: null,
      activeLayerName: null,
      datasets,
      activeGoalType: "sdgs",
      goalTypes: [
        {
          name: "SIDS offer Pillars",
          value: "pillars",
        },
        {
          name: "SDGs",
          value: "sdgs",
        },
        {
          name: "SAMOA Pathway",
          value: "samoaPriorities",
        },
      ],
      activePillar: 1,
      pillars: [
        {
          name: "Blue Economy",
          value: "blue",
        },
        {
          name: "Climate Action",
          value: "climate",
        },
        {
          name: "Digital transformation",
          value: "digital",
        },
      ],
      sdgs: [
        "No poverty",
        "Zero hunger",
        "Good health and well-being",
        "Quality education",
        "Gender equality",
        "Clean water and sanitation",
        "Affordable and clean energy",
        "Decent work and economic growth",
        "Industry, innovation and infrastructure",
        "Reduced inequalities",
        "Sustainable cities and communities",
        "Responsible consumption and production",
        "Climate action",
        "Life below water",
        "Life on Land",
        "Peace, justice, and strong institutions",
        "Partnerships for the goals",
      ],
      samoaPriorities: [
        "Sustainable, inclusive and equitable economic growth",
        "Climate Change",
        "Sustainable Energy",
        "Disaster Risk Reduction",
        "Oceans and Seas",
        "Food Security and Nutrition",
        "Water and Sanitation",
        "Sustainable Transportation",
        "Sustainable Consumption and Production",
        "Chemical and Waste management",
        "Health and NCDs",
        "Gender Equality",
        "Social Development",
        "Biodiversity",
        "Invasive species",
        "Means of Implementation",
      ],
      layers: [],
    };
  },
  computed: {
    /*     histogramCanvasElement() {//!! doing via a $ref on the element itself and ref'd in Data
      //intended to get and store the histogram canvas, in order to make it available to be updated by the Map classmethods, via emitting
      return document.getElementById("histogram");
    }, */
    filteredDatasets() {
      return this.datasets.reduce((array, dataset) => {
        let filtered = Object.assign({}, dataset);
        if (this.activeGoalType === "pillars") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.pillars.includes(this.activePillar)
          );
        } else if (this.activeGoalType === "sdgs") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.SDG.includes(this.activeGoal)
          );
        } else if (this.activeGoalType === "samoaPriorities") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.samoa_pathway.includes(this.activeGoal)
          );
        }
        if (filtered.layers.length > 0) {
          array.push(filtered);
        }
        return array;
      }, []);
    },
    activeGoalTypes() {
      return this[this.activeGoalType];
    },
    ticksLabels() {
      return this.activeDataset.layers.map((layer) => layer.Temporal);
    },
    activeDataset() {
      return this.filteredDatasets.find(
        (dataset) => dataset.name === this.activeDatasetName
      );
    },
    activeLayer() {
      if (!this.activeDataset) return null;
      if (this.activeDataset.type === "temporal") {
        return this.activeDataset.layers[this.activeLayerName];
      } else if (this.activeDataset.type === "layers") {
        return this.activeDataset.layers.find(
          (layer) => layer.Description === this.activeLayerName
        );
      } else {
        return this.activeDataset.layers[0];
      }
    },
  },
  methods: {
    _fillAllLayers() {
      //adding for attempted compatibility with oldcode;
      // oldcode uses allLayers as a storage for all dataset/layer metadata that fuels the leftsidebar/mapdatacontroller;
      // need to verify that the format of allLayers and filteredDatasets is the same
      console.log("_fillAllLayers called");
      globals.allLayers = this.filteredDatasets;
      globals.activeDataset = this.activeDataset;
      globals.activeLayer = this.activeLayer;
    },
    _onloadLegend() {
      console.log("legend onload triggered");
    },
    printout() {
      //testmethod for examining state/dataset
      console.log(`filteredDataset:`);
      console.log(this.filteredDatasets);

      console.log(`activeDataset:`);
      console.log(this.activeDataset);
      console.log(`activeLayer:`);
      console.log(this.activeLayer);
      console.log("map passed in via prop");
      console.log(this.map);
    },

    emitUpdate(vSlider_inputValue) {
      console.log(`emitUpdate of activeDataset and activeLayer`);
      // this.$emit("update", {this.activeDataset, this.activeLayer});

      //if called by v-slider, should pass its input value, which is the index of the desired layer in the array dataset.layers
      this.activeLayer = this.activeDataset.layers[vSlider_inputValue];

      let active = { dataset: this.activeDataset, layer: this.activeLayer }; //package data to pass to parents with update
      this.$emit("update", active);

      console.log(`in emitUpdate  updateHistogramCanvas`);

      // this.emitHistogramUpdate(); //piggybacking on the general update //used in (failed) attempt to pass canvas element up in emits
      this.updateHistogramCanvas(this.map);
    },
    updateHistogramCanvas(map) {
      //old code, adapted; disabled because cannot figure out issue Chart.js has with it right now
      console.log("in updateHistogramCanvas:");
      console.log("map:");
      console.log(map);
      console.log("myHistogram data: ");
      console.log(map.data);
      console.log("myHistogram options: ");
      console.log(map.option);
      console.log("myHistogram canvas: ");
      console.log(map.canvas);

      globals.myHistogram = Chart.Bar(
        this.$refs.canvas_histogram, //histogram canvas element by $ref
        {
          data: map.data,
          options: map.option,
        }
      );
    },
    /*     emitHistogramUpdate() {
      console.log("emitHistogramUpdate! histogramCanvasElement:");
      // this.histogramCanvasElement = document.getElementById("histogram");
      this.histogramCanvasElement = this.$refs.canvas_histogram;
      console.log(this.histogramCanvasElement);
      this.$emit("histogram-update", this.histogramCanvasElement);
    }, */

    /*
    emitDatasetSelect(value) {//obsoleted by emitUpdate
      console.log(`emitDatasetSelect( ${value} )`);
      this.$emit("dataset-select", value);
    },
    emitLayerSelect(value) {//obsoleted by emitUpdate
      console.log(`emitLayerSelect( ${value} )`);
      this.$emit("layer-select", value);
    }, */
    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        let goalNmber = (index + 1).toString();
        if (goalNmber.length < 2) {
          goalNmber = "0" + goalNmber;
        }
        return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${goalNmber}.png`;
      } else if (this.activeGoalType === "samoaPriorities") {
        return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/samoaIcons/100w/Asset%20${
          index + 1
        }samoaIcons.png`;
      }
    },
    goalUpdateNext() {
      this.activeGoal = this.activeGoal + 1;
    },
    goalUpdatePrev() {
      this.activeGoal = this.activeGoal - 1;
    },
    resetGoalModel() {
      this.activeGoal = 1;

      //Requred to reset slider when switching between samoa and sdgs
      this.$refs.slider && this.$refs.slider.items[0].toggle();
      this.$refs.slider && this.$refs.slider.scrollIntoView();
    },
    selectGoal(goalNumber) {
      this.activeGoal = goalNumber;
      // this.$refs.slider && this.$refs.slider.items[goalNumber-1].toggle();
      this.$refs.slider.scrollOffset = 56 * (goalNumber - 1);
    },
  },
  mounted() {
    this._fillAllLayers(); //filling obsoleted allLayers with new filteredDatasets for attempted compatibility;

    // this.$nextTick(function () {
    //   //in order to wait until the vue is fully loaded, before looking for the
    //   // this.histogramCanvasElement = this.$refs.canvas_histogram;
    //   this.emitHistogramUpdate(); //should pass the histogramcanvas element into the map class to store it
    // });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*Brandon additions*/
.printout {
  background-color: burlywood;
}

.row-flex {
  display: flex;
  flex-direction: row;
  /* margin-top: 3px; */
  font-size: 11px;
}

.space-evenly {
  justify-content: space-evenly;
}
/*End of Brandon additions*/

.goals-slider {
  padding: 8px 0;
  width: 106px;
  margin: auto;
}
.goals-slider .v-slide-group__next,
.goals-slider .v-slide-group__prev {
  min-width: 25px;
}
.goals-tooltip-content {
  display: flex;
  max-width: 336px;
  flex-wrap: wrap;
}
.tooltip-image {
  cursor: pointer;
}
.map-input {
  padding: 0 1em !important;
}
</style>
