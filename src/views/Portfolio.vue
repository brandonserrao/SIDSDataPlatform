<template>
  <div class="">
    <v-row>

      <portfolio-map></portfolio-map>
      <portfolio-bar></portfolio-bar>
      <portfolio-pie-chart></portfolio-pie-chart>
    </v-row>
    <v-row>
      <v-col>
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
        <v-select
          v-model="year"
          :items="years"
          label="Years"
          outlined
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
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
    fundingCategory:'All',
    year:'all',
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
    ]
  }),
  computed:{
    ...mapState({
      countries: state => state.countryList,
      fundingCategories: state => state.fundingCategories,
      SIDSData: state => state.SIDSData,
    }),
    fundingCategoriesFiltered() {
      const sources = this.fundingCategories.filter(category => {
        if(this.fundingCategory === 'All') {
          return true
        }
        if(this.fundingCategory === 'Programme Countries') {
          return category.category === 'Government' && this.countries.some(country =>  country.Country === category.subCategory);
        }
        else if(this.fundingCategory === 'Donor Countries') {
          return category.category === 'Government';
        }
        else {
          return category.category === this.fundingCategory;
        }
      });
      sources.unshift({
        name:'All Funding Sources',
        subCategory:'All Funding Sources'
      })
      return sources;
    }
  }
}
</script>
