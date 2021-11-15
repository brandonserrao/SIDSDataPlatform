import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import service from '@/services'

export default new Vuex.Store({
  state: {
    keyMetadata: null,
    allKeyData: null,
    fundingCategories: null,
    SIDSData: null,
    countryList: null
  },
  mutations: {
    setMetaData(state, data) {
      state.keyMetadata = data;
    },
    setKeyData(state, data) {
      state.allKeyData = data;
    },
    setFundingCategories(state, data) {
      state.fundingCategories = data;
    },
    setSIDSData(state, data) {
      state.SIDSData = data;
    },
    setCountryList(state, data) {
      state.countryList = data;
    }
  },
  actions: {
    async getMetaData({ state, commit }) {
      if(!state.keyMetadata){
        const metaData = await service.loadMetaData();
        console.log(metaData)
        commit("setMetaData", metaData);
      }
    },
    async getAllKeyData({ dispatch, state, commit }) {
      if(!state.allKeyData){
        const allKeyData = await service.loadAllKeyData();
        console.log(allKeyData)
        commit("setKeyData", allKeyData);
        dispatch('generateCountryList', allKeyData)
      }
    },
    async setFundingCategories({ state, commit }) {
      if(!state.fundingCategories){
        const fundingCategories = await service.loadFundingCategories();

        const filteredData = fundingCategories.filter(category => {
          return state.SIDSData.some(source => {
            return source.donors && source.donors.includes(category.name)
          })
        })
        commit("setFundingCategories", filteredData);
      }
    },
    async setSIDSData({ state, commit }) {
      if(!state.SIDSData){
        const SIDSData = await service.loadSIDSData();
        commit("setSIDSData", SIDSData);
      }
    },
    generateCountryList({ commit }, data) {
      const countryList = [];
      for(let country in data) {
        let profile = data[country]['Profile'];
        profile.id = country;
        profile.map = `${'https://sids-dashboard.github.io/SIDSDataPlatform/maps/relief/' + profile.id + 'Relief.png'}`;
        profile.photo = `${'https://sids-dashboard.github.io/SIDSDataPlatform/images/countryPhotos/' + profile.id + '.jpg'}`;
        countryList.push(profile);
      }
      commit("setCountryList", countryList);
    }
  }
});
