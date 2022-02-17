import service from '@/services'
import { indexCodes } from '@/choro/index-data';

export default {
  namespaced: true,
  state: {
    datasetsList: null,
    indicatorsCategories: null,
    indicatorsMeta: null,
    profileData: null,
    activeIndicatorData:null
  },
  mutations: {
    setDatasetsList(state, data) {
      state.datasetsList = data;
    },
    setCategories(state, data) {
      state.indicatorsCategories = data;
    },
    setMeta(state, data) {
      state.indicatorsMeta = data;
    },
    setProfileData(state, data) {
      state.profileData = data;
    },
    setActiveIndicator(state, data) {
      state.activeIndicatorData = data;
    },
  },
  actions: {
    async getDatasetsList({ state, commit }) {
      if(!state.datasetsList){
        const datasetsData = await service.loadDatasetsList();
        let datasetsList = [];
        for(let datasetCode in datasetsData) {
          let dataset = datasetsData[datasetCode];
          dataset.code = datasetCode;
          datasetsList.push(dataset);
        }
        datasetsList.sort(function (a, b) {
          if (a.priority < b.priority) {
            return 1;
          }
          if (a.priority > b.priority) {
            return -1;
          }
          if (a['Dataset Name'] > b['Dataset Name']) {
            return 1;
          }
          if (a['Dataset Name'] < b['Dataset Name']) {
            return -1;
          }
          return 0;
        });
        commit("setDatasetsList", datasetsList);
        console.log(datasetsList)
      }
    },
    async getProfileData({ state, commit }) {
      if(!state.profileData){
        const profileData = await service.loadProfileData();
        commit("setProfileData", profileData);
      }
    },
    async getCategories({ state, commit }) {
      if(!state.keyMetadata){
        const categories = await service.loadIndicatorsCategories();
        commit("setCategories", categories);
      }
    },
    async getMeta({ state, commit }) {
      if(!state.allKeyData){
        let meta = await service.loadIndicatorsMeta();
        meta = Object.keys(meta)
          .filter( indicatorCode => meta[indicatorCode].indicator)
          .reduce( (res, indicatorCode) => (res[indicatorCode] = meta[indicatorCode], res), {} );
        commit("setMeta", meta);
      }
    },
    async getIndicatorData({ commit}, indicatorCode) {
      let APIcode = indicatorCode,
      code = indicatorCode;
      if (indicatorCode == "region") {
        code = "hdr-137506";///temp so has something to attach to data
      }
      if (Object.keys(indexCodes).includes(indicatorCode)) {
        APIcode="/indices/" + code.replace('-index','');
      } else {
        let codeSplit = code.split("-");
        APIcode=`/indicators/${codeSplit[0]}/${code}`
      }
      let indicatorData = await service.loadIndicatorData(APIcode);
      indicatorData = Object.keys(indexCodes).includes(indicatorCode) ? indicatorData : indicatorData[code];
      return commit('setActiveIndicator', indicatorData)
    }
  }
}
