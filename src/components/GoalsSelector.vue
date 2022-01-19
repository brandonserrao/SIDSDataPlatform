<template>
  <v-row class="goals-selector">
    <v-col cols="5">
      <v-list dense>
        <v-list-item-group
          :value="activeGoalType"
          @change="emitTypeChange"
          mandatory
        >
          <!-- <v-tooltip
            top
            v-for="(item, i) in goalTypes"
            :key="i"
            eager
            max-width="400"
            nudge-right="106"
            :nudge-top="20 + (40*i)"
            content-class="indicator-tooltip"
            allow-overflow
          >
           <template v-slot:activator="{ on, attrs }"> -->

          <v-list-item
            v-for="(item, i) in goalTypes"
            :value="item.value"
            :key="i"
            @change="resetGoalModel"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- </template> -->
          <!-- <v-card class="tooltip-card">
            <v-card-title>
              <v-img
                class="tooltip-card_img"
                max-width="160"
                :src="item.headerImg"
              ></v-img>
            </v-card-title>
            <v-card-text>
              {{item.description}}
            </v-card-text>
          </v-card> -->
          <!-- </v-tooltip> -->
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="7">
      <v-slide-group
        class="goals-slider"
        :class="{ 'goals-slider-ss': activeGoalType === 'signature-solutions' }"
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
            :nudge-left="255"
            :nudge-bottom="80"
            content-class="goals-selector-sdg-menu"
          >
            <template v-slot:activator="{ on }">
              <img
                v-on="on"
                :src="getGoalImage(index)"
                width="120"
              />
            </template>
            <div class="goals-selector-tooltip-content">
              <!-- <v-tooltip
                right
                  v-for="(n, index) in activeGoalTypes"
                  :key="n"
                eager
                :nudge-right="(5 - index%6) * 56 || 6"
                :nudge-top="getGoalsTooltipNudgeTop(index)"
                max-width="380"
                content-class="indicator-tooltip"
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }"> -->
              <img
                v-for="(n, index) in activeGoalTypes"
                :key="n"
                @click="selectGoal(index + 1)"
                :src="getGoalImage(index)"
                class="goals-selector-tooltip-image"
                :width="activeGoalType === 'signature-solutions' ? 240 : 80"

              />
              <!-- </template>
                <v-card>
                  <v-card-title class="coal-title">
                    {{goalDescriptions[n].title}}
                  </v-card-title>
                  <v-card-text>
                    {{goalDescriptions[n].content}}
                  </v-card-text>
                </v-card>
              </v-tooltip> -->
            </div>
          </v-menu>
        </v-slide-item>
      </v-slide-group>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GoualsSelector",
  data() {
    return {
      goalTypes: [
        {
          name: "SAMOA Pathway",
          value: "samoa",
          // headerImg:'https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/samoaPathway.png',
          // description: 'The Global Goals designed to guide development for a better and more sustainable future for all, set up by the UNGA in 2015 and are intended to be achieved in 2030, as per Agenda 2030.'
        },
        {
          name: "SDGs",
          value: "sdgs",
          // headerImg:'https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/SDGs.png',
          // description: 'The SAMOA Pathway (SIDS Accelerated Modalities of Action) reaffirms that SIDS remain a special case for sustainable development, recognizing SIDS\'s ownership and leadership in overcoming these challenges.'
        },
        {
          name: "Signature solutions",
          value: "signature-solutions",
          // headerImg:'https://sids-dashboard.github.io/SIDSDataPlatform/gisPanel/assets/img/icons/sidsOfferPillars.png',
          // description: 'UNDP’s SIDS offer – Rising Up for SIDS – presents an integrated approach for tapping into areas with potential to accelerate green recovery and transform societies based on three interconnected pillars and responds to the ambitions and demands SIDS expressed during the 2019 midterm review of the S.A.M.O.A. Pathway.'
        },
      ],
      activeGoal: 1,
      "signature-solutions": [
        "Poverty",
        "Governance",
        "Resilience",
        "Environment",
        "Energy",
        "Gender",
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
      samoa: [
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
        Poverty: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
        Governance: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
        Resilience: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
        Environment: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
        Energy: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
        Gender: {
          title: "16. Means of implementation, including partnerships",
          content:
            "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
        },
      },
    };
  },
  props: {
    activeGoalType: {
      type: String,
      default: "sdgs",
    },
  },
  computed: {
    activeGoalTypes() {
      return this[this.activeGoalType];
    },
    activeGoalIndex() {
      return ["samoa", "sdgs", "signature-solutions"][this.activeGoalName];
    },
  },
  methods: {
    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        let goalNmber = (index + 1).toString();
        if (goalNmber.length < 2) {
          goalNmber = "0" + goalNmber;
        }
        // return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${goalNmber}.png`;
        return `https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/SDG_Icons_2019_WEB/E-WEB-Goal-${goalNmber}.png`;
      } else if (this.activeGoalType === "samoa") {
        // return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/samoaIcons/100w/Asset%20${
        //   index + 1
        // }samoaIcons.png`;
        return `https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/samoaIcons/100w/Asset_${
          index + 1
        }samoaIcons.png`;
      } else if (this.activeGoalType === "signature-solutions") {
        // return `https://sids-dashboard.github.io/SIDSDataPlatform/icons/SSicons/1x/${this[
        //   "signature-solutions"
        // ][index].toLowerCase()}SS.png`;
        return `https://brandonserrao.github.io/SIDSDataPlatform/assets/gis/icons/SSicons/1x/${this[
          "signature-solutions"
        ][index].toLowerCase()}SS.png`;
      }
    },
    goalUpdateNext() {
      this.activeGoal = this.activeGoal + 1;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
    },
    goalUpdatePrev() {
      this.activeGoal = this.activeGoal - 1;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
    },
    selectGoal(goalNumber) {
      this.activeGoal = goalNumber;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
      // this.$refs.slider && this.$refs.slider.items[goalNumber-1].toggle();
      this.$refs.slider.scrollOffset = 120 * (goalNumber - 1);

    },
    emitTypeChange(type) {
      this.$store.commit("goals/setActiveGoal", 1);
      this.$emit("changeType", { activeGoal: this.activeGoal, type: type });
    },
    resetGoalModel() {
      this.$nextTick(() => {
        //Requred to reset slider when switching between samoa and sdgs
        this.$refs.slider && this.$refs.slider.items[0].toggle();
        this.$refs.slider && this.$refs.slider.scrollIntoView();
      });
    },
    getGoalsTooltipNudgeTop(index) {
      if (index < 6) {
        return 6;
      } else if (index < 12) {
        return 56;
      }
      return 112;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.goals-selector .goals-slider {
  padding: 8px 0;
  width: 170px;
  margin: auto;
}
.goals-selector .goals-slider .v-slide-group__next,
.goals-selector .goals-slider .v-slide-group__prev {
  min-width: 25px;
}
.goals-selector-tooltip-content {
  display: flex;
  max-width: 240px;
  flex-wrap: wrap;
  background: #fff;
}
.goals-selector-tooltip-image {
  transition: 200ms;
  cursor: pointer;
}
.goals-selector-pillars_icon {
  margin-right: 5px !important;
}
.goals-selector .pillar {
  padding: 0 8px;
}
.goals-selector-tooltip-image:hover {
  transform: scale(110%);
}
.goals-selector-sdg-menu {
  padding: 10px;
  background: #FFF;
  box-shadow: none !important;
  overflow: visible !important;
}
</style>
