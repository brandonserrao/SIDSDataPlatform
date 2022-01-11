import * as d3 from 'd3';
import {nFormatter} from './vizEngineHelperFunctions'

export function RadarChart(parent_selector, options, countryList, pillar, dataFull) {
	let data = dataFull[pillar]

	const wrap = (text, width) => {
		text.each(function () {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

				word  =  words.pop();
				while (word) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
					word  =  words.pop();
				}
		});
	}//wrap

	const cfg = {
		w: 500,				//Width of the circle
		h: 500,				//Height of the circle
		margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
		levels: 3,				//How many levels or inner circles should there be drawn
		maxValue: 42, 			//What is the value that the biggest circle will represent
		labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
		wrapWidth: 80, 		//The number of pixels after which a label needs to be given a new line
		opacityArea: 0.35, 	//The opacity of the area of the blob
		dotRadius: 4, 			//The size of the colored circles of each blog
		opacityCircles: 0.1, 	//The opacity of the circles of each blob
		strokeWidth: 2, 		//The width of the stroke around each blob
		roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
		color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
		format: '.2%',
		unit: '',
		legend: false,
		spin: 0,
		textFormat: 1
	};

	//Put all of the options into a variable called cfg
	if ('undefined' !== typeof options) {
		for (var i in options) {
			if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
		}//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	let maxValue = 0;
	for (let j = 0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = Math.max(cfg.maxValue, maxValue);



	const allAxis = data[0].axes.map((i) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
		// Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total,		//The width in radians of each "slice"
		HALF_PI = Math.PI / 2;

	let rScaleNormal = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]),
		rScale;
	//Scale for the radius
	if (pillar == "MVI2"||pillar=="customIndex") {
		rScale = rScaleNormal;
	} else {
		rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([maxValue, 1]);
	}
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////
	const parent = d3.select(parent_selector);

	//Remove whatever chart with the same id/class was present before
	parent.select("svg").remove();

	//Initiate the radar chart SVG
	let svg = parent.append("svg")
		.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
		.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
		.attr("class", "radar")
		.attr("display", "inline-block")
		.attr("margin", "auto")
		.attr("pointer-events","none");

	//Append a g element
	let g = svg.append("g")
		.attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////

	//Filter for the outside glow
	let filter = g.append('defs').append('filter').attr('id', 'glow');
	filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
	let feMerge = filter.append('feMerge');
	feMerge.append('feMergeNode').attr('in', 'coloredBlur');
	feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////


	console.log("circles")

	//Wrapper for the grid & axes
	let axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
		.data(d3.range(1, (cfg.levels + 1)).reverse())
		.enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter", "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
		.data(d3.range(1, (cfg.levels + 1)).reverse())
		.enter().append("text")
		.attr("class", "axisLabel")
		.attr("x", 4)
		.attr("y", d => -d * radius / cfg.levels)
		.attr("dy", "0.4em")
		.style("font-size", "10px")
		.attr("fill", "black")

	if (pillar == "MVI2"||pillar=="customIndex") {
		axisGrid.selectAll(".axisLabel").text(d => nFormatter(maxValue * d / cfg.levels))
	}
	else {
		axisGrid.selectAll(".axisLabel").text(d => rankFormat(nFormatter(maxValue - maxValue * d / cfg.levels + 1)))
	}

	//.text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////

	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScaleNormal(maxValue * 1.1) * Math.cos(angleSlice * i - HALF_PI - cfg.spin))
		.attr("y2", (d, i) => rScaleNormal(maxValue * 1.1) * Math.sin(angleSlice * i - HALF_PI - cfg.spin))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px")
		.style("pointer-events","none");

	if (pillar != "customIndex") {
		//Append the labels at each axis
		// let sourceLink
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "10px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", (d, i) => cfg.textFormat * rScaleNormal(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - HALF_PI - cfg.spin))
			.attr("y", (d, i) => -15 / cfg.textFormat ** 3 + rScaleNormal(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - HALF_PI - cfg.spin))
			.text(d => d)
			.call(wrap, cfg.wrapWidth)
			.style("pointer-events","auto")
			// .on('mouseover', function (d) {
			// 	try { sourceLink = metadata[0][d].sourceLink }
			// 	catch (error) { sourceLink = "Link" }
			// 	try {
			// 		pillarData = allKeyData[countryList[0]][pillar]
			// 		for (el in pillarData) {
			// 			if (pillarData[el].axis == d) {
			// 				indicatorValue = pillarData[el].value
			// 			}
			// 		}
			//
			// 	}
			// 	catch (error) { indicatorValue = "No Data" }
			//
			// 	try {
			// 		sourceName = metadata[0][d].sourceName;
			//
			// 	}
			//
			// 	catch (error) { sourceName = "Source" }
			// 	console.log(metadata)
			// 	try {
			//
			// 		longDefinition = metadata[0][d].longDefinition
			// 	}
			// 	catch (error) {
			// 		longDefinition = d
			// 	}
			//
			//
			//
			// 		console.log(dataFull[pillar.slice(0, -4)][0])
			// 		value = parseFloat(dataFull[pillar.slice(0, -4)][0].axes.filter(obj => { return obj.axis === d })[0].value)//[
			// 			if(value>0.001){value=value.toFixed(3)}
			// 			else{value=value.toString()}
			// 		pillarColor = pillarColors[pillar.slice(0, -4)]
			// 		document.getElementById('tooltipIndicatorContent').innerHTML = '<h4 style="color:' + pillarColor + '">' + d +
			// 			'</h4><h6 style="display:inline">Definition: ' + '</h6><p>' + longDefinition + '</p><h6 style="margin-top:4px;">' + "Source: " + sourceName + '</h6><a href="' + sourceLink +
			// 			'"><h6 style="color:black">' + "Rank: " + rankFormat(indicatorValue.toString()) + '</h6></a>' +
			// 			'<h6 style="color:blue">' + "Value: " + value  + '</h6></a>';
			//
			//
			// 	tooltip3.setAttribute('data-show', '');
			// 	keyIndicatorPopperInstance[d].update();
			//
			// })
			// .on('mouseout', function (d, i) {
			// 	tooltip3.removeAttribute('data-show');
			// })
			// .on('click', function (d, i) {
			// 	window.open(metadata[0][d].sourceLink, '_blank');
// ///change what happens here to:
// //select that indicator in dropdown
// //click on countryDataTab


// // setSelectedIndicator(document.getElementById('countryCategory'), "all")
// // setSelectedIndicatorCategory(document.getElementById('countrySelect'), country)
// $("#countryDataTab h5").click()

// $(".mdl-tabs__tab").removeClass("is-active")
// $("#countryDataTab").addClass("is-active")


// console.log("clicked on country ")



			// });

	}

	// const tooltip3 = $("#tooltipIndicator")[0]
	//
	// axis.selectAll("text").each(function (d, i) {
	// 	//   console.log(d);
	// 	//   console.log(this);
	//
	// 	keyIndicatorPopperInstance[d] = Popper.createPopper(this, tooltip3, {
	// 		placement: 'top', modifiers: [
	// 			{ name: 'offset', options: { offset: [0, 8], }, },],
	// 	});
	//
	// });

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d, i) => i * angleSlice);

	//   if(cfg.roundStrokes) {
	// 	  radarLine.curve(d3.curveCardinalClosed)
	//   }

	//Create a wrapper for the blobs
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds

	if (pillar == "customIndex") {

		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", d => radarLine(d.axes))
			.style("fill", (d, i) => cfg.color(i))
			.style("fill-opacity", cfg.opacityArea)
			.style("pointer-events","auto")
			.on('mouseover', function (d) {
				//Dim all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1);

					if (d.name == "Environmental") {

					//Bring back the hovered over blob
					d3.select(this)
						.transition().duration(100)
						.style("fill-opacity", 0.7);
				}
				else if (d.name == "Geographic") {
					parent.selectAll(".radarArea").filter(function (d) {
						console.log(d)
						return d.name == "Geographic" || d.name == "Environmental"
					})
						.transition().duration(200)
						.style("fill-opacity", 0.7);
					//Bring back the hovered over blob
				}
				else if (d.name == "Economic") {
					parent.selectAll(".radarArea").filter(function (d) {
						//console.log(d)
						return d.name == "Geographic" || d.name == "Environmental" || d.name == "Economic"
					})
						.transition().duration(200)
						.style("fill-opacity", 0.7);
					//Bring back the hovered over blob
				}

				else if (d.name == "Financial") {
					parent.selectAll(".radarArea")
						.transition().duration(200)
						.style("fill-opacity", 0.7);
					//Bring back the hovered over blob
				}

				//tooltip with name of country
				tooltip2
					.attr('x', 0)
					.attr('y', 0)
					.transition()
					.style('display', 'block')
					.text(function () {
						//console.log(d)
						return d.name
					});//["Profile"].Country
			})
			.on('mouseout', () => {
				//Bring back all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", cfg.opacityArea);
				tooltip2.transition()
					.style('display', 'none').text('');
			});
	}

	else {
		console.log("job=g")
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", d => radarLine(d.axes))
			.style("fill", (d, i) => cfg.color(i))
			.style("fill-opacity", cfg.opacityArea)
			.style("pointer-events","auto")
			.on('mouseover', function () {

				console.log("job=gsdfsdf")

				//Dim all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1);
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);

				//tooltip with name of country
				// tooltip2
				// 	.attr('x', 0)
				// 	.attr('y', 0)
				// 	.transition()
				// 	.style('display', 'block')
				// 	.text(function () {
				// 		console.log(d)
				// 		return allKeyData[d.name]["Profile"].Country
				// 	});
			})
			.on('mouseout', () => {
				//Bring back all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", cfg.opacityArea);
				tooltip2.transition()
					.style('display', 'none').text('');
			});
	}

	const tooltip2 = g.append("text")
		//.attr("class", "tooltip")
		.attr('x', 0)
		.attr('y', 0)
		.attr("class", "spiderTooltip")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.style('display', 'none')
		.attr("text-anchor", "middle")
		.attr("z-index", 100)
		.attr("dy", "0.35em");






	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function (d) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d, i) => cfg.color(i))
		.style("fill", "none")
		.style("filter", "url(#glow)")
		.style("pointer-events","none");

	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - HALF_PI - cfg.spin))
		.attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - HALF_PI - cfg.spin))
		.style("fill", "#ffffff")//(d) => cfg.color(d.id))
		.style("fill-opacity", 0.8)
		.style("pointer-events","none");

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	//Wrapper for the invisible circles on top
	const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - HALF_PI - cfg.spin))
		.attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - HALF_PI - cfg.spin))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function (d) {
			tooltip
				.attr('x', this.cx.baseVal.value)
				.attr('y', this.cy.baseVal.value - 10)
			if (pillar == "MVI") {
				tooltip.transition()
					.style('display', 'block')
					.text(nFormatter(d.value,2));
			}else if (pillar=="customIndex") {
				tooltip.transition()
					.style('display', 'block')
					.text(nFormatter(d.value,2)+", "+d.axis);
			} else {
				tooltip.transition()
					.style('display', 'block')
					.text(function () {
						let value = dataFull[pillar.slice(0, -4)][0].axes.filter(obj => { return obj.axis === d.axis })[0].value
						if (isNaN(value)) {
							console.log(value)
							return ""

						}

						else {
							return nFormatter(value,2) + ", " + rankFormat(d.value.toString()) + cfg.unit;
						}
					})
			}

		})
		.on("mouseout", function () {
			tooltip.transition()
				.style('display', 'none').text('');
		});

	const tooltip = g.append("text")
		.attr('x', 0)
		.attr('y', 0)
		.attr("class", "spiderTooltip")
		.style("font-size", "14px")
		.style("font-weight", "bold")
		.style('display', 'none')
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")

	//Remove whatever chart with the same id/class was present before
	d3.select("#spiderLegend").select("svg").remove();

	console.log("initiate")

	//Initiate the radar chart SVG
	let svgLegend = d3.select("#spiderLegend").append("svg")
		.attr("width", "100%")
		.attr("height", 40)

	if (cfg.legend !== false && typeof cfg.legend === "object") {
		//console.log("legended")
		let legendZone = svgLegend;//.append('g');
		let names = data.map(el => el.name);
		if (cfg.legend.title) {
			legendZone.append("text")
				.attr("class", "title")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", 70)
				.attr("y", 10)
				.attr("font-size", "10px")
				.attr("fill", "#404040")
				.text(cfg.legend.title);
		}
		let legend = legendZone.append("g")
			//.attr("class", "legend")
			.attr("height", 40)
			.attr("width", "100%")
			.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
			.style("background-color", "red");
		// Create rectangles markers
		legend.selectAll('rect')
			.data(names)
			.enter()
			.append("rect")
			.attr("x", 20)
			.attr("y", 5)
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", (d, i) => cfg.color(i));
		// Create labels
		// legend.selectAll('text')
		// 	.data(names)
		// 	.enter()
		// 	.append("text")
		// 	.attr("x", cfg.w - 52)
		// 	.attr("y", (d, i) => i * 20 + 9)
		// 	.attr("font-size", "9px")
		// 	.attr("fill", "#737373")
		// 	.text(d => allKeyData[d]["Profile"].Country);
	}
	console.log("end")
	return svg;
}

function rankFormat(num) {
	if (num < 20 && num > 10) {
		return num.toString() + "th"
	}
	else if (num.slice(-1) == 1) { return num.toString() + "st" }
	else if (num.slice(-1) == 2) { return num.toString() + "nd" }
	else if (num.slice(-1) == 3) { return num.toString() + "rd" }
	else { return num.toString() + "th" }
}
