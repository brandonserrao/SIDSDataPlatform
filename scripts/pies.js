
var portfolioPieWidth = 560,
	portfolioPieHeight = window.innerHeight/5.1-5,
	radius = Math.min(portfolioPieWidth, portfolioPieHeight) / 2;

var pie = d3.pie()
	// .startAngle(Math.PI / 1.5)
	// .endAngle(Math.PI * 2 + Math.PI /1.5)
	.sort(null)
	.value(function (d) {
		return d.value;
	});

var arc = d3.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var pieKey = function (d) { return d.data.category; };

$("#regionPie").css("height",window.innerHeight/5)

//pie chart initializations

var svgFundingPie = d3.select("#fundingPie")
	.append("svg")
	.append("g")
var svgRegionPie = d3.select("#regionPie")
	.append("svg")
	.append("g")

svgFundingPie.append("g")
	.attr("class", "slices");
svgFundingPie.append("g")
	.attr("class", "labels");
svgFundingPie.append("g")
	.attr("class", "lines");
svgRegionPie.append("g")
	.attr("class", "slices");
svgRegionPie.append("g")
	.attr("class", "labels");
svgRegionPie.append("g")
	.attr("class", "lines");

var pieChartRegion = "global"

var colorFunding = d3.scaleOrdinal()
	.domain(["Vertical Funds", "Donor Countries", "Programme Countries", "UN Pooled Funds", "UN Agencies", "European Union", "Other"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"]);

var colorRegion = d3.scaleOrdinal()
	.domain(["Caribbean", "AIS", "Pacific"])
	.range(["#008080", "#97002B", "#F0A500"]);

	//here to change left-margin of pies (coefficient of pieWidth)
svgRegionPie.attr("transform", "translate(" + portfolioPieWidth / 2.7 + "," + portfolioPieHeight / 1.8 + ")");
svgFundingPie.attr("transform", "translate(" + portfolioPieWidth / 2.7 + "," + portfolioPieHeight / 1.8 + ")");


///functions

function dataMapFunding(filteredData, fundingCategories) {
	console.timeLog()
	var labels1 = colorFunding.domain();
	labelMap1 = labels1.map(function (label) {

		summ = 0
		for (project in filteredData) {
			donors = filteredData[project]["donors"].split(';');//["budget"])
			for (donor in donors) {
				try {
					category = fundingCategories[donors[donor]].category;

					if (label == "Programme Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory == filteredData[project].country) {
							budget = parseInt(filteredData[project]["budget"]) / donors.length
							summ = summ + budget
						}
					}

					else if (label == "Donor Countries") {
						if (category == "Government" && fundingCategories[donors[donor]].subCategory != filteredData[project].country) {
							budget = parseInt(filteredData[project]["budget"]) / donors.length
							summ = summ + budget
						}
					}

					else if (category == label) {
						budget = parseInt(filteredData[project]["budget"]) / donors.length
						summ = summ + budget
					}


				}
				catch (error) {
					// console.log("no category");
				}
			}
		}
		return {
			category: label,
			value: summ//filter portfolioData by year and region, 
			//for all projects with one of the funding sources in label:category, 
			//and then sum budgets divided by # of sources for that project

		}
	});
	// console.log(labelMap);
	return labelMap1;
}

function dataMapRegion(filteredData) {
	var labels2 = colorRegion.domain();
	labelMap = labels2.map(function (label) {
		//console.log(label)
		sum = 0
		for (project in filteredData) {
			try {
				region = filteredData[project]["region"]
				// console.log(filteredData[project]["country"])
				// console.log(region)
				//region="Caribbean"
				if (region == label) {
					budget = parseInt(filteredData[project]["budget"])
					sum = sum + budget
				}


			}
			catch (error) {
				//		console.log(filteredData[project]["country"])
				// console.log("no category");
			}

		}
		return {
			category: label,
			value: sum//filter portfolioData by year and region, 
			//for all projects with one of the funding sources in label:category, 
			//and then sum budgets divided by # of sources for that project

		}
	});
	// console.log(labelMap);
	return labelMap;
}

function initPieChart(svgNum, colorFunc, pieData) {
	console.log(svgNum)

	/* ------- PIE SLICES -------*/
	var slice = svgNum.select(".slices").selectAll("path.slice")
		.data(pie(pieData), pieKey)

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return colorFunc(d.data.category); })
		.attr("class", "slice")

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svgNum.select(".labels").selectAll("text")
		.data(pie(pieData), pieKey);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.attr("font-size", "12px")
		.text(function (d) {
			if (d.data.value == 0) { return ""; } else {
				return d.data.category + " - " + nFormatter(d.data.value, 1);
			}
		});

	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svgNum.select(".lines").selectAll("polyline")
		.data(pie(pieData), pieKey);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
}

function updatePieChart(svgNum, colorFunc, pieData) {

	/* ------- PIE SLICES -------*/
	var slice = svgNum.select(".slices").selectAll("path.slice")
		.data(pie(pieData), pieKey);

	slice.enter()
		.insert("path")
		.style("fill", function (d) { return colorFunc(d.data.category); })
		.attr("class", "slice")

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	if (svgNum == svgRegionPie) {
		slice.on('click', function (d) {

			oldRegion = selectedRegion


			region = d.data.category.toLowerCase()

			//	console.log(oldRegion, region, oldRegion == region)


			newRegion = region
			if (region == oldRegion) {
				newRegion = "global"
			}
			console.log(newRegion)
			pieChartRegion = newRegion

		});
	}
	else if (svgNum == svgFundingPie) {
		slice.on('click', function (d) {
			oldFund = $("#fundingCategorySelect").find(":selected").text();
			fund = d.data.category//.toLowerCase()
			if (fund != oldFund) {

				console.log(fund)
				setSelectedId(document.getElementById('fundingCategorySelect'), fund)
				$('#fundingCategorySelect')
					.trigger('change');
			}
			else {
				setSelectedId(document.getElementById('fundingCategorySelect'), "All")
				$('#fundingCategorySelect')
					.trigger('change');
			}
		});
	}

	slice.on('mouseover', function () {

		svgNum.selectAll("path").style('opacity', 0.5);
		d3.select(this)
			.style('opacity', 1);
	})
		.on('mouseout', function () {
			svgNum.selectAll("path").style('opacity', 1);
		});


	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svgNum.select(".labels").selectAll("text")
		.data(pie(pieData), pieKey);

	// 	//console.log(pieData)




	sumall = 0
	for (source in pieData) {
		sumall += pieData[source].value
	}

	text.text(function (d) {
		//console.log(d.data.category,d.data.value/sumall)
		if (d.data.value / sumall < 0.0236) { return ""; } else {
			return d.data.category + " - " + nFormatter(d.data.value, 1);
		}
	});




	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});


	text.exit()
		.remove();
	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svgNum.select(".lines").selectAll("polyline")
		.data(pie(pieData), pieKey);


	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {

				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				if (d.data.value / sumall < 0.0236) {
					return [arc.centroid(d2), arc.centroid(d2), arc.centroid(d2)]
				} else {

					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				}
			};
		});

	polyline.exit()
		.remove();

		updatePieTooltips(pieData)

}

function midAngle(d) {
	return d.startAngle + (d.endAngle - d.startAngle) / 2;
}




function initPieTooltips() {
    const slices = $(".slice")

    console.log("bars", slices)

    slices.each(function (index) {

        $('#pieTooltips').append('<div class="pieTooltip tooltips" style="width:230px" id="tooltipPie' +
            (index).toString() + '" role="tooltip"><div class="jjpieTooltip" id="jjtooltipPie' +
            pieSlices[index].replace(/ /g,'') + '"></div><div class="arrow" data-popper-arrow></div></div>')
        // console.log(index+": yo");
    });

    const pieTooltips = $(".pieTooltip")
        .each(function () {
            //console.log(index+": tt");
        });

    //console.log(tooltips)

    piePopperInstance = new Array();

    for (i = 0; i < slices.length; i++) {
        piePopperInstance[i] = Popper.createPopper(slices[i], pieTooltips[i],
            {
                placement: 'right',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 0],
                        },
                    },],
            });
    }

    function hide() {
        //map to all
        for (j = 0; j < slices.length; j++) {
            pieTooltips[j].removeAttribute('data-show');
        }
    }

    function hovered(j) {

        pieTooltips[j].setAttribute('data-show', '');
        piePopperInstance[j].update();;
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach(event => {
        for (j = 0; j < slices.length; j++) {

            slices[j].addEventListener(event, hovered.bind(null, j));
            pieTooltips[j].addEventListener(event, hovered.bind(null, j));
        }
    });



    hideEvents.forEach(event => {
        //map to all?
        for (j = 0; j < slices.length; j++) {
            //    console.log("i",j)
            slices[j].addEventListener(event, hide);
            pieTooltips[j].addEventListener(event, hide);
        }
    });

}



function updatePieTooltips(pieData) {
	console.log(pieData)
total=0
for(index in pieData){
	total+=pieData[index].value
}

for(index in pieData){
	//console.log(index)
		category=pieData[index].category
		value=pieData[index].value;
		// try{console.log(value)}
		// catch(error){console.log(index,error)}
		tooltipHeader = '<div class="col-lg-12"><h4 style="color:#0DB14B">' +category + '</h4></div>' +
		'<div class="col-lg-12">' + nFormatter(value,2)+" USD"+ '</div>' +
		'<div class="col-lg-12">' + nFormatter(value/total*100,2)+"% of total budget"+ '</div>'

		$('#jjtooltipPie' + category.replace(/ /g,'')).html('<div class="row">' + tooltipHeader + "</div>")
	
	
	}

}
pieSlices={0:"Caribbean",1:"AIS",2:"Pacific",3:"Vertical Funds",4:"Donor Countries",5:"Programme Countries",6:"UN Pooled Funds",7:"UN Agencies",8:"European Union",9:"Other"}