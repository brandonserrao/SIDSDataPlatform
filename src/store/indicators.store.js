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
    },
    setMeta(state, data) {
      state.indicatorsMeta = data;
    },
    setProfileData(state, data) {
      state.profileData = data;
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
        const meta = await service.loadIndicatorsMeta();
        commit("setMeta", meta);
      }
    }
  }
}
