<template>
  <div class="indicators-nav">
    <v-btn
        class="close-button d-block dense d-md-none"
        icon
        @click="$emit('close')"
        color="primary"
      >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card flat>
      <v-text-field v-if="!dataset"
        class="search-input ml-2 mr-2"
        dense
        v-model="searchString"
        @focus="showFullList"
        @blur="hideFullList"
        hide-details
        @click:append="clearFullSearch"
        :append-icon="searchString!=='' ? 'mdi-close' : ''"
        prepend-icon="mdi-magnify"
      ></v-text-field>

    <v-virtual-scroll
      v-if="activeSearch"
      :items="allIndicators"
      height="calc(100vh - 70px)"
      itemHeight="69"
    >
      <template v-slot:default="{ item }">
        <v-tooltip
          right
          open-delay="300"
          max-width="250"
          transition="none"
          :key="item.Indicator"
          content-class="indicator-tooltip"
         >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              class="inicator-item"
              v-bind="attrs"
              v-on="on"
              @click="emitIndicatorChange(item['Indicator Code'])"
            >
              <v-list-item-title class="inicator-item_header mt-2">
                {{item.Indicator}}
              </v-list-item-title>
              <v-list-item-content class="inicator-item_description">

                  {{item}}
                {{item.Definition}}
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-card class="tooltip-card">
            <v-card-title class="mb-1 active-indicator_header">{{item.Indicator}}</v-card-title>
            <v-card-text>
              <div class="mb-1">{{item.Dimension}}</div>
              {{item.Definition}}
              <v-divider class="mb-1 mt-1"></v-divider>
              <b>Source:</b>{{item.Source}} <br/>
              <a :href="item.Link" target="_blank">Link</a>
            </v-card-text>
          </v-card>
        </v-tooltip>
      </template>
    </v-virtual-scroll>
    <v-list v-if="!activeSearch" dense :class="{'list-datasets-active':dataset}" class="list-datasets list-scrollabe">
      <v-list-item-group>
        <template v-for="(item, i) in datasets" >

          <v-tooltip
            right
            open-delay="300"
            transition="none"
            max-width="250"
            :key="i"
            content-class="indicator-tooltip"
           >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                v-show="!dataset || dataset === item"
                class="list-scrollabe_item dataset-item"
                :class="{'dataset-item-active':dataset === item}"
                :key="item"
                v-bind="attrs"
                v-on="on"
                @click="toggleDataset(item)"
              >
                <v-list-item-icon class="dataset-item-icon" v-show="dataset === item">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-img
                    contain
                    :max-height="dataset === item ? 40 :50 "
                    :src="`/SIDSDataPlatform/static/media/datasets/${item}.png`"
                  ></v-img>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-card class="tooltip-card pt-2">
              <v-img
                contain
                max-height="50"
                :src="`/SIDSDataPlatform/static/media/datasets/${item}.png`"
              ></v-img>
              <v-card-title class="mb-1 active-indicator_header">{{datasetMeta[item.name] ? datasetMeta[item.name]['Dataset Name'] : ''}}</v-card-title>
              <v-card-text>
                <div class="mb-1">
                  {{datasetMeta[item.name] ? datasetMeta[item.name]['# of Indicators'] : ''}} indicators
                  {{datasetMeta[item.name] ? datasetMeta[item.name]['SIDS Coverage'] : ''}} SIDS

                </div>
                <b>Organization:</b>{{datasetMeta[item.name] ? datasetMeta[item.name]['Organization'] : ''}}
              </v-card-text>
            </v-card>
          </v-tooltip>
        </template>
      </v-list-item-group>
    </v-list>
    <v-select
      v-if="dataset && indicatorCategories"
      class="ml-2 mr-2"
      dense
      v-model="activeCategory"
      hide-details
      @change="changeCategory"
      :items="indicatorCategories"
    ></v-select>
    <v-select
      v-if="dataset && indicatorSubCategories"
      class="ml-2 mr-2"
      dense
      hide-details
      v-model="activeSubCategory"
      :items="indicatorSubCategories"
    ></v-select>
    <v-text-field v-if="dataset"
        class="search-input ml-2 mr-2 mb-2"
        v-model="deepSearch"
        hide-details
        dense
        :append-icon="searchString!=='' ? 'mdi-close' : ''"
        prepend-icon="mdi-magnify"
        @click:append="clearDeepSearch"
    ></v-text-field>
    <v-list v-if="dataset" dense :class="{'list-short' : activeIndicator}" class="list-indicators list-scrollabe">
      <v-list-item-group
        :value="activeIndicatorCode"
      >
        <template v-for="(indicator, i) in activeIndicatorsWithMeta">
          <v-tooltip
            right
            open-delay="300"
            transition="none"
            max-width="250"
            :key="indicator['Indicator Code']"
            content-class="indicator-tooltip"
           >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                class="inicator-item"
                :class="{'blue lighten-5': indicator['Indicator Code'] === activeIndicatorCode}"
                v-bind="attrs"
                v-on="on"
                @click="emitIndicatorChange(indicator['Indicator Code'])"
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
    <v-card flat class="mt-2" v-if="activeIndicator">
      <v-card-title class="mb-1 active-indicator_header">{{activeIndicator.Indicator}}</v-card-title>
      <v-card-text class="active-indicator-info">
        <div class="mb-1 d-flex">
          <div class="active-dimension"> {{activeIndicatorDimension}} </div>
          <v-select class='dimensions-select' v-if="activeIndicatorDimensions.length > 1"
            :items="activeIndicatorDimensions"
            :value="activeIndicatorCode"
            item-text="dimension"
            item-value="code"
            @change="emitIndicatorChange"
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
import { datasetMeta } from '@/assets/datasets/datasetMeta';


export default {
  name: 'IndicatorsNav',
  props:['activeIndicatorCode'],
  data() {
    return {
      activeSearch: false,
      searchString: '',
      dataset: null,
      deepSearch:'',
      activeIndicatorDimension:null,
      activeCategory: 'All categories',
      activeSubCategory: 'All subcategories',
      activeIndicator:null,
      datasetMeta: datasetMeta,
      datasets: [
        'key',
        'hdr',
        'wdi',
        'ihme',
        'ohi',
        'mvi',
        'ndgain',
        'epi',
        'ssi',
        'unctad',
        'unicef',
        'undesa',
        'irena',
        'igrac',
        'itu',
        'gggr',
        'ghi',
        'blasiak'
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
        categories = categories.filter((categoriy) => { return categoriy !== 'None' });
        categories.push('All categories')
        return categories
      }
      return null
    },
    indicatorSubCategories() {
      if(this.activeCategory !== 'All categories') {
        let categories = Object.keys(this.activeDataset[this.activeCategory]);
        categories = categories.filter((categoriy) => { return categoriy !== 'none' && categoriy !== 'None' });
        categories.push('All subcategories')
        return categories
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
          return indicator.Dataset !== 'key' && indicator.Indicator.toLowerCase().includes(this.searchString.toLowerCase());
        })
      }
      return indicatorsArray;
    },
    activeIndicators() {
      let indicatorsArray = [];
      if(this.activeCategory && this.activeCategory !== 'All categories') {
        if(this.activeSubCategory && this.activeSubCategory !== 'All subcategories') {
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
        codesArray.map(code =>  {
          let metaData = this.indicatorsMeta[code];
          metaData.codesArray = codesArray;
        })
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
          return indicator.Indicator.toLowerCase().includes(this.deepSearch.toLowerCase());
        })
      }
      return indicatorsWithMetaArray;
    },
    activeIndicatorDimensions() {
      return this.activeIndicator.codesArray.map(code => {
        return {
          code,
          dimension: this.indicatorsMeta[code].Dimension
        }
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
    selectDataset(name) {
      this.activeCategory = 'All categories';
      this.activeSubCategory = 'All subcategories';
      this.dataset = name;
    },
    getSubcategoryIndicators(category, subCategory) {
      let indicatorsList = [];
      for(let indicator in this.activeDataset[category][subCategory]) {
        indicatorsList.push(this.activeDataset[category][subCategory][indicator]);
      }
      return indicatorsList
    },
    changeCategory() {
      this.activeSubCategory = 'All subcategories'
    },
    emitIndicatorChange(indicator) {
      this.$emit('indicatorChange', indicator)
    },
    setActiveIndicator(indicator) {
      this.activeIndicator = indicator;
      this.activeIndicatorDimension = indicator.Dimension;
    },
    showFullList() {
      this.activeSearch = true;
    },
    hideFullList() {
      if(this.searchString === '') {
        setTimeout(() => {
          this.activeSearch = false;
        }, 200);
      }
    },
    setActiveIndicatorFromFullList(indicator) {
      this.searchString = '';
      this.activeSearch = false;
      this.selectDataset(indicator.Dataset);
      this.setActiveIndicator(indicator);
    },
    clearFullSearch() {
      this.searchString = '';
      this.activeSearch = false;
    },
    clearDeepSearch() {
      this.deepSearch = '';
    }
  },
  watch:{
    activeIndicatorCode() {
      let activeIndicator = this.allIndicators.find(indicator => indicator['Indicator Code'] === this.activeIndicatorCode)
      if(activeIndicator) {
        this.setActiveIndicatorFromFullList(activeIndicator)
      }
    }
  },
  mounted() {
    let activeIndicator = this.allIndicators.find(indicator => indicator['Indicator Code'] === this.activeIndicatorCode)
    if(activeIndicator) {
      this.setActiveIndicatorFromFullList(activeIndicator)
    }
  }
}
</script>

<style>
.list-scrollabe {
  overflow-y: scroll;
}

.list-datasets {
  max-height: calc(100vh - 68px);
}
.list-datasets-active {
  padding: 0;
}
.list-indicators {
  max-height: calc(100vh - 200px);
}
.list-short {
  max-height: calc(50vh - 128px);
}
.list-scrollabe_item {
  height: 66px;
}
.list-scrollabe_item.dataset-item-active {
  height: 56px;
}
.inicator-item {
  display: flex;
  flex-direction: column;
}
.inicator-item_header {
  text-align: left;
  font-weight: 800 !important;
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
.active-indicator-info {
  padding-top: 8px !important;
  max-height: calc(50vh - 70px);
  overflow-y: scroll;
}
.indicators-nav {
  padding: relative;
}
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 5;
}
.theme--light.v-list-item--active.dataset-item::before {
  opacity: 0;
}
.theme--light.v-list-item--active.v-list-item:hover::before {
  opacity: 0.04;
}
.dataset-item-icon {
  margin: auto 10px auto 0px !important;
}
.search-input {
  margin: 0;
}
.search-input .v-input__prepend-outer{
  margin: auto 0px auto 0 !important;
  padding-top: 7px;
}
</style>
