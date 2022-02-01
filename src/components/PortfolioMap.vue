<template>
  <div class="map d-flex" :class="regionClass" :style="backgroundData">
    <h2 class="page-header prtfolio-header mt-md-5 mb-2">UNDP Portfolio in Small Island Developing States</h2>
    <v-row class="justify-md-end justify-center" >
      <v-card
        class="ma-2 portfolio-chip"
      >
        <v-card-title class="custom-chip_header">{{projectsNumber}}</v-card-title>
        <v-card-text class="custom-chip_text">SIDS with UNDP Projects</v-card-text>
      </v-card>
      <v-card
        class="ma-2 portfolio-chip"
      >
        <v-card-title class="custom-chip_header">{{memberStates}}</v-card-title>
        <v-card-text class="custom-chip_text">UN Member States</v-card-text>
      </v-card>
      <v-card
        class="ma-2 portfolio-chip"
      >
        <v-card-title class="custom-chip_header">{{UNDPprojectsNumber}}</v-card-title>
        <v-card-text class="custom-chip_text">UNDP Projects</v-card-text>
      </v-card>
      <v-card
        class="ma-2 portfolio-chip"
      >
        <v-card-title class="custom-chip_header">{{projectsFundning}}</v-card-title>
        <v-card-text class="custom-chip_text">Total Project Funding</v-card-text>
      </v-card>
    </v-row>
    <v-row class="map_zones d-none d-md-flex">
      <v-col cols="10">
        <v-row class="map_zones">
          <v-col cols="4" @click="regionChange(1)">
          </v-col>
          <v-col cols="5" @click="regionChange(2)">
          </v-col>
          <v-col cols="3" @click="regionChange(3)">
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" @click="regionChange(4)"></v-col>
    </v-row>
  </div>
</template>

<script>
import format from '@/mixins/format.mixin'

export default {
  name: 'PortfolioMap',
  mixins:[format],
  props:{
    projects:{
      default:()=>([]),
      type: Array
    },
    region: {
      default:'All',
      type:String
    }
  },
  data() {
    return {
      regionClass:'',
      backgroundData: {
        'background-image': 'url(/SIDSDataPlatform/static/media/portfolio-maps/All.png)'
      },
      mapClicks: {
        'All': {
          1: 'Caribbean',
          2: 'AIS',
          3: 'Pacific',
          4: 'Pacific',
        },
        'Caribbean': {
          1: 'All',
          2: 'All',
          3: 'AIS',
          4: 'AIS',
        },
        'AIS': {
          1: 'Caribbean',
          2: 'All',
          3: 'All',
          4: 'Pacific',
        },
        'Pacific': {
          1: 'AIS',
          2: 'All',
          3: 'All',
          4: 'All',
        }
      }
    }
  },
  computed:{
    projectsNumber() {
      switch (this.regions) {
        case 'caribbean':
          return 25;
        case 'ais':
          return 9;
        case 'pacific':
          return 16;
        default:
          return 50;
      }
    },
    memberStates() {
      switch (this.regions) {
        case 'caribbean':
          return 16
        case 'ais':
          return 9
        case 'pacific':
          return 13
        default:
          return 38
      }
    },
    UNDPprojectsNumber() {
      let distinctProjects = [];
      this.projects.map(project => {
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
          }
      })
      return distinctProjects.length
    },
    projectsFundning() {
      let funding = 0;
      this.projects.map(project => {
        funding = funding + parseInt(project.budget);
      })
      return this.nFormatter(funding)
    }
  },
  methods: {
    regionChange(clickIndex) {
      this.$emit('updateRegion', this.mapClicks[this.region][clickIndex])
      this.updateBackground(clickIndex)
      this.$router.push({query: Object.assign({}, this.$route.query, {region : this.mapClicks[this.region][clickIndex]})})
    },
    updateBackground(clickIndex) {
      let region = this.mapClicks[this.region][clickIndex];
      this.updateMapImage(region);
    },
    updateMapImage(region) {
      let regionToSet = region,
      rootThis = this;
      if(region === 'All') {
        regionToSet = 'All';
      }
      let img = '/SIDSDataPlatform/static/media/portfolio-maps/' + regionToSet + '.png'
      var img_tag = new Image();
      // when preload is complete, apply the image to the div
      img_tag.onload = function () {
          rootThis.backgroundData = {
            'background-image': `url(${img})`
          }
          rootThis.regionClass = `map-${rootThis.region}`
      }
      // setting 'src' actually starts the preload
      img_tag.src = img;
    }
  },
  watch: {
    region() {
      this.updateMapImage(this.region);
    }
  },
  mounted() {
    this.updateMapImage(this.region);
  }
}
</script>

<style scoped>
.map {
  cursor: pointer;
  flex-direction: column;
  height: calc(100vh - 237px);
  max-height: 640px;
  background-size:100%;
  width: 100%;
  background-position: 50% -3vh;
  transition: 700ms;
  margin-bottom: 8px;
}
.map-AIS {
  background-size:115%;
  background-position-x: 50%;
  background-position-y: -8vh;
}
.map-Caribbean {
  background-size:134%;
  background-position-x: -35%;
  background-position-y: -8vh;
}
.map-Pacific {
  background-size:120%;
  background-position-x: 210%;
  background-position-y: -12vh;
}
.map_zones {
  height: 100%
}
.prtfolio-header {
  text-align: center;
}
.custom-chip_header {
  justify-content: center;
  padding: 0.1em;
  font-weight: 700;
}
.custom-chip_text {
  justify-content: center;
  padding: 0.4em;
  max-width: 120px;
  text-align: center;
  font-size: 12px;
  line-height: 1;
  font-weight: 900;
  margin: auto;
}
.map_info {
  flex-grow: 0;
}


@media all and (min-width:961px) {
  .map {
    min-height: 350px;
    max-height: calc(100vh - 460px);
    background-position: 50% 3vh;
  }
  .map-AIS {
    background-size:115%;
    background-position-x: 50%;
    background-position-y: -1vh;
  }
  .map-Caribbean {
    background-size:134%;
    background-position-x: -35%;
    background-position-y: 2vh;
  }
  .map-Pacific {
    background-size:120%;
    background-position-x: 210%;
    background-position-y: -5vh;
  }
}

@media all and (min-width:1264px) {
  .map {
    min-height: 550px;
    max-height: calc(100vh - 200px);
  }
}
@media all and (min-width:1400px) {
  .map {
    max-height: calc(100vh - 260px);
  }
}

@media all and (max-width:960px) {
  .map {
    background-image:none !important;
    height: auto;
    max-height: 720px;
  }
}
@media all and (max-width:600px) {
  .prtfolio-header {
    padding: 0 40px 0 40px;
  }
  .portfolio-chip {
    min-width: 30%;
    margin: 5px 5% !important
  }
}
</style>
