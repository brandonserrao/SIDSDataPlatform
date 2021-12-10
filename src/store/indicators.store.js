import service from '@/services'

export default {
  namespaced: true,
  state: {
    indicatorsCategories: null,
    indicatorsMeta: null
  },
  mutations: {
    setCategories(state, data) {
      state.indicatorsCategories = data;
    },
    setMeta(state, data) {
      state.indicatorsMeta = data;
    }
  },
  actions: {
    async getCategories({ state, commit }) {
      if(!state.keyMetadata){
        const categories = await service.loadIndicatorsCategories();
        console.log(categories)
        commit("setCategories", categories);
      }
    },
    async getMeta({ state, commit }) {
      if(!state.allKeyData){
        const meta = await service.loadIndicatorsMeta();
        console.log(meta)
        commit("setMeta", meta);
      }
    }
  }
}
