<template>
  <div class="indicators-nav">
    <v-card>
      <v-text-field v-if="!dataset"
        class="ml-2 mr-2"
        v-model="searchString"
        @focus="showFullList"
        @blur="hideFullList"
        label="Search indicators"
        hide-details="auto"
        append-icon="mdi-close"
        prepend-icon="mdi-magnify"
      ></v-text-field>
      <v-list v-if="activeSearch" dense class="list-datasets list-scrollabe">
        <v-list-item-group>
          <template v-for="(indicator, i) in allIndicators">
            <v-tooltip
              right
              max-width="250"
              :key="i"
              content-class="indicator-tooltip"
             >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  class="inicator-item"
                  inactive
                  v-bind="attrs"
                  v-on="on"
                  @click="setActiveIndicator(indicator)"
                >
                  <v-list-item-title class="inicator-item_header mt-2">
                    {{indicator.Indicator}}
                  </v-list-item-title>
                  <v-list-item-content class="inicator-item_description">
                    {{indicator.Definition}}
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="dataset && i!== activeIndicatorsWithMeta.length - 1" :key="'divider' + i"></v-divider>
              </template>
              <v-card class="tooltip-card">
                <v-card-title class="mb-1 active-indicator_header">{{indicator.Indicator}}</v-card-title>
                <v-card-text>
                  <div class="mb-1">{{indicator.Dimension}}</div>
                  {{indicator.Definition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>Source:</b>{{indicator.Source}} <br/>
                  <a :href="indicator.Link" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </v-tooltip>
          </template>
        </v-list-item-group>
      </v-list>
      <v-list v-if="!activeSearch" dense class="list-datasets list-scrollabe">
        <v-list-item-group>
          <template v-for="(item, i) in datasets">
            <v-list-item
              inactive
              class="list-scrollabe_item"
              v-if="!dataset || dataset === item.name"
              :key="i"
              @click="toggleDataset(item.name)"
            >
              <v-list-item-content>
                <v-img
                  contain
                  max-height="50"
                  :src="item.background"
                ></v-img>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="!dataset && i!== datasets.length - 1" :key="'divider' + i"></v-divider>
        </template>
        </v-list-item-group>
      </v-list>
      <v-select
        v-if="dataset && indicatorCategories"
        class="ml-2 mr-2"
        v-model="activeCategory"
        @change="changeCategory"
        :items="indicatorCategories"
        label="Categories"
      ></v-select>

      <v-select
        v-if="dataset && indicatorSubCategories"
        class="ml-2 mr-2"
        v-model="activeSubCategory"
        :items="indicatorSubCategories"
        label="Subcategories"
      ></v-select>
      <v-text-field v-if="dataset"
          class="ml-2 mr-2"
          v-model="deepSearch"
          label="Search indicators"
          hide-details="auto"
          append-icon="mdi-close"
      ></v-text-field>
      <v-list v-if="dataset" dense class="list-indicates list-scrollabe">
        <v-list-item-group>
          <template v-for="(indicator, i) in activeIndicatorsWithMeta">
            <v-tooltip
              right
              max-width="250"
              :key="i"
              content-class="indicator-tooltip"
             >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  class="inicator-item"
                  inactive
                  v-bind="attrs"
                  v-on="on"
                  @click="setActiveIndicator(indicator)"
                >
                  <v-list-item-title class="inicator-item_header mt-2">
                    {{indicator.Indicator}}
                  </v-list-item-title>
                  <v-list-item-content class="inicator-item_description">
                    {{indicator.Definition}}
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="dataset && i!== activeIndicatorsWithMeta.length" :key="'divider' + i"></v-divider>
              </template>
              <v-card class="tooltip-card">
                <v-card-title class="mb-1 active-indicator_header">{{indicator.Indicator}}</v-card-title>
                <v-card-text>
                  <div class="mb-1">{{indicator.Dimension}}</div>
                  {{indicator.Definition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>Source:</b>{{indicator.Source}} <br/>
                  <a :href="indicator.Link" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </v-tooltip>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <v-card class="mt-2" v-if="activeIndicator">
      <v-card-title class="mb-1 active-indicator_header">{{activeIndicator.Indicator}}</v-card-title>
      <v-card-text>
        <div class="mb-1 d-flex">
          <div class="active-dimension"> {{activeIndicatorDimension}} </div>
          <v-select class='dimensions-select' v-if="activeIndicatorDimensions.length > 1"
            :items="activeIndicatorDimensions"
            v-model="activeIndicatorDimension"
            label="Dimension"
            dense
          ></v-select>
        </div>
        {{activeIndicator.Definition}}
        <v-divider class="mb-1 mt-1"></v-divider>
        <b>Source:</b>{{activeIndicator.Source}} <br/>
        <a :href="activeIndicator.Link" target="_blank">Link</a>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'IndicatorsNav',
  data() {
    return {
      activeSearch: false,
      searchString: '',
      dataset: null,
      deepSearch:'',
      activeIndicatorDimension:null,
      activeCategory: 'All categories',
      activeSubCategory: 'All categories',
      activeIndicator:null,
      datasets: [
        {
          name: 'key',
          background: require('@/assets/datasets/keyIcon.png')
        },
        {
          name: 'mvi',
          background: require('@/assets/datasets/mviIcon.png')
        },
        {
          name: 'ssi',
          background: require('@/assets/datasets/ssiIcon.png')
        },
        {
          name: 'igrac',
          background: require('@/assets/datasets/igracIcon.png')
        },
        {
          name: 'wdi',
          background: require('@/assets/datasets/wdiIcon.png')
        },
        {
          name: 'who',
          background: require('@/assets/datasets/whoIcon.png')
        },
        {
          name: 'irena',
          background: require('@/assets/datasets/irenaIcon.png')
        },
        {
          name: 'undesa',
          background: require('@/assets/datasets/undesaIcon.png')
        },
        {
          name: 'fao',
          background: require('@/assets/datasets/faoIcon.png')
        },
        {
          name: 'unctad',
          background: require('@/assets/datasets/unctadIcon.png')
        },
        {
          name: 'rfti',
          background: require('@/assets/datasets/rftiIcon.png')
        },
        {
          name: 'epi',
          background: require('@/assets/datasets/epiIcon.png')
        },
        {
          name: 'ohi',
          background: require('@/assets/datasets/ohiIcon.png')
        },
        {
          ndgain: 'ndgain',
          background: require('@/assets/datasets/ndgainIcon.png')
        },
        {
          name: 'hdr',
          background: require('@/assets/datasets/hdrIcon.png')
        },
        {
          name: 'sdg',
          background: require('@/assets/datasets/sdgIcon.png')
        },
        {
          name: 'blasiak',
          background: require('@/assets/datasets/blasiakIcon.png')
        },
        {
          name: 'gggr',
          background: require('@/assets/datasets/gggrIcon.png')
        },
        {
          name: 'ghi',
          background: require('@/assets/datasets/ghiIcon.png')
        },
        {
          name: 'ihme',
          background: require('@/assets/datasets/ihmeIcon.png')
        },
        {
          name: 'itu',
          background: require('@/assets/datasets/ituIcon.png')
        },
        {
          name: 'unicef',
          background: require('@/assets/datasets/unicefIcon.png')
        }
      ]
    }
  },
  computed: {
    ...mapState({
      indicatorsCategories: state => state.indicators.indicatorsCategories,
      indicatorsMeta: state => state.indicators.indicatorsMeta
    }),
    activeDataset() {
      if(this.dataset) {
        return this.indicatorsCategories[this.dataset];
      }
      return null
    },
    indicatorCategories() {
      if(this.activeDataset) {
        let categories = Object.keys(this.activeDataset);
        if (categories.length>1) {
          categories = categories.filter((categoriy) => { return categoriy !== 'None' });
          categories.push('All categories')
          return categories
        }
      }
      return null
    },
    indicatorSubCategories() {
      if(this.activeCategory !== 'All categories') {
        let categories = Object.keys(this.activeDataset[this.activeCategory]);
        if (categories.length>1) {
          categories = categories.filter((categoriy) => { return categoriy !== 'none' && categoriy !== 'None' });
          categories.push('All subcategories')
          return categories
        }
      }
      return null
    },
    allIndicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        indicatorsArray.push(this.indicatorsMeta[indicator])
      }
      indicatorsArray.sort(function(a, b) {
          var textA = a.Indicator.toUpperCase();
          var textB = b.Indicator.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      if(this.searchString !=='') {
        return indicatorsArray.filter(indicator => {
          return indicator.Indicator.includes(this.searchString);
        })
      }
      return indicatorsArray;
    },
    activeIndicators() {
      let indicatorsArray = [];
      if(this.activeCategory && this.activeCategory !== 'All categories') {
        if(this.activeSubCategory && this.activeSubCategory !== 'All categories') {
          return this.getSubcategoryIndicators(this.activeCategory, this.activeSubCategory)
        }
        for(let subCategory in this.activeDataset[this.activeCategory]) {
          indicatorsArray = indicatorsArray.concat(this.getSubcategoryIndicators(this.activeCategory, subCategory))
        }
      } else {
        for(let category in this.activeDataset) {
          for(let subCategory in this.activeDataset[category]) {
            indicatorsArray = indicatorsArray.concat(this.getSubcategoryIndicators(category, subCategory))
          }
        }
      }
      return indicatorsArray
    },
    activeIndicatorsWithMeta() {
      let indicatorsWithMetaArray = this.activeIndicators.map(codesArray => {
        let metaData = this.indicatorsMeta[codesArray[0]];
        metaData.codesArray = codesArray;
        return metaData;
      })
      indicatorsWithMetaArray.sort(function(a, b) {
          var textA = a.Indicator.toUpperCase();
          var textB = b.Indicator.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      if(this.deepSearch !== '') {
        return indicatorsWithMetaArray.filter(indicator => {
          return indicator.Indicator.includes(this.deepSearch);
        })
      }
      return indicatorsWithMetaArray;
    },
    activeIndicatorDimensions() {
      return this.activeIndicator.codesArray.map(code => {
        return this.indicatorsMeta[code].Dimension
      })
    }
  },
  methods: {
    toggleDataset(name) {
      this.activeCategory = 'All categories';
      this.activeSubCategory = 'All subcategories';
      this.activeIndicator = null;
      if(this.dataset === name) {
        this.dataset = null;
      } else {
        this.dataset = name;
      }
    },
    getSubcategoryIndicators(category, subCategory) {
      let indicatorsList = [];
      for(let indicator in this.activeDataset[category][subCategory]) {
        indicatorsList.push(this.activeDataset[category][subCategory][indicator]);
      }
      return indicatorsList;
    },
    changeCategory() {
      this.activeSubCategory = ''
    },
    setActiveIndicator(indicator) {
      this.activeIndicator = indicator;
      this.activeIndicatorDimension = indicator.Dimension
    },
    showFullList() {
      this.activeSearch = true;
    },
    hideFullList() {
      if(this.searchString === '') {
        this.activeSearch = false;
      }
    }
  }
}
</script>

<style scoped>
.list-scrollabe {
  max-height: calc(100vh - 110px);
  overflow-y: scroll;
}
.list-scrollabe_item {
  height: 66px;
}
.inicator-item {
  display: flex;
  flex-direction: column;
}
.inicator-item_header {
  text-align: left;
  width: 100%;
}
.inicator-item_description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  font-size: 12px;
}
.inicator-item::after {
  min-height: 0;
}
.active-indicator_header {
  padding-bottom: 0.5em;
  word-break: break-word;
}
.indicator-tooltip {
  background: none;
  padding: 0;
}
.active-dimension{
  margin-right: auto;
}
.dimensions-select{
  max-width: 60%;
  margin-right: 0;
}
</style>
