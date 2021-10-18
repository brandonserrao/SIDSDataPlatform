//adds csv data for dataset/layer drop down
//also sets up large object of all metadata for legends

function addButtons() {

    //var sidsHolder = document.getElementById('country-select');
    var sidsHolder = document.getElementById('country');

    names.map(function (x) {
        var btn = document.createElement("option");
        btn.innerHTML = x.NAME_0; //+ ' ' + x.flag;
        btn.classList.add('sidsb')
        btn.setAttribute('id', x.GID_0)
        sidsHolder.appendChild(btn)

    })



    d3.csv("gisPanel/csvData.csv").then(function (d) {


        /*pillars
        1 = blue economy
        2 = climate action
        3 = digital transformation

        */
        

        d.map(function (x) {
            allLayers.push({
                'field_name': x.Field_Name,
                'title': x.Name,
                'band': x.Band,
                'sdg': x.SDG,
                'samoa_path': x.samoa_pathway,
                'pillar': x.pillars,
                'time': x.Temporal,
                'desc': x.Description,
                'units': x.Unit,
                'desc_long': x.Desc_long,
                'source_name': x.Source_Name,
                'link': x.Source_Link
            })

           

        })

        var dataHolder = document.getElementById('dataDrop')
      

        var uniqueNames = allLayers.map(x => x.title)

        var actualu = _.uniq(uniqueNames);

        for (var x in actualu) {
            //console.log(actualu[x]);
            var btn1 = document.createElement("option");
            btn1.innerHTML = actualu[x];
            btn1.classList.add('data')
            var correctFI = _.find(allLayers, function (o) {
                return o.title === actualu[x]
            })
            //console.log(correctFI);
            btn1.setAttribute('id', correctFI.field_name)
            dataHolder.appendChild(btn1)

        }

    })
}