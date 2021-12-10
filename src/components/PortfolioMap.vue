<template>
  <div class="map d-flex" :class="regionClass" :style="backgroundData">
    <h2 class="prtfolio-header mt-10 mb-2">UNDP Portfolio in Small Island Developing States</h2>
    <v-row justify="center">
      <v-chip
        class="ma-2"
        color="primary"
      >
        {{projectsNumber}} SIDS with UNDP Projects
      </v-chip>
      <v-chip
        class="ma-2"
        color="primary"
      >
        {{memberStates}} UN Member States
      </v-chip>
      <v-chip
        class="ma-2"
        color="primary"
      >
        {{UNDPprojectsNumber}} UNDP Projects
      </v-chip>
      <v-chip
        class="ma-2"
        color="primary"
      >
        {{projectsFundning}} Total Project Funding
      </v-chip>
    </v-row>


    <v-row class="map_zones">
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
        'background-image': 'url(https://sids-dashboard.github.io/SIDSDataPlatform/graphics/sidsMapNewest-01.png)'
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
      let distinctProjects = [];
      this.projects.map(project => {
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
            funding = funding + parseInt(project.budget);
          }
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
      let rootThis = this;
      let region = this.mapClicks[this.region][clickIndex]
      if(region === 'All') {
        region = '';
      }
      let img = 'https://sids-dashboard.github.io/SIDSDataPlatform/graphics/sidsMapNewest' + region + '-01.png'
      var img_tag = new Image();
      // when preload is complete, apply the image to the div
      img_tag.onload = function () {
          rootThis.backgroundData = {
            'background-image': `url(${img})`
          }
          rootThis.regionClass = `map-${region}`
      }
      // setting 'src' actually starts the preload
      img_tag.src = img;
    }
  }
}
</script>

<style scoped>
.map {
  cursor: pointer;
  flex-direction: column;
  min-height: 80vh;
  background-size: 95%;
  width: 100%;
  background-position: 50% -10px;
  transition: 700ms;
}
.map-AIS {
  background-size: 125%;
  background-position-x: 50%;
  background-position-y: -100px;
}
.map-Caribbean {
  background-size: 144%;
  background-position-x: -35%;
  background-position-y: -60px;
}
.map-Pacific {
  background-size: 130%;
  background-position-x: 210%;
  background-position-y: -140px;
}
.map_zones {
  height: 100%
}
.prtfolio-header {
  text-align: center;
}
</style>
