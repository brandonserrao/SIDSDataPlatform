//BSERRAO NOTES (holders = dropdowns)
//-POPULATES THE SIDS NAME DROPDOWN
//-FILLS allLayers WITH METADATE FROM csvData.csv
//-POPULATES DATASET DROPDOWN

//adds all of the countries from the csv data for dataset/layer drop down
//also sets up large object of all metadata for legends

function populateDropdowns() {
  //var sidsHolder = document.getElementById('country-select');
  console.log("populating dropdown menus");
  let sidsHolder = document.getElementById("country");

  names.map(function (x) {
    let option = document.createElement("option");
    option.innerHTML = x.NAME_0; //+ ' ' + x.flag;
    option.classList.add("sidsb");
    option.setAttribute("id", x.GID_0);
    sidsHolder.appendChild(option);
  });

  d3.csv("gisPanel/csvData.csv").then(function (d) {
    /*pillars
        1 = blue economy
        2 = climate action
        3 = digital transformation

        */

    d.map(function (x) {
      allLayers.push({
        field_name: x.Field_Name,
        title: x.Name,
        band: x.Band,
        sdg: x.SDG,
        samoa_path: x.samoa_pathway,
        pillar: x.pillars,
        time: x.Temporal,
        desc: x.Description,
        units: x.Unit,
        desc_long: x.Desc_long,
        source_name: x.Source_Name,
        link: x.Source_Link,
      });
    });

    //populating the Dataset dropdown with unique headers from csv
    let datasetHolder = document.getElementById("dataDrop");
    let names = allLayers.map((x) => x.title);
    let uniqueNames = _.uniq(names);

    for (let x in uniqueNames) {
      //console.log(actualu[x]);
      let option = document.createElement("option");
      option.innerHTML = uniqueNames[x];
      option.classList.add("data");
      let correctFI = _.find(allLayers, function (o) {
        //correctFI STANDS FOR WHAT? NEEDS BETTER VARIABLE NAME
        return o.title === uniqueNames[x];
      });
      //console.log(correctFI);
      option.setAttribute("id", correctFI.field_name);
      datasetHolder.appendChild(option);
    }
  });
}
