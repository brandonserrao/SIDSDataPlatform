import service from '@/services'
import sidsList from '@/assets/sidsList'


export default {
  namespaced: true,
  state: {
    sidsList: sidsList,
    indicatorsMetadata: null,
    profiles: {}
  },
  mutations: {
    setIndicatorsMetadata(state, data) {
      state.indicatorsMetadata = data;
    },
    setCountryProfile(state, {profile , id}) {
      console.log(id)
      state.profiles[id] = profile;
    }
  },
  actions: {
    async getIndicatorsMetadata({ state, commit }) {
      if(!state.indicatorsMetadata){
        const data = await service.loadProfileIndicarotsMetadata();
        commit("setIndicatorsMetadata", data);
      }
    },
    async getCountryProfile({ state, commit }, id) {
      if(!state.profiles[id]){
        let county = state.sidsList.find(sids => sids.id === id)
        const profile = await service.loadCountryProfile(county.iso);
        console.log(profile)
        commit("setCountryProfile", {profile, id});
      }
    }
  }
}
