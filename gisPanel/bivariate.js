

function createBivar(object) {


    //$('#histogram_frame').hide();
    $('#legendTitle').show();
    $('#updateLegend').show();

    if (map.getLayer(currentGeojsonLayers.hexSize)) {
        map.setPaintProperty(currentGeojsonLayers.hexSize,'fill-opacity', 0.0);
    }

    if (this.selectedOptions[0].innerHTML == 'Select Bivariate Dataset') {
        bi_var = '';
        if (map.getLayer('newone')) {
            map.removeLayer('newone');
            map.removeSource('newone');
        }
    } else {
        bi_var = this.selectedOptions[0].id;
        var features = map.queryRenderedFeatures({
            layers: [currentGeojsonLayers.hexSize]
        })

        if (features) {
            console.log();

            var uniFeatures;
            if (currentGeojsonLayers.hexSize === 'admin1') {
                uniFeatures = getUniqueFeatures(features, 'GID_1');

            } else if (currentGeojsonLayers.hexSize === 'admin2') {
                uniFeatures = getUniqueFeatures(features, 'GID_2');
            } else {
                uniFeatures = getUniqueFeatures(features, 'hexid');
            }

            // bi-var
            var selection = main_var;
            var selection_bivar = bi_var;

            var selecteData = uniFeatures.map(x => x.properties[selection])
            var selecteData_biv = uniFeatures.map(x => x.properties[selection_bivar]);//popden
            var breaksX = chroma.limits(selecteData, 'q', 3);
            var breaksY = chroma.limits(selecteData_biv, 'q', 3);
            var bivar_colors = colorSeqSeq3['blue-pink-purple'];

            var featureCount = uniFeatures.length;
            var bivarClass = Array(featureCount).fill(0);
            var breaksX = chroma.limits(selecteData, 'q', 3);
            var breaksY = chroma.limits(selecteData_biv, 'q', 3);
            //console.log(breaksX,breaksY)
            var bivarScatter = new Array(10);
            for (var i = 0; i < 10; i++) {
                bivarScatter[i] = [];
            }
            for (var i = 0; i < featureCount; i++) {
                
                var x = selecteData[i];
                var y = selecteData_biv[i];
                

                //bivarScatter.push({'x':x,'y':y});
                var v1, v2;
                if (x < breaksX[1])
                    v1 = 1
                else if (x < breaksX[2])
                    v1 = 2
                else v1 = 3;
                if (y < breaksY[1])
                    v2 = 1
                else if (y < breaksY[2])
                    v2 = 2
                else v2 = 3;
                var bivar = String(v1) + String(v2);

                if (typeof (x) == 'undefined' || typeof (y) == 'undefined') 
                {
                    bivar = "Null";               
                }
                
                //console.log(bivar);
                switch (bivar) {
                    case "11": bivarClass[i] = 0; break;//LL
                    case "12": bivarClass[i] = 1; break;//LM
                    case "13": bivarClass[i] = 2; break;//LH
                    case "21": bivarClass[i] = 3; break;//ML
                    case "22": bivarClass[i] = 4; break;//MM
                    case "23": bivarClass[i] = 5; break;//MH
                    case "31": bivarClass[i] = 6; break;//HL
                    case "32": bivarClass[i] = 7; break;//HM
                    case "33": bivarClass[i] = 8; break;//HH
                    case "Null": bivarClass[i] = 9; break;//NULL
                }
                bivarScatter[bivarClass[i]].push({'x':x,'y':y});
                uniFeatures[i]["properties"]["bivarClass"] = bivarClass[i];
            }

            //convert rendered features to geojson format
            var fc = turf.featureCollection(uniFeatures);

            /*
            if (map.getLayer(currentGeojsonLayers.hexSize)) {
                map.removeLayer(currentGeojsonLayers.hexSize)
            }*/

            if (map.getLayer('newone')) {
                map.removeLayer('newone');
                map.removeSource('newone');
            }
            
            //add new source 
            map.addSource('newone', {
                type: 'geojson',
                data: fc //data is the new geojson 
            })
            map.addLayer({
                'id': 'newone',
                'source': 'newone',
                'type': 'fill',
                'paint': {
                    'fill-color':
                        [
                            'step',
                            ['get', 'bivarClass'],
                            bivar_colors[0],
                            0, bivar_colors[1],
                            1, bivar_colors[2],
                            2, bivar_colors[3],
                            3, bivar_colors[4],
                            4, bivar_colors[5],
                            5, bivar_colors[6],
                            6, bivar_colors[7],
                            7, bivar_colors[8],
                            8, 'rgba(255,255,255,0)',
                        ],
                    'fill-opacity': 0.9,
                }
            })

            if (!currentGeojsonLayers.hexSize === 'newone') {
                currentGeojsonLayers.hexSize = 'newone';
            }
            

            // bi-var legend
            $('#legendTitle').hide();
            $('#updateLegend').hide();
            
            var element = document.getElementById("bivarPlot");
            if (typeof (element) != 'undefined' && element != null) {
                $('#bivarPlot').remove();
                $('#bivarSwitcher').remove();
            }
            var element = document.getElementById("histogram");
            if (typeof (element) != 'undefined' && element != null) {
                $('#histogram').remove();
            }
            $('#histogram_frame').append('<canvas id="bivarPlot" width="300" height="170"><canvas>')
            $('#histogram_frame').append('<select id="bivarSwitcher" onChange="bivarScaleSwitch(this.value);"><option value="logarithmic">logarithmic</option><option value="linear">linear</option></select>')
            var canvas = document.getElementById('bivarPlot');        
            
            var maxX = Math.pow(10, Math.ceil(Math.log10(breaksX[3])));
            var minX = Math.pow(10, Math.ceil(Math.log10(breaksX[0])));
            var maxY = Math.pow(10, Math.ceil(Math.log10(breaksY[3])));
            var minY = Math.pow(10, Math.ceil(Math.log10(breaksY[0])));

            // dynamic point size
            var point_radius;
            if (featureCount<100){
                point_radius = 3.3;
            } else if (featureCount>1000){
                point_radius = 1.5;                
            } else {
                point_radius = ((featureCount-100)/100)*0.2                
            }            

            bivar_option = {
                scales: {
                    xAxes: [{
                        display: true,
                        type: 'logarithmic',                            
                        scaleLabel: {
                            display: true,
                            labelString: _.find(allLayers, ['field_name', main_var])["title"],
                        },
                        ticks: {
                            min: breaksX[0], //minimum tick
                            max: breaksX[3], //maximum tick
                            //maxTicksLimit: 4,    
                            maxRotation: 45,
                            minRotation: 45,

                            callback: function (valueX, index, values) {        
                                if (valueX === 100000000) return "100M";
                                if (valueX === 10000000) return "10M";
                                if (valueX === 1000000) return "1M";
                                if (valueX === 100000) return "100K";
                                if (valueX === 10000) return "10K";
                                if (valueX === 1000) return "1K";
                                if (valueX === 100) return "100";
                                if (valueX === 10) return "10";
                                if (valueX === 1) return "1";
                                if (valueX === 0.1) return "0.1";
                                if (valueX>10)
                                    return nFormatter(valueX,1)
                                else 
                                    return nFormatter(valueX,2);

                            }
                        },
                        
                        afterBuildTicks: function(chartObjX) { 
                            chartObjX.ticks = [];
                            chartObjX.ticks.push(breaksX[3]);
                            chartObjX.ticks.push(breaksX[2]);
                            chartObjX.ticks.push(breaksX[1]);
                            chartObjX.ticks.push(breaksX[0]);
                        }

                    }],
                    yAxes: [{
                        display: true,
                        type: "logarithmic",    
                        scaleLabel: {
                            display: true,
                            labelString: _.find(allLayers, ['field_name', bi_var])["title"],
                        },
                        ticks: {
                            min: breaksY[0], //minimum tick
                            max: breaksY[3], //maximum tick
                            //maxTicksLimit: 4,
                            maxRotation: 45,
                            minRotation: 45,
                            
                            callback: function (valueY, index, values) {
                                if (valueY === 100000000) return "100M";
                                if (valueY === 10000000) return "10M";
                                if (valueY === 1000000) return "1M";
                                if (valueY === 100000) return "100K";
                                if (valueY === 10000) return "10K";
                                if (valueY === 1000) return "1K";
                                if (valueY === 100) return "100";
                                if (valueY === 10) return "10";
                                if (valueY === 1) return "1";
                                if (valueY === 0.1) return "0.1";
                                if (valueY>10)
                                    return nFormatter(valueY,1)
                                else 
                                    return nFormatter(valueY,2);
                            }
                        },                        
                        
                        afterBuildTicks: function(chartObjY) {
                            chartObjY.ticks = [];
                            chartObjY.ticks.push(breaksY[3]);
                            chartObjY.ticks.push(breaksY[2]);
                            chartObjY.ticks.push(breaksY[1]);
                            chartObjY.ticks.push(breaksY[0]); 
                        }        
                    }]
                },
                
                legend: {
                    position: 'top',
                    display: false,                        
                }

            }

            var bivarClasses = ['L-L','L-Mid','L-H',
                                'Mid-L','Mid-Mid','Mid-H',
                                'H-L','H-Mid','H-H'];
            var bivarDatasets = [];            
            for (var i = 0; i < 9; i++) {
                bivarDatasets.push(
                    {
                        label: bivarClasses[i],
                        data: bivarScatter[i],
                        pointRadius: point_radius,
                        pointHoverRadius: 3,
                        backgroundColor: bivar_colors[i],
                        hoverBorderColor: 'rgba(0,0,0,1)',
                        pointHoverBorderWidth: 2,
                        borderWidth: 1.5,
                    }
                )
            }
            
            scatterChart = new Chart(canvas, {
                type: 'scatter',
                data: {datasets: bivarDatasets},
                options: bivar_option            
            });       

        }
    }

    console.log(map.getStyle().layers)

};