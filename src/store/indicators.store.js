import service from '@/services'

export default {
  namespaced: true,
  state: {
    indicatorsCategories: null,
    indicatorsMeta: null,
    profileData: null,
  },
  mutations: {
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
          .filter( indicatorCode => meta[indicatorCode]['Indicator'])
          .reduce( (res, indicatorCode) => (res[indicatorCode] = meta[indicatorCode], res), {} );
        commit("setMeta", meta);
      }
    }
  }
}
