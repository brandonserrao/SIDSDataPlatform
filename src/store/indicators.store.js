import service from '@/services'

export default {
  namespaced: true,
  state: {
    datasetsList: null,
    indicatorsCategories: null,
    indicatorsMeta: null,
    profileData: null,
  },
  mutations: {
    setDatasetsList(state, data) {
      state.datasetsList = data;
    },
    setCategories(state, data) {
      state.indicatorsCategories = data;
      console.log(data, '1')
    },
    setMeta(state, data) {
      state.indicatorsMeta = data;
      console.log(data, '2')
    },
    setProfileData(state, data) {
      state.profileData = data;
      console.log(data, '3')
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
    }
  }
}
