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
                transition="none"
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
                  <v-card-text class="tooltip-card_text">
                    {{ item.description }}
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list
            class="background-none"
            v-if="activeGoalType === 'pillars'"
            dense
          >
            <v-list-item-group v-model="activePillar" mandatory>
              <v-tooltip
                right
                v-for="(item, i) in pillars"
                :key="i"
                eager
                open-delay="200"
                transition="none"
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
                :nudge-left="256"
                :nudge-bottom="118"
                content-class="sdg-menu"
              >
                <template v-slot:activator="{ on }">
                  <img
                    v-on="on"
                    :src="getGoalImage(index)"
                    height="120"
                    width="120"
                  />
                </template>
                <div class="goals-tooltip-content">
                  <v-tooltip
                    right
                    v-for="(n, index) in activeGoalTypes"
                    :key="n"
                    eager
                    transition="none"
                    open-delay="300"
                    :nudge-right="(4 - (index % 5)) * 80 || 6"
                    :nudge-top="Math.floor(index / 5) * 80 || 6"
                    max-width="400"
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
                        height="80"
                        width="80"
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
          <v-autocomplete
            rounded
            class="map-input"
            dense
            hide-details
            v-model="activeDatasetName"
            :items="filteredDatasets"
            item-text="name"
            item-value="name"
            label="Dataset"
            @input="onInput"
            outlined
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row
        class="spacing-row"
        v-if="activeDataset && activeDataset.type === 'layers'"
        dense
      >
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
            @input="onInput"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        class="spacing-row"
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
            @input="onInput"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row v-else class="spacing-row"> </v-row>

      <!-- DUPLICATE START for dualmode selector -->
      <!-- <v-row dense v-show="dualModeEnabled">
        <v-col>
          <v-select
            rounded
            class="map-input"
            dense
            hide-details
            v-model="comparisonDatasetName"
            :items="filteredDatasets"
            item-text="name"
            item-value="name"
            label="Dataset"
            @input="emitComparisonUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        v-show="dualModeEnabled"
        class="spacing-row"
        v-if="comparisonDataset && comparisonDataset.type === 'layers'"
        dense
      >
        <v-col>
          <v-select
            rounded
            dense
            hide-details
            class="map-input"
            v-model="comparisonLayerName"
            item-text="Description"
            item-value="Description"
            :items="comparisonDataset.layers"
            label="Layer"
            @input="emitComparisonUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        v-show="dualModeEnabled"
        class="spacing-row"
        v-else-if="comparisonDataset && comparisonDataset.type === 'temporal'"
        dense
      >
        <v-col>
          <v-slider
            class="map-input"
            v-model="comparisonLayerName"
            :tick-labels="comparisonTicksLabels"
            :max="comparisonDataset.layers.length - 1"
            step="1"
            ticks="always"
            tick-size="4"
            @input="emitComparisonUpdate"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row v-else class="spacing-row" v-show="dualModeEnabled"> </v-row> -->
      <!-- DUPLICATE END -->
    </v-card>

    <!-- INFO CARD -->
    <v-card class="mb-1 block-info background-grey">
      <!-- TESTING - TAB SYSTEM -->
      <vue-tabs-chrome
        theme="custom"
        ref="tab"
        :minHiddenWidth="120"
        v-model="tab"
        :tabs="tabs"
        @contextmenu="handleRightClick"
        @click="handleTabClick"
        @swap="handleSwap"
        @dragstart="handleDragStart"
        @dragging="handleDragging"
        @dragend="handleDragEnd"
        @remove="handleRemove"
      >
        <button
          id="chrome-tabs-slot-button"
          class="chrome-tabs-slot-button"
          @click="addTab"
          slot="after"
        >
          ➕
        </button></vue-tabs-chrome
      >
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
      <v-card-text v-else>
        This map visualizes data for the SIDS at different resolutions. Select a
        dataset above or a country to view spatial data about that region.
      </v-card-text>
      <!-- TESTING - BUTTONS TO ADD/REMOVE TABS FOR DEBUG -->
      <!-- <div class="btns">
        <button @click="addTab">New Tab</button>
        <button @click="removeTab">Remove active Tab</button>
      </div> -->
    </v-card>

    <!-- New Legend/Histogram -->
    <!-- <v-card v-if="displayLegend" class="histogram_frame"> -->
    <v-card v-show="displayLegend" class="background-grey histogram_frame">
      <div
        v-show="activeLayer"
        id="histogram_frame"
        class="pic app-body population-per-km col-flex"
      >
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
// import { gis_store } from "../gis/gis_store.js";
import datasets from "@/gis/static/layers";
import VueTabsChrome from "vue-tabs-chrome";

export default {
  name: "MapDatasetController",
  components: {
    VueTabsChrome,
  },
  props: [
    "displayLegend", //"map"
    "dualModeEnabled",
  ],
  data() {
    return {
      // TESTING - TAB SYSTEM
      // tabSystem: null, //used for v-model of tabs/tab-items
      tab: "info", //"google",
      tabs: [
        /* {
          label: "info",
          key: "info",
          // closable: false,
        }, */
        /* {
          label: "google",
          key: "google",
          favicon: require("../assets/testing/google.jpg"),
        },
        {
          label: "New Tab",
          key: "any-string-key",
        }, */
      ],
      //
      comparisonDatasetName: null,
      comparisonLayerName: null,
      //
      activeGoal: 1,
      activeDatasetName: null,
      activeLayerName: null,
      datasets,
      activeGoalType: "sdgs",
      goalTypes: [
        {
          name: "SIDS offer Pillars",
          value: "pillars",
          headerImg: require("@/assets/media/goals-icons/sidsOfferPillars.png"),
          description:
            "UNDP’s SIDS offer – Rising Up for SIDS – presents an integrated approach for tapping into areas with potential to accelerate green recovery and transform societies based on three interconnected pillars and responds to the ambitions and demands SIDS expressed during the 2019 midterm review of the S.A.M.O.A. Pathway.",
        },
        {
          name: "SDGs",
          value: "sdgs",
          headerImg: require("@/assets/media/goals-icons/SDGs.png"),
          description:
            "The Global Goals designed to guide development for a better and more sustainable future for all, set up by the UNGA in 2015 and are intended to be achieved in 2030, as per Agenda 2030.",
        },
        {
          name: "SAMOA Pathway",
          value: "samoaPriorities",
          headerImg: require("@/assets/media/goals-icons/samoaPathway.png"),
          description:
            "The SAMOA Pathway (SIDS Accelerated Modalities of Action) reaffirms that SIDS remain a special case for sustainable development, recognizing SIDS's ownership and leadership in overcoming these challenges.",
        },
      ],
      activePillar: 1,
      pillars: [
        {
          name: "Blue Economy",
          value: "blue",
          icon: require("@/assets/media/goals-icons/pillars/blueEconomy.png"),
          description:
            "Harnessing the blue economy through an integrated approach rooted in sustainable finance and development.",
        },
        {
          name: "Climate Action",
          value: "climate",
          icon: require("@/assets/media/goals-icons/pillars/climateAction.png"),
          description:
            "Promoting decarbonized and resilient societies through scaled up climate action and enhanced efforts to mobilize climate finance.",
        },
        {
          name: "Digital transformation",
          value: "digital",
          icon: require("@/assets/media/goals-icons/pillars/digitalTransformation.png"),
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
      if (!this.activeDataset || this.comparisonDataset === "info") return null;
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

    comparisonLayer() {
      console.log(this.comparisonDataset);
      if (!this.comparisonDataset || this.comparisonDataset === "info")
        return null;
      if (this.comparisonDataset.type === "temporal") {
        return this.comparisonDataset.layers[this.comparisonLayerName];
      } else if (this.comparisonDataset.type === "layers") {
        return this.comparisonDataset.layers.find(
          (layer) => layer.Description === this.comparisonLayerName
        );
      } else {
        console.log(this.comparisonDataset.layers[0]);
        return this.comparisonDataset.layers[0];
      }
    },
    comparisonTicksLabels() {
      console.log("comparisonTicksLabels()");
      return this.comparisonDataset.layers.map((layer) => layer.Temporal);
    },
    comparisonDataset() {
      console.log("comparisonDataset()");
      return this.filteredDatasets.find(
        (dataset) => dataset.name === this.comparisonDatasetName
      );
    },
  },
  methods: {
    //TESTING - TAB SYSTEM
    addTab() {
      //TODO - ADD CHECK FOR MAX TAB AMOUNT BEFORE AADDING
      let item = ""; //"tab";
      item += Date.now(); //timecode used for a unique id
      let tabLabel = this.createTabLabel();
      let newTabs = [
        {
          label: tabLabel ? tabLabel : "New Tab",
          key: item,
          data: {
            dataset: this.activeDatasetName,
            layer: this.activeLayerName,
            filters: {
              //intended to facilitate resetting the filter
              pillar: this.activePillar, //int
              goal: this.activeGoal, ///int
              goalType: this.activeGoalType, //str
            },
          },
        },
      ];
      console.log(this.$refs);
      this.$refs.tab.addTab(...newTabs);
      this.tab = item;

      //
    },
    removeTab() {
      console.log(this.$refs.tab);
      this.$refs.tab.removeTab(this.tab);
    },
    handleRightClick(e, tab, index) {
      console.log(e, tab, index);
    },
    handleSwap(tab, targetTab) {
      console.info("swap", tab, targetTab);
    },
    handleDragStart(e, tab, index) {
      console.info("dragstart", e, tab, index);
    },
    handleDragging(e, tab, index) {
      console.info("dragging", e, tab, index);
    },
    handleDragEnd(e, tab) {
      console.info("dragend", e, tab);
    },
    handleRemove(tab, index) {
      console.info("remove", tab, index);
    },
    handleTabClick(e, tab, index) {
      //intended to facilitate resetting the filter
      this.activeGoalType = tab.data.filters.goalType; //str
      this.activeGoal = tab.data.filters.goal; ///int
      this.activePillar = tab.data.filters.pillar; //int
      //should look for the corresponding dataset and layer in filtered datasets
      //and update the reactive data/computed props in this components:
      //activeDatasetName and activeLayerName are computed properties and inform activeLayer and activeDataset
      //which in turn informs the dataset selector and slider
      this.updateControllerFromTab(tab);
      console.info(e, tab, index);
      this.emitUpdate();
    },

    updateControllerFromTab(tab) {
      console.log("updateControllerFromTab", tab);
      console.log(tab.data);
      // let label = tab.label;
      this.activeDatasetName = tab.data.dataset;
      this.activeLayerName = tab.data.layer;
    },

    createTabLabel() {
      let labelString = "Placeholder Label";
      if (this.activeDataset.type === "single") {
        labelString = this.activeDataset.name;
      } else if (this.activeDataset.type === "temporal") {
        labelString = `${this.activeLayer.Temporal}:${this.activeDataset.name}`;
      } else if (this.activeDataset.type === "layers" && this.activeLayer) {
        labelString = this.activeLayer.Description;
      } else {
        console.warn(
          "Tab label couldn't be created for:",
          this.activeDataset.name,
          this.activeLayer.Field_Name
        );
        return null;
      }

      return labelString;
    },

    onInput() {
      //interaction handler for dataset and layer selectors of the dataset controller
      this.emitUpdate();
      // this.addTab(); //disabled, not desired to add tab on every selection
    },
    //
    /**
     *passes current dataset+layer selection upwards
     */
    emitUpdate() {
      // this.gis_store.testIncrement();
      // console.log(`emitUpdate of activeDataset and activeLayer`);
      let active = { dataset: this.activeDataset, layer: this.activeLayer }; //package data to pass to parents with update
      console.log("$emit update:", active);
      this.$emit("update", active);
      /* 
      //TESTING - TAB SYSTEM
      if (this.activeDataset.type === "single") {
        console.log("Tab add for single-type dataset");
        this.addTab(this.activeDataset.name, this.activeLayer?.Field_Name);
      } else if (this.activeDataset.type === "temporal") {
        console.log("Tab add for temporal-type dataset");
        this.addTab(
          `${this.activeLayer.Temporal}:${this.activeDataset.name}`,
          this.activeLayer.Field_Name
        );
      } else if (this.activeDataset.type === "layers" && this.activeLayer) {
        console.log("Tab add for multilayers-type dataset");
        this.addTab(this.activeLayer.Description, this.activeLayer.Field_Name);
      } else {
        console.warn(
          "Tab could not be added for:",
          this.activeDataset.name,
          this.activeLayer.Field_Name
        );
      } */
    },
    emitComparisonUpdate() {
      console.warn("emitComparisonUpdate");
      let active = {
        dataset: this.comparisonDataset,
        layer: this.comparisonLayer,
      }; //package data to pass to parents with update
      this.$emit("updateComparison", active);
    },

    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        return require(`@/assets/media/goals-icons/SDGs/${index + 1}.png`);
      } else {
        return require(`@/assets/media/goals-icons/SAMOA/${index + 1}.png`);
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
      this.$refs.slider.scrollOffset = 120 * (goalNumber - 1);
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
    max-height: 85vh;
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
}
/*End of Brandon additions*/

.histogram_placeholder {
  height: 200px;
}
.goals-slider {
  padding: 8px 0 0;
  width: 170px;
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
.tooltip-card_text {
  font-weight: 600;
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

/* TESTING - TAB SYSTEM */
.chrome-tabs-slot-button {
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
}

.vue-tabs-chrome.theme-custom {
  padding-top: 0;
  background-color: transparent;
  overflow: hidden;
}
.vue-tabs-chrome.theme-custom .tabs-footer,
.vue-tabs-chrome.theme-custom .tabs-divider,
.vue-tabs-chrome.theme-custom .tabs-background-before,
.vue-tabs-chrome.theme-custom .tabs-background-after {
  display: none;
}
.vue-tabs-chrome.theme-custom .tabs-item {
  cursor: pointer;
}
.vue-tabs-chrome.theme-custom .tabs-content {
  overflow: unset;
  border-bottom: 1px solid #e4e7ed;
}
.vue-tabs-chrome.theme-custom .tabs-background {
  padding: 0;
}
.vue-tabs-chrome.theme-custom .tabs-background-content {
  /* border-top: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed; */
  border-radius: 0;
  /* background-color: #fff; */
}
.vue-tabs-chrome.theme-custom .tabs-content {
  /* height: 40px; */
  height: 28px;
}
.vue-tabs-chrome.theme-custom .active {
  /* color: #409eff; */
}
.vue-tabs-chrome.theme-custom .active .tabs-background::before,
.vue-tabs-chrome.theme-custom .active .tabs-background::after {
  top: 100%;
  left: 0;
  content: "";
  width: 100%;
  height: 1px;
  /* background-color: #fff; */
  z-index: 1;
  position: absolute;
}
.vue-tabs-chrome.theme-custom .active .tabs-background::before {
  top: 0;
  height: 2px;
  background-color: #409eff;
}
.vue-tabs-chrome.theme-custom .active .tabs-background::before {
  top: 0;
  height: 2px;
  background-color: #409eff;
}
</style>
