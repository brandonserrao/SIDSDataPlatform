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
        let country = state.sidsList.find(sids => sids.id === id)
        const profile = await service.loadCountryProfile(country.iso);
        profile.sidsData = country;
        commit("setCountryProfile", {profile, id});
      }
    }
  }
}
