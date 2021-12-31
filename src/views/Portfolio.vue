<template>
  <div class="">
    <v-row>
      <v-col cols="12">
        <portfolio-map
          :region="region"
          @updateRegion="changeFilter({type:'region'})"
          :projects="filteredProjects"
        ></portfolio-map>
      </v-col>
    </v-row>
    <router-view class="mb-3 mt-negative"></router-view>
    <v-row justify="center">
      <v-col class="margin-wrap-right"></v-col>
      <v-col class="tabs-column">
        <v-row justify="center">
          <v-col cols="12">
              <v-tabs
                class="tabs prtfolio-slider"
                v-model="activePage"
              >
                <v-tab @change="transitionTo('samoa')">SAMOA Pathway</v-tab>
                <v-tab @change="transitionTo('sdgs')">Sustainable Development Goals</v-tab>
                <v-tab @change="transitionTo('signature-solutions')">Signature Solutions</v-tab>
              </v-tabs>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="6">
            <portfolio-pie-chart
              @changeFilter="changeFilter"
              :data="regionFunding"
              chartName="region"
              :colorScheme="regionColors"
            ></portfolio-pie-chart>
          </v-col>
          <v-col cols="6">
            <portfolio-pie-chart
              @changeFilter="changeFilter"
              :data="sourcesFunding"
              chartName="sources"
              :colorScheme="sourcesColor"
            ></portfolio-pie-chart>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="margin-wrap-right">
        <div class="select">
          <label class="input-label">Years</label>
          <v-select
            rounded
            dense
            :value="year"
            @change="setYear"
            :items="years"
            outlined
          ></v-select>
        </div>
        <v-divider class="mb-6"></v-divider>
        <div class="select">
          <label class="input-label">Funding categories</label>
          <v-select
            rounded
            dense
            :value="fundingCategory"
            @change="setCategory"
            :items="fundingCategoriesTypes"
            outlined
          ></v-select>
        </div>
        <div class="select">
          <label class="input-label">Funding sources</label>
          <v-select
            rounded
            dense
            :value="fundingSource"
            @change="setSource"
            :items="fundingCategoriesFiltered"
            item-text="name"
            item-value="name"
            outlined
            ></v-select>
        </div>
        <portfolio-export
          :region="region"
          :year="year"
          :funding="fundingCategory"
          :projects="filteredProjects"
          :data="fundingCategoriesFiltered"
          :categories="fundingCategoriesTypes"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as d3 from 'd3';
// @ is an alias to /src
import PortfolioMap from '@/components/PortfolioMap';
import PortfolioExport from '@/components/PortfolioExport';
import PortfolioPieChart from '@/components/PortfolioPieChart';
import { mapState } from 'vuex';
import sidsdata from '@/mixins/SIDSData.mixin'


export default {
  name: 'Portfolio',
  components: {
    PortfolioMap,
    PortfolioPieChart,
    PortfolioExport
  },
  props:['year', 'fundingCategory', 'fundingSource', 'region'],
  mixins:[sidsdata],
  data: function () {
    return {
      goalType:'Sustainable Development Goals',
      activePage:['samoa', 'sdgs', 'signature-solutions'].indexOf(this.$route.path.split('/')[2]),
      fundingCategoriesTypes:['All',"European Union", "Donor Countries", "Programme Countries", "UN Agencies", "UN Pooled Funds", "Vertical Funds", "Other"],
      years:[
        {
          text:'2012 to 2021',
          value: 'all',
        },{
          text:'2021',
          value: '2021',
        },{
          text:'2020',
          value: '2020',
        },{
          text:'2019',
          value: '2019',
        },{
          text:'2018',
          value: '2018',
        },{
          text:'2017',
          value: '2017',
        },{
          text:'2016',
          value: '2016',
        },{
          text:'2015',
          value: '2015',
        },{
          text:'2014',
          value: '2014',
        },{
          text:'2013',
          value: '2013',
        },{
          text:'2012',
          value: '2012',
        }
      ],
      sidsList: ["Antigua and Barbuda", "Aruba",
          "Bahrain", "Barbados", "Belize", "Cape Verde", "Comoros", "Cook Islands", "Cuba", "Dominica", "Dominican Republic",
          "Grenada", "Guinea-Bissau", "Guyana", "Haiti", "Jamaica", "Kiribati", "Maldives", "Marshall Islands",
          "Mauritius", "Micronesia", "Nauru", "Republic of Palau", "Papua New Guinea", "Samoa", "Sao Tome and Principe", "Seychelles",
          "Solomon Islands", "St. Kitts and Nevis", "St. Vincent and the Grenadines", "Saint Lucia", "Suriname", "Timor-Leste",
          "Trinidad and Tobago", "Tokelau", "Niue", "Tonga", "Puerto Rico", "Palau", "Tuvalu", "Vanuatu", "Cuba", "Bahamas", "Fiji", "Bermuda"],
      regions: ["Caribbean", "AIS", "Pacific"],
      regionColors: d3.scaleOrdinal()
        .domain(["Caribbean", "AIS", "Pacific"])
        .range(["#008080", "#97002B", "#F0A500"]),
      sourcesColor: d3.scaleOrdinal()
        .domain(["Vertical Funds", "Donor Countries", "Programme Countries", "UN Pooled Funds", "UN Agencies", "European Union", "Other"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"])
    }
  },
  computed:{
    ...mapState({
      countries: state => state.sids.countryList,
      fundingCategories: state => state.sids.fundingCategories,
      SIDSDataWithDonors: state => state.sids.SIDSDataWithDonors,
    }),
    fundingCategoriesFiltered() {
      let projects = this.filteredYearDataSIDS;
      if(this.region !== 'All') {
        projects = projects.filter((project) => {
          return project.region === this.region
        });
      }
      const projectsString = JSON.stringify(projects);
      let sources = this.fundingCategories.filter(category => {
        return projectsString.includes(category.name)
      })
      if(this.fundingCategory !== 'All') {
        sources = sources.filter((category) => this.checkDonorsCategory(category))
      }
      sources.unshift({
        name:'All Funding Sources',
        subCategory:'all'
      })
      return sources;
    },
    regionFunding() {
       let funding = this.regions.map(region => {
        return {
          category: region,
          value: this.filteredProjects.reduce((budget, project) => {
              if(project.region === region &&
                (this.fundingCategory === 'All' ||
                project.donors.some((donor) =>this.checkProjectsCategory(project, donor))
                )
              ) {
                return budget + parseInt(project.budget)
              }
              return budget
          }, 0)
        }
      })
      return funding
    },
    sourcesFunding() {
      let labels = this.sourcesColor.domain().map(label => {
        return {
          category: label,
          value: this.filteredProjects.reduce((budget, project) => {
            let financing = project.donors.reduce((finance, donor, index, donors )=> {
              if(this.fundingCategory === 'All' || donors.some((donor) => this.checkProjectsCategory(project, donor))) {
                if (label == "Programme Countries") {
                  if (donor.category == "Government" && project.country == donor.subCategory) {
                    return finance + (project.budget / donors.length)
                  }
                }

                else if (label == "Donor Countries") {
                  if (donor.category == "Government" && donor.subCategory != project.country) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (donor.category == label) {
                  return finance + (project.budget / donors.length)
                }

              }
              return finance
            }, 0)
            return budget + financing
          }, 0)
        }
      });
      return labels
    },
  },
  methods: {
    setYear(year) {

      this.$router.push({query: Object.assign({}, this.$route.query, {year})})
    },
    setCategory(category) {
      this.$router.push({query: Object.assign({}, this.$route.query, {
        fundingCategory : encodeURIComponent(category),
        fundingSource : encodeURIComponent('All Funding Sources')
      })})
    },
    setSource(source) {
      this.$router.push({query: Object.assign({}, this.$route.query, {fundingSource : encodeURIComponent(source)})})
    },
    checkDonorsCategory(donor) {
      if(this.fundingCategory === 'Programme Countries') {
        return donor.category === 'Government' && this.sidsList.some(country =>  country === donor.subCategory);
      }
      else if(this.fundingCategory === 'Donor Countries') {
        return donor.category === 'Government' && this.sidsList.every(country =>  country != donor.subCategory);
      }
      else {
        return donor.category === this.fundingCategory;
      }
    },
    updateRegion(region) {
      this.changeFilter({
        type: 'region',
        value: region
      })
    },
    changeFilter({type, value}) {
      if(type === 'region') {
        let regionToSet
        if(this.region === value) {
          regionToSet = 'All'
        } else {
          regionToSet = value
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {region : encodeURIComponent(regionToSet)})})
      } else {
        let categoryToSet
        if(this.fundingCategory === value) {
          categoryToSet = 'All'
        } else {
          categoryToSet = value
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {
          fundingCategory : encodeURIComponent(categoryToSet)})})
      }
    },
    transitionTo(to) {
      this.$router.push({path:`/portfolio/${to}`, query: this.$route.query})
    }
  }
}
</script>
<style media="screen">
  .prtfolio-slider {
    max-width: 792px;
    margin-left: auto;
    margin-top: -22px;
  }
  .mt-negative{
    height: 215px;
    margin-top: -205px !important;
  }
  .tabs-column {
    min-width: 900px;
  }
  .tabs {
    margin-left: auto;
    margin-right: auto;
  }
  .margin-wrap-right {
    width: 200px;
    max-width: 200px;
    margin-left: auto;
  }
  .margin-wrap-right {
    max-width: 200px;
    margin-right: auto;
  }
</style>
