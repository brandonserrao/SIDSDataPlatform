import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      SIDSDataWithDonors: state => state.SIDSDataWithDonors,
    }),
    filteredYearDataSIDS() {
      if(this.year !== 'all') {
        return this.SIDSDataWithDonors.filter(project => {
            return project.year === this.year
        })
      }
      return this.SIDSDataWithDonors
    },
  }
}
