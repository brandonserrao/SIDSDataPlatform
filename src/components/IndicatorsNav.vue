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
      :items="allindicators"
      height="calc(100vh - 70px)"
      itemHeight="69"
    >
      <template v-slot:default="{ item }">
        <v-tooltip
          right
          open-delay="300"
          max-width="250"
          transition="none"
          :key="item.indicator"
          content-class="indicator-tooltip"
         >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              class="inicator-item"
              v-bind="attrs"
              v-on="on"
              @click="emitindicatorChange(item['indicatorCode'])"
            >
              <v-list-item-title class="inicator-item_header mt-2">
                {{item.indicator}}
              </v-list-item-title>
              <v-list-item-content class="inicator-item_description">
                {{item.def}}
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-card class="tooltip-card">
            <v-card-title class="mb-1 active-indicator_header">{{item.indicator}}</v-card-title>
            <v-card-text>
              <div class="mb-1">{{item.units}}</div>
              {{item.def}}
              <v-divider class="mb-1 mt-1"></v-divider>
              <b>Source:</b>{{item.source}} <br/>
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
                    :src="require(`@/assets/media/datasets/${item}.png`)"
                  ></v-img>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-card class="tooltip-card pt-2">
              <v-img
                contain
                max-height="50"
                :src="require(`@/assets/media/datasets/${item}.png`)"
              ></v-img>
              <v-card-title class="mb-1 active-indicator_header">{{datasetMeta[item.name] ? datasetMeta[item.name]['Dataset Name'] : ''}}</v-card-title>
              <v-card-text>
                <div class="mb-1">
                  {{datasetMeta[item.name] ? datasetMeta[item.name]['# of indicators'] : ''}} indicators
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
      v-if="dataset && indicatorSubCategories && indicatorSubCategories.length > 1"
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
    <v-virtual-scroll
      v-if="dataset"
      :items="activeIndicatorsWithMeta"
      :height="inticatorsListHeight"
      itemHeight="69"
    >
    <template v-slot:default="{ item, index }">

          <v-tooltip
            right
            open-delay="300"
            transition="none"
            max-width="250"
            :key="item['indicatorCode']"
            content-class="indicator-tooltip"
           >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                class="inicator-item"
                :class="{'blue lighten-5': item['indicatorCode'] === activeIndicatorCode}"
                v-bind="attrs"
                v-on="on"
                @click="emitindicatorChange(item['indicatorCode'])"
              >
                <v-list-item-title class="inicator-item_header mt-2">
                  {{item.indicator}}
                </v-list-item-title>
                <v-list-item-content class="inicator-item_description">
                  {{item.def}}
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="dataset && index!== activeIndicatorsWithMeta.length" :key="'divider' + index"></v-divider>
            </template>
            <v-card class="tooltip-card">
              <v-card-title class="mb-1 active-indicator_header">{{item.indicator}}</v-card-title>
              <v-card-text>
                <div class="mb-1">{{item.dim}}</div>
                <v-divider class="mb-1 mt-1"></v-divider>
                <b>Source:</b>{{item.source}} <br/>
                <a :href="item.Link" target="_blank">Link</a>
              </v-card-text>
            </v-card>
          </v-tooltip>
        </template>
    </v-virtual-scroll>
  </v-card>
    <v-card flat class="mt-2" v-if="activeIndicator">
      <v-card-title class="mb-1 active-indicator_header">{{activeIndicator.indicator}}</v-card-title>
      <v-card-text class="active-indicator-info">
        <div class="mb-1 d-flex">
          <v-select class='dimensions-select' v-if="activeIndicatorYears.length > 2"
            :items="activeIndicatorYears"
            :value="year"
            item-text="name"
            item-value="id"
            @change="emitYearChange"
            label="Year"
            dense
          ></v-select>
        </div>
        <div class="mb-1 d-flex">
          <div class="active-dimension"> {{activeIndicator.units}} </div>
          <v-select class='dimensions-select' v-if="activeIndicatorDimensions.length > 1"
            :items="activeIndicatorDimensions"
            :value="activeIndicatorCode"
            item-text="dimension"
            item-value="code"
            @change="emitindicatorChange"
            label="Dimension"
            dense
          ></v-select>
        </div>
        {{activeIndicator.def}}
        <v-divider class="mb-1 mt-1"></v-divider>
        <b>Source:</b>{{activeIndicator.source}} <br/>
        <a :href="activeIndicator.Link" target="_blank">Link</a>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { datasetMeta } from '@/assets/datasets/datasetMeta';


export default {
  name: 'indicatorsNav',
  props:['activeIndicatorCode', 'year'],
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
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      data: state => state.indicators.activeIndicatorData
    }),
    activeDataset() {
      if(this.dataset) {
        return this.indicatorsCategories[this.dataset];
      }
      return null
    },
    activeIndicatorYears(){
      return Object.keys(this.data.data).filter(year => year !== 'recentYear').map(year => {
        return {
          name: year === 'recentValue' ? 'Recent value' : year,
          id: year
        }
      }).reverse()
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
    allindicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        indicatorsArray.push(this.indicatorsMeta[indicator])
      }
      indicatorsArray.sort(function(a, b) {
          var textA = a.indicator.toUpperCase();
          var textB = b.indicator.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      if(this.searchString !=='') {
        return indicatorsArray.filter(indicator => {
          return indicator.Dataset !== 'key' && indicator.indicator.toLowerCase().includes(this.searchString.toLowerCase());
        })
      }
      return indicatorsArray;
    },
    activeIndicators() {
      let indicatorsArray = [];
      if(this.activeCategory && this.activeCategory !== 'All categories') {
        if(this.activeSubCategory && this.activeSubCategory !== 'All subcategories') {
          return this.getSubcategoryindicators(this.activeCategory, this.activeSubCategory)
        }
        for(let subCategory in this.activeDataset[this.activeCategory]) {
          indicatorsArray = indicatorsArray.concat(this.getSubcategoryindicators(this.activeCategory, subCategory))
        }
      } else {
        for(let category in this.activeDataset) {
          for(let subCategory in this.activeDataset[category]) {
            indicatorsArray = indicatorsArray.concat(this.getSubcategoryindicators(category, subCategory))
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
          var textA = a.indicator.toUpperCase();
          var textB = b.indicator.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      if(this.deepSearch !== '') {
        return indicatorsWithMetaArray.filter(indicator => {
          return indicator.indicator.toLowerCase().includes(this.deepSearch.toLowerCase());
        })
      }
      return indicatorsWithMetaArray;
    },
    activeIndicatorDimensions() {
      return this.activeIndicator.codesArray.map(code => {
        return {
          code,
          dimension: this.indicatorsMeta[code].dim
        }
      })
    },
    inticatorsListHeight() {
      let height = '100vh',
      substraction = 200;
      if(this.activeIndicator) {
        height = '50vh'
        substraction = 128
      }
      if(this.activeCategory && this.indicatorSubCategories &&  this.indicatorSubCategories.length>1) {
        substraction+=40
      }
      return `calc(${height} - ${substraction}px)`
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
    getSubcategoryindicators(category, subCategory) {
      let indicatorsList = [];
      for(let indicator in this.activeDataset[category][subCategory]) {
        indicatorsList.push(this.activeDataset[category][subCategory][indicator]);
      }
      return indicatorsList
    },
    changeCategory() {
      this.activeSubCategory = 'All subcategories'
    },
    emitindicatorChange(indicator) {
      this.$emit('indicatorChange', indicator)
    },
    emitYearChange(year) {
      this.$emit('yearChange', year)
    },
    setActiveindicator(indicator) {
      this.activeIndicator = indicator;
      this.activeIndicatorDimension = indicator.dim;
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
    setActiveindicatorFromFullList(indicator) {
      this.searchString = '';
      this.activeSearch = false;
      this.selectDataset(indicator.dataset);
      this.setActiveindicator(indicator);
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
      let activeIndicator = this.allindicators.find(indicator => indicator['indicatorCode'] === this.activeIndicatorCode)
      if(activeIndicator) {
        this.setActiveindicatorFromFullList(activeIndicator)
      }
    }
  },
  mounted() {
    let activeIndicator = this.allindicators.find(indicator => indicator['indicatorCode'] === this.activeIndicatorCode)
    if(activeIndicator) {
      this.setActiveindicatorFromFullList(activeIndicator)
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
  background: none !important;
  padding: 0 !important;
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
  position: absolute !important;
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
