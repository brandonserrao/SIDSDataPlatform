import service from '@/services'


export default {
  namespaced: true,
  state: {
    keyMetadata: null,
    allKeyData: null,
    fundingCategories: null,
    SIDSDataWithDonors: null,
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
    setSIDSDataWithDonors(state, data) {
      state.SIDSDataWithDonors = data;
    },
    setCountryList(state, data) {
      state.countryList = data;
      console.log(data)
    }
  },
  actions: {
    async getMetaData({ state, commit }) {
      if(!state.keyMetadata){
        const metaData = await service.loadMetaData();
        commit("setMetaData", metaData);
      }
    },
    async getAllKeyData({ dispatch, state, commit }) {
      if(!state.allKeyData){
        const allKeyData = await service.loadAllKeyData();
        commit("setKeyData", allKeyData);
        dispatch('generateCountryList', allKeyData)
      }
    },
    async setFundingCategories({ state, commit, dispatch }) {
      if(!state.fundingCategories){
        const fundingCategories = await service.loadFundingCategories();
        const filteredData = fundingCategories.filter(category => {
          return state.SIDSData.some(source => {
            return source.donors && source.donors.includes(category.name)
          })
        })
        console.log(filteredData);
        commit("setFundingCategories", filteredData);
        dispatch('setFullDonorsInfo');
      }
    },
    async setSIDSData({ state, commit }) {
      if(!state.SIDSData){
        const SIDSData = await service.loadSIDSData();
        console.log(SIDSData)
        commit("setSIDSData", SIDSData);
      }
    },
    generateCountryList({ commit }, data) {
      const countryList = [];
      for(let country in data) {
        let profile = data[country]['Profile'];
        profile.id = country;
        profile.map = `${'/SIDSDataPlatform/static/media/profiles-maps/' + profile.id + '.png'}`;
        profile.photo = `${'/SIDSDataPlatform/static/media/country-photos/' + profile.id + '.jpg'}`;
        // profile.code = codes[country]
        countryList.push(profile);
      }
      commit("setCountryList", countryList);
    },
    setFullDonorsInfo({ state, commit }) {
      let projectsWithDonorInfo = state.SIDSData.map(project => {
        let donorInfo
        if(project.donors) {
          donorInfo = project.donors.split(';').map(donorName => {
            let donor = state.fundingCategories.find((category) => {
              return category.name === donorName;
            });
            if(typeof donor === 'undefined') {
              return {
                name: donorName
              }
            }
            return donor
          });
        } else {
          donorInfo = []
        }
        project.donors = donorInfo;
        return project
      })
      commit('setSIDSDataWithDonors', projectsWithDonorInfo)
    }
  }
}
