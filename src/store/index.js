import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import service from '@/services'

export default new Vuex.Store({
  state: {
    keyMetadata: null,
    allKeyData: null,
    countryList: null
  },
  mutations: {
    setMetaData(state, data) {
      state.keyMetadata = data;
    },
    setKeyData(state, data) {
      state.allKeyData = data;
    },
    setCountryList(state, data) {
      state.countryList = data;

      console.log(state.countryList)
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
