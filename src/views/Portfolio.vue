<template>
  <div class="">
    <v-row>

      <portfolio-map></portfolio-map>
      <portfolio-bar></portfolio-bar>
    </v-row>
    <v-row justify="center">
      <v-btn-toggle
          v-model="goalType"
          mandatory
        >
        <v-btn value="SAMOA Pathway">
          SAMOA Pathway
        </v-btn>
        <v-btn value="Sustainable Development Goals">
          Sustainable Development Goals
        </v-btn>
        <v-btn value="Signature Solutions">
          Signature Solutions
        </v-btn>
      </v-btn-toggle>
    </v-row>
    {{filteredYearDataSIDS.length}}
    <v-row>
      <v-col cols="5">
        <portfolio-pie-chart
          :data="regionFunding"
          chartName="region"
          :colorScheme="regionColors"
        ></portfolio-pie-chart>
      </v-col>
      <v-col cols="5">
        <portfolio-pie-chart
          :data="sourcesFunding"
          chartName="sources"
          :colorScheme="sourcesColor"
        ></portfolio-pie-chart>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="year"
          :items="years"
          label="Years"
          outlined
        ></v-select>
        <v-select
          v-model="fundingCategory"
          :items="fundingCategoriesTypes"
          label="Funding categories"
          outlined
        ></v-select>
        <v-select
          v-model="fundingSource"
          :items="fundingCategoriesFiltered"
          label="Funding sources"
          item-text="name"
          item-value="name"
          outlined
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as d3 from 'd3';
// @ is an alias to /src
import PortfolioMap from '@/components/PortfolioMap';
import PortfolioBar from '@/components/PortfolioBar';
import PortfolioPieChart from '@/components/PortfolioPieChart';
import { mapState } from 'vuex';

export default {
  name: 'Portfolio',
  components: {
    PortfolioMap,
    PortfolioBar,
    PortfolioPieChart
  },
  data:()=>({
    fundingSource:{
      subCategory:'All Funding Sources'
    },
    goalType:'Sustainable Development Goals',
    fundingCategory:'All',
    year:'2021',
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
  }),
  computed:{
    ...mapState({
      countries: state => state.countryList,
      fundingCategories: state => state.fundingCategories,
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
    fundingCategoriesFiltered() {
      const projectsString = JSON.stringify(this.filteredYearDataSIDS);
      let sources = this.fundingCategories.filter(category => {
        return projectsString.includes(category.name)
      })
      if(this.fundingCategory !== 'All') {
        sources = sources.filter((category) => this.checkDonorsCategory(category))
      }
      sources.unshift({
        name:'All Funding Sources',
        subCategory:'All Funding Sources'
      })
      return sources;
    },
    regionFunding() {
       let funding = this.regions.map(region => {
        return {
          category: region,
          value: this.filteredYearDataSIDS.reduce((budget, project) => {
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
          value: this.filteredYearDataSIDS.reduce((budget, project) => {
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
    }
  },
  methods: {
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
    checkProjectsCategory(project, donor) {
      if(this.fundingCategory === 'Programme Countries') {
        return donor.category === 'Government' && project.country === donor.subCategory;
      }
      else if(this.fundingCategory === 'Donor Countries') {
        return project.country  != donor.subCategory;
      }
      else {
        return donor.category === this.fundingCategory;
      }
    }
  }
}
</script>
