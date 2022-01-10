<template>
  <div class="">
    <v-card class="mb-1 background-transparent">
      <!--       <button class="printout debug" @click="">
        Printout Datasets to Console
      </button> -->
      <v-row>
        <v-col cols="6">
          <v-list class="background-none" dense>
            <v-list-item-group v-model="activeGoalType" mandatory>
              <v-tooltip
                top
                v-for="(item, i) in goalTypes"
                :key="i"
                eager
                transition="fade"
                open-delay="200"
                max-width="400"
                nudge-right="516"
                :nudge-top="18 + 40 * (i + 1)"
                bottom
                content-class="indicator-tooltip"
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                    :value="item.value"
                    @change="resetGoalModel"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card class="tooltip-card">
                  <v-card-title>
                    <v-img
                      class="tooltip-card_img"
                      max-width="160"
                      :src="item.headerImg"
                    ></v-img>
                  </v-card-title>
                  <v-card-text>
                    {{ item.description }}
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list class="background-none" v-if="activeGoalType === 'pillars'" dense>
            <v-list-item-group v-model="activePillar" mandatory>
              <v-tooltip
                right
                v-for="(item, i) in pillars"
                :key="i"
                eager
                open-delay="200"
                transition="fade"
                :nudge-top="18 + 40 * (i + 1)"
                max-width="400"
                bottom
                :nudge-right="303"
                content-class="indicator-tooltip"
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                    class="pillar"
                    :value="i + 1"
                  >
                    <v-list-item-icon class="pillars_icon">
                      <v-img
                        max-height="24"
                        max-width="24"
                        :src="item.icon"
                      ></v-img>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card>
                  <v-card-title>
                    <v-img
                      class="pillar-tooltip_img"
                      max-height="60"
                      max-width="60"
                      :src="item.icon"
                    ></v-img>
                    {{ item.name }}
                  </v-card-title>
                  <v-card-text>{{ item.description }}</v-card-text>
                </v-card>
              </v-tooltip>
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
              <v-menu
                open-on-hover
                bottom
                :nudge-left="281"
                :nudge-bottom="58"
                content-class="sdg-menu"
              >
                <template v-slot:activator="{ on }">
                  <img
                    v-on="on"
                    :src="getGoalImage(index)"
                    height="66"
                    width="66"
                  />
                </template>
                <div class="goals-tooltip-content">
                  <v-tooltip
                    right
                    v-for="(n, index) in activeGoalTypes"
                    :key="n"
                    eager
                    transition="fade"
                    open-delay="300"
                    :nudge-right="(5 - (index % 6)) * 66 || 6"
                    :nudge-top="getGoalsTooltipNudgeTop(index)"
                    max-width="380"
                    content-class="indicator-tooltip"
                    allow-overflow
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        @click="selectGoal(index + 1)"
                        :src="getGoalImage(index)"
                        class="tooltip-image"
                        height="66"
                        width="66"
                      />
                    </template>
                    <v-card>
                      <v-card-title class="coal-title">
                        {{ goalDescriptions[n].title }}
                      </v-card-title>
                      <v-card-text>
                        {{ goalDescriptions[n].content }}
                      </v-card-text>
                    </v-card>
                  </v-tooltip>
                </div>
              </v-menu>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-select
            rounded
            class="map-input"
            dense
            hide-details
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
      <v-row class="spacing-row" v-if="activeDataset && activeDataset.type === 'layers'" dense>
        <v-col>
          <v-select
            rounded
            dense
            hide-details
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
      <v-row class="spacing-row" v-else-if="activeDataset && activeDataset.type === 'temporal'" dense >
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
      <v-row v-else class="spacing-row">
      </v-row>
    </v-card>
    <v-card class="mb-1 block-info background-grey" >
      <v-card-subtitle class="block-header" v-if="activeLayer">
        <b
          >{{ activeLayer.Description }}
          {{ activeDataset.type === "temporal" ? activeLayer.Temporal : "" }}</b
        >
      </v-card-subtitle>
      <v-card-subtitle class="block-header" v-else>
        SIDS Geospatial Platform
      </v-card-subtitle>
      <v-card-text v-if="activeLayer">
        {{ activeLayer.Desc_long }}<br />
        <b>Reference</b> {{ activeLayer.Source_Name }} <br />
        <a :href="activeLayer.Source_Link" target="_blank">
          {{ activeLayer.Source_Link }}
        </a>
      </v-card-text>
      <v-card-text v-else="activeLayer">
        This map visualizes data for the SIDS at different resolutions. Select a dataset above or a country to view spatial data about that region.
      </v-card-text>
    </v-card>

    <!-- New Legend/Histogram -->
    <!-- <v-card v-if="displayLegend" class="histogram_frame"> -->
    <v-card v-show="displayLegend" class="background-grey histogram_frame">
      <div v-show="activeLayer" id="histogram_frame" class="pic app-body population-per-km col-flex">
        <div class="row-flex space-evenly" id="legendTitle"></div>
        <div class="row-flex space-evenly" id="updateLegend"></div>
        <canvas
          ref="canvas_histogram"
          id="histogram"
          width="320"
          height="115"
        ></canvas>
      </div>
      <v-card-text class="histogram_placeholder" v-show="!activeLayer">
        Select a Dataset and Layer to view data on the map.
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import datasets from "@/gis/static/layers";
// import globals from "@/gis/static/globals";
/*
import * as d3 from "d3";
import chroma from "chroma-js"; */
// import Chart from "chart.js";

export default {
  name: "MapDatasetController",
  props: ["displayLegend", "map"],
  data() {
    return {
      activeGoal: 1,
      activeDatasetName: null,
      activeLayerName: null,
      datasets,
      activeGoalType: "sdgs",
      goalTypes: [
        {
          name: "SIDS offer Pillars",
          value: "pillars",
          headerImg:
            // "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/sidsOfferPillars.png",
            "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/sidsOfferPillars.png",
          // "../assets/gis/icons/sidsOfferPillars.png", //working on local server
          description:
            "UNDP’s SIDS offer – Rising Up for SIDS – presents an integrated approach for tapping into areas with potential to accelerate green recovery and transform societies based on three interconnected pillars and responds to the ambitions and demands SIDS expressed during the 2019 midterm review of the S.A.M.O.A. Pathway.",
        },
        {
          name: "SDGs",
          value: "sdgs",
          headerImg:
            // "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/SDGs.png",
            "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/sdgs.png",
          // "../assets/gis/icons/SDGs.png",
          description:
            "The SAMOA Pathway (SIDS Accelerated Modalities of Action) reaffirms that SIDS remain a special case for sustainable development, recognizing SIDS's ownership and leadership in overcoming these challenges.",
        },
        {
          name: "SAMOA Pathway",
          value: "samoaPriorities",
          headerImg:
            // "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/samoaPathway.png",
            "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/samoaPathway.png",
          description:
            "The Global Goals designed to guide development for a better and more sustainable future for all, set up by the UNGA in 2015 and are intended to be achieved in 2030, as per Agenda 2030.",
        },
      ],
      activePillar: 1,
      pillars: [
        {
          name: "Blue Economy",
          value: "blue",
          // icon: "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/blueEconomy.png",
          icon: "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/pillars/blueEconomy.png",
          description:
            "Harnessing the blue economy through an integrated approach rooted in sustainable finance and development.",
        },
        {
          name: "Climate Action",
          value: "climate",
          // icon: "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/climateAction.png",
          icon: "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/pillars/climateAction.png",
          description:
            "Promoting decarbonized and resilient societies through scaled up climate action and enhanced efforts to mobilize climate finance.",
        },
        {
          name: "Digital transformation",
          value: "digital",
          // icon: "https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/digitalTransformation.png",
          icon: "https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/pillars/digitalTransformation.png",
          description:
            "Accelerating digital transformation through a whole-of-society approach that puts people at the centre for inclusive societies and resilient economies.",
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
      goalDescriptions: {
        "No poverty": {
          title: "Goal 1 - No Poverty",
          content:
            "To end poverty in all its forms, everywhere, through a powerful commitment to leave no one behind and to reach those fathest behind first.",
        },
        "Zero hunger": {
          title: "Goal 2 - Zero Hunger",
          content:
            "To end hunger, achieve food security and improve nutrition and promote sustainable agriculture.",
        },
        "Good health and well-being": {
          title: "Goal 3 - Good Health and Well-Being",
          content:
            "To ensure healthy lives and promote well-being for all at all ages.",
        },
        "Quality education": {
          title: "Goal 4 - Quality Education",
          content:
            "To ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
        },
        "Gender equality": {
          title: "Goal 5 - Gender Equality",
          content:
            "To achieve gender equality and empower all women and girls.",
        },
        "Clean water and sanitation": {
          title: "Goal 6 - Clean Water and Sanitation",
          content:
            "To ensure availability and sustainable management of water and sanitation for all.",
        },
        "Affordable and clean energy": {
          title: "Goal 7 - Affordable and Clean Energy",
          content:
            "To ensure access to affordable, reliable, sustainable and modern energy for all.",
        },
        "Decent work and economic growth": {
          title: "Goal 8 - Decent Work and Economic Growth",
          content:
            "To foster sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
        },
        "Industry, innovation and infrastructure": {
          title: "Goal 9 - Industry, Innovation, and Infrastructure",
          content:
            "To build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation",
        },
        "Reduced inequalities": {
          title: "Goal 10 - Reduced Inequality",
          content: "To reduce income inequality within and among countries.",
        },
        "Sustainable cities and communities": {
          title: "Goal 11 - Sustainable cities and communities",
          content:
            "To make cities and human settlements inclusive, safe, resilient, and sustainable.",
        },
        "Responsible consumption and production": {
          title: "Goal 12 - Responsible consumption and production",
          content: "To ensure sustainable consumption and production patterns",
        },
        "Climate action": {
          title: "Goal 13 - Climate Action",
          content:
            "To take urgent action to combat climate change and its impacts by regulating emissions and promoting developments in renewable energy",
        },
        "Life below water": {
          title: "Goal 14 - Life Below Water",
          content:
            "To conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
        },
        "Life on Land": {
          title: "Goal 15 - Life on Land",
          content:
            "To protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss",
        },
        "Peace, justice, and strong institutions": {
          title: "Goal 16 - Peace, justice and strong institutions",
          content:
            "To promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
        },
        "Partnerships for the goals": {
          title: "Goal 17 - Partnership for the goals",
          content:
            "To strengthen the means of implementation and revitalize the global partnership for sustainable development.",
        },
        "Sustainable, inclusive and equitable economic growth": {
          title:
            "1. Sustained and sustainable, inclusive and equitable economic growth with decent work for all",
          content:
            "To support SIDS to achieve sustained, inclusive and equitable growth with full and productive employment, social protection and the creation of decent work for all.",
        },
        "Climate Change": {
          title: "2. Climate Change",
          content:
            "To help SIDS with climate adaptation, including persistent drought and extreme weather events, sea-level rise, coastal erosion and ocean acidification.",
        },
        "Sustainable Energy": {
          title: "3. Sustainable Energy",
          content:
            "To address challenges in accessing sustainable energy in the SIDS including enhanced accessibility to modern energy services, energy efficiency and use of economically viable and environmentally sound technology",
        },
        "Disaster Risk Reduction": {
          title: "4. Disaster risk reduction",
          content:
            "To address the critical need to build resilience, strengthen monitoring and prevention, reduce vulnerability, raise awareness and increase preparedness to respond to and recover from disasters in SIDS",
        },
        "Oceans and Seas": {
          title: "5. Oceans and seas",
          content:
            "To support healthy, productive and resilient oceans and coasts are critical for, inter alia, poverty eradication, access to sufficient, safe and nutritious food, livelihoods, economic development, essential ecosystem services, and identity and culture in SIDS.",
        },
        "Food Security and Nutrition": {
          title: "6. Food security and nutrition",
          content:
            "To support the right to have access to safe, sufficient and nutritious food, the eradication of hunger and the provision of livelihoods while conserving, protecting and ensuring the sustainable use of land, soil, forests, water, plants and animals, biodiversity and ecosystems.",
        },
        "Water and Sanitation": {
          title: "7. Water and sanitation",
          content:
            "To support the efforts of small island developing States to develop capacities for the effective, inclusive and sustainable implementation of the integrated management of water resources and related ecosystems",
        },
        "Sustainable Transportation": {
          title: "8. Sustainable transportation",
          content:
            "To support SIDS to gain access to environmentally sound, safe, affordable, sustainable and well-maintained transportation",
        },
        "Sustainable Consumption and Production": {
          title: "9. Sustainable consumption and production",
          content:
            "To support SIDS on sustainable consumption and production patterns to advance sustainable consumption and production, with an emphasis on MSMEs, sustainable tourism, waste management, food and nutrition, lifestyles, and rural supply chains.",
        },
        "Chemical and Waste management": {
          title:
            "10. Management of chemicals and waste, including hazardous waste",
          content:
            "To support SIDS in sound management of chemicals throughout their life cycle and of waste is crucial for the protection of human health and the environment",
        },
        "Health and NCDs": {
          title: "11. Health and non-communicable diseases",
          content:
            "To support prevention, treatment, care, and education in health as well as support the national actions of SIDS in addressing communicable and non-communicable diseases.",
        },
        "Gender Equality": {
          title: "12. Gender Equality and women’s empowerment",
          content:
            "To support gender equality and women’s empowerment and the full realization of human rights for women and girls have a transformative and multiplier effect on sustainable development and is a driver of economic growth in SIDS.",
        },
        "Social Development": {
          title: "13. Social Development",
          content:
            "To support efforts to enhance social protection and inclusion, to improve well-being and to guarantee opportunities for the most vulnerable and disadvantaged to have equal access to education, health, food, water and sanitation, and productive resources.",
        },
        Biodiversity: {
          title: "14. Biodiversity",
          content:
            "To suport the conservation and sustainable use of biodiversity, as well as their access to and the fair and equitable sharing of benefits arising from the utilization of genetic resources, with the vision of living in harmony with nature",
        },
        "Invasive species": {
          title: "15. Invasive alien species",
          content:
            "To help multisectoral collaboration in SIDS to address invasive alien species in order to protect biodiversity and livelihoods, preserve and maintain ocean resources and ecosystem resiliency, and enhance food security and adapt to climate change",
        },
        "Means of Implementation": {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
      },
      layers: [],
    };
  },
  computed: {
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
    /**
     *passes current dataset+layer selection upwards
     */
    emitUpdate() {
      // console.log(`emitUpdate of activeDataset and activeLayer`);
      let active = { dataset: this.activeDataset, layer: this.activeLayer }; //package data to pass to parents with update
      this.$emit("update", active);
    },

    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        let goalNmber = (index + 1).toString();
        if (goalNmber.length < 2) {
          goalNmber = "0" + goalNmber;
        }
        // let output = `https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${goalNmber}.png`;
        let output = `https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/SDG_Icons_2019_WEB/E-WEB-Goal-${goalNmber}.png`;

        // let output = `../assets/gis/icons/SDG_Icons_2019_WEB/E-WEB-Goal-${goalNmber}.png`;
        // console.log(output);
        // return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${goalNmber}.png`;
        return output;
      } else if (this.activeGoalType === "samoaPriorities") {
        /* let output = `https://sids-dashboard.github.io/SIDSDataPlatform/icons/samoaIcons/100w/Asset%20${
          index + 1
        }samoaIcons.png`; */
        let output = `https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/samoaIcons/100w/Asset_${
          index + 1
        }samoaIcons.png`;
        /*         let output = `../assets/gis/icons/samoaIcons/100w/Asset_${
          index + 1
        }samoaIcons.png`; */
        /* return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/samoaIcons/100w/Asset%20${
          index + 1
        }samoaIcons.png`; */
        /* return `../assets/gis/icons/samoaIcons/100w/Asset%20${
          index + 1
        }samoaIcons.png`; */
        return output;
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
      this.$refs.slider.scrollOffset = 66 * (goalNumber - 1);
    },
    getGoalsTooltipNudgeTop(index) {
      if (index < 6) {
        return 6;
      } else if (index < 12) {
        return 66;
      }
      return 112;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*Brandon additions*/
.data-controller {
  display: flex;
  flex-direction: column;
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

@media (orientation: portrait) and (max-width: 750px) {
  .data-controller {
    display: none;
  }
}
/* landscape displays below 800px */ /* reduced size data controller for shorter phone landscape modes */
@media (orientation: landscape) {
  .data-controller {
    /* display: none; */
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
  }
}
@media (orientation: landscape) and (max-width: 750px) {
  .data-controller {
    /* display: none; */
    max-width: 50vw;
    /* max-height: 100vh; */
    overflow-y: auto;
    overflow-x: hidden;
    /* overscroll-behavior: contain; */
  }

  /* to stop accidental moving out of the map area when scrolling on UI elements of the gis map section for thin devices in landscape */
  /*   .data-controller,
  .toolbar,
  .menu-box {
    overscroll-behavior: contain;
  } */
}
/*End of Brandon additions*/
.histogram_placeholder {
  height: 200px;
}
.goals-slider {
  padding: 8px 0;
  width: 116px;
  margin: auto;
}
.goals-slider .v-slide-group__next,
.goals-slider .v-slide-group__prev {
  min-width: 25px;
}
.goals-tooltip-content {
  display: flex;
  max-width: 400px;
  flex-wrap: wrap;
}
.tooltip-image {
  transition: 200ms;
  cursor: pointer;
}
.map-input {
  padding: 0 1em !important;
}
.indicator-tooltip {
  background: none !important;
  padding: 0 !important;
}
.tooltip-card_img {
  margin: auto;
}
.pillars_icon {
  margin-right: 5px !important;
}
.pillar {
  padding: 0 8px;
}
.pillar-tooltip_img {
  margin-right: 10px;
}
.tooltip-image:hover {
  transform: scale(120%);
}
.sdg-menu {
  padding: 10px;
  box-shadow: none !important;
  overflow: visible !important;
}
.coal-title {
  word-break: keep-all !important;
  word-wrap: normal;
  /* white-space: nowrap */
}
.spacing-row {
  height: 55px;
}
.background-none {
  background: none !important;
}
.background-transparent {
  background-color: rgba(221, 221, 221, 0.7) !important;
}
.block-info {
  height: 200px;
  overflow-y: scroll;

}
</style>
