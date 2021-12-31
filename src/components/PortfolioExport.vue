<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        rounded
        v-bind="attrs"
        v-on="on"
      >
        Export
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item @click="exportCSV">
          <v-list-item-title>Summary CSV</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item @click="exportProjectList">
          <v-list-item-title>Project List</v-list-item-title>
        </v-list-item> -->
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'PortfolioExport',
  props:{
    region: {
      type: String,
      default: 'All'
    },
    year: {
      type: String,
      default: 'All'
    },
    funding: {
      type: String,
      default: 'All'
    },
    projects: {},
    data:{},
    categories:{}
  },
  data() {
    return {
      portfolioHeaders: {
          id: 'Project ID',
          country: "Country",
          region: "Region",
          year: "Year",
          title: "Project Title",
          budget: "Budget (USD)",
          expense: "Expense (USD)",
          sdg: "SDGs",
          solution: "Signature Solution",
          donors: "Funding Sources",
      },
      summaryHeaders: {
        category: 'Category',
        budget: "Total Budget (USD)",
        projects: "Number of Projects",
        countries: "SIDS with UNDP Projects",
        type: "Donor or Recipient"
      },
      regions: ["Caribbean", "Pacific", "AIS"],
      sdgs: ["No poverty", "Zero hunger", "Good health and well-being", "Quality education", "Gender equality", "Clean water and sanitation", "Affordable and clean energy", "Decent work and economic growth", "Industry, innovation and infrastructure", "Reduced inequalities", "Sustainable cities and communities", "Responsible consumption and production", "Climate action", "Life below water", "Life on Land", "Peace, justice, and strong institutions", "Partnerships for the goals"],
      ss: ["Keeping people out of poverty", "Strengthen effective, inclusive and accountable governance", "Enhance national prevention and recovery capacities for resilient societies", "Promote nature-based solutions for a sustainable planet", "Close the energy gap", "Strengthen gender equality and the empowerment of women and girls"],

    }
  },
  methods: {
    exportProjectList(){
      let note = `This dataset is the list of UNDP projects filtered by the ${this.region}  region, the year(s) ${this.year} , and the funding category ${this.funding} . All data is used with permission from the UNDP open data portal.`

      this.exportCSVFile(this.portfolioHeaders, this.projects, 'sids_projects_' + this.region + "_" + this.year, note)
    },
    exportCSV(){
      let summaryExport = this.summaryExportRender()
      let note = `This dataset is the compiled budget and project totals per category for all UNDP projects filtered by the ${this.region}  region, the year(s) ${this.year} , and the funding category ${this.funding} . All data is used with permission from the UNDP open data portal.`
      this.exportCSVFile(summaryExport, 'sids_projects_' + this.region + "_" + this.year, note)
    },
    exportCSVFile(items, fileTitle, note) {
      const fileData = [this.summaryHeaders].concat(items);
      // Convert Object to JSON
      var jsonObject = JSON.stringify(fileData);
      var csv = this.convertToCSV(jsonObject,note);
      var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    convertToCSV(objArray,note) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str=""
      if(note!=""){
      str += '#'+note+'\r\n';}
      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
              if (line != '') line += ','
              line += array[i][index];
          }
          str += line + '\r\n';
      }
      return str;
    },
    summaryExportRender() {
      let summaryExport = [],
      distinctProjects = [],
      distinctCountries = [],
      totalBudg = 0;
      for (let project in this.projects) {
          totalBudg += parseInt(this.projects[project].budget)
          if (!distinctProjects.includes(this.projects[project].title)) {
              distinctProjects.push(this.projects[project].title)
          }
          if (!distinctCountries.includes(this.projects[project].country)) {
              distinctCountries.push(this.projects[project].country)
          }
      }
      let newEl = {};
      newEl["category"] = "Total";
      newEl["budget"] = totalBudg;
      newEl["projects"] = distinctProjects.length;
      newEl["countries"] = distinctCountries.length;
      newEl["type"] = "Recipient";

      summaryExport.push(newEl)
      for (let region in this.regions) {
          let regionDistinctProjects = [],
          totalBudg = 0;
          for (let project in this.projects.filter((d) => { return d.region == this.regions[region] })) {
              totalBudg += parseInt(this.projects[project].budget)
              if (!regionDistinctProjects.includes(this.projects[project].title)) {
                  regionDistinctProjects.push(this.projects[project].title)
              }
          }
          newEl = {}
          newEl["category"] = this.regions[region]
          newEl["budget"] = totalBudg
          newEl["projects"] = regionDistinctProjects.length
          newEl["countries"] = 1//join(';')
          newEl["type"] = "Recipient"
          summaryExport.push(newEl)
      }


      //by recipient country,
      for (let country in distinctCountries) {
          let countryDistinctProjects = [],
          totalBudg = 0;
          for (let project in this.projects.filter((d) => { return d.country == distinctCountries[country] })) {
              totalBudg += parseInt(this.projects[project].budget)
              if (!countryDistinctProjects.includes(this.projects[project].title)) {
                  countryDistinctProjects.push(this.projects[project].title)
              }
          }
          newEl = {}
          newEl["category"] = distinctCountries[country]
          newEl["budget"] = totalBudg
          newEl["projects"] = countryDistinctProjects.length
          newEl["countries"] = 1//join(';')
          newEl["type"] = "Recipient"

          summaryExport.push(newEl)
      }

      //by funding category,
      for (let fundCat in this.categories) {
          let label = this.categories[fundCat],
          categoryDistinctProjects = [],
          categoriesDistinctCountries = [],
          totalBudg = 0;
          for (let project in this.projects) {
              let donors = this.projects[project].donors;//["budget"])
              for (let donor in donors) {
                  try {
                      let category = this.categories[donors[donor]].category;

                      if (label == "Programme Countries") {
                          if (category == "Government" && this.categories[donors[donor]].subCategory == this.projects[project].country) {
                              let budget = parseInt(this.projects[project]["budget"]) / donors.length
                              totalBudg += budget
                              if (!categoryDistinctProjects.includes(this.projects[project].title)) {
                                  categoryDistinctProjects.push(this.projects[project].title)
                              }
                              if (!categoriesDistinctCountries.includes(this.projects[project].country)) {
                                  categoriesDistinctCountries.push(this.projects[project].country)
                              }
                          }
                      }

                      else if (label == "Donor Countries") {
                          if (category == "Government" && this.categories[donors[donor]].subCategory != this.projects[project].country) {
                              let budget = parseInt(this.projects[project]["budget"]) / donors.length
                              totalBudg += budget
                          }
                          if (!categoryDistinctProjects.includes(this.projects[project].title)) {
                              categoryDistinctProjects.push(this.projects[project].title)
                          }
                          if (!categoriesDistinctCountries.includes(this.projects[project].country)) {
                              categoriesDistinctCountries.push(this.projects[project].country)
                          }
                      }

                      else if (category == label) {
                          let budget = parseInt(this.projects[project]["budget"]) / donors.length;
                          totalBudg += budget;
                          if (!categoryDistinctProjects.includes(this.projects[project].title)) {
                              categoryDistinctProjects.push(this.projects[project].title)
                          }
                          if (!categoriesDistinctCountries.includes(this.projects[project].country)) {
                              categoriesDistinctCountries.push(this.projects[project].country)
                          }
                      }
                  }
                  catch (error) {
                      // console.log("no category");
                  }
              }
          }
          newEl = {}
          newEl["category"] = label.replace(/,/g, '')
          newEl["budget"] = totalBudg
          newEl["projects"] = categoryDistinctProjects.length
          newEl["countries"] = categoriesDistinctCountries.length
          newEl["type"] = "Donor"

          summaryExport.push(newEl)
      }


      //by sdg,

      for (let sdg in this.sdgs) {
          let distinctProjects = [],
          totalBudg = 0;
          for (let project in this.projects.filter((d) => { return d.sdg.includes(this.sdgs[sdg]) })) {
              totalBudg += parseInt(this.projects[project].budget)
              if (!distinctProjects.includes(this.projects[project].title)) {
                  distinctProjects.push(this.projects[project].title)
              }
          }
          newEl = {}
          newEl["category"] = "SDG " + (parseInt(sdg) + 1) + ": " + this.sdgs[sdg].replace(/,/g, '')
          newEl["budget"] = totalBudg
          newEl["projects"] = distinctProjects.length
          newEl["countries"] = 1//join(';')
          newEl["type"] = "Recipient"

          summaryExport.push(newEl)
      }
      for (let ssss in this.ss) {
        let distinctProjects = [],
        totalBudg = 0;
        for (let project in this.projects.filter((d) => { return d.solution.includes(this.ss[ssss]) })) {
            totalBudg += parseInt(this.projects[project].budget)
            if (!distinctProjects.includes(this.projects[project].title)) {
                distinctProjects.push(this.projects[project].title)
            }
        }
        newEl = {}
        newEl["category"] = "Signature Solution " + (parseInt(ssss) + 1) + ": " + this.ss[ssss].replace(/,/g, '')
        newEl["budget"] = totalBudg
        newEl["projects"] = distinctProjects.length
        newEl["countries"] = 1//join(';')
        newEl["type"] = "Recipient"

        summaryExport.push(newEl)
      }
      return summaryExport;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
