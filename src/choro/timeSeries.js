import * as d3 from 'd3';
import paper from 'paper'
import { interpolatePath } from 'd3-interpolate-path';

paper.setup(document.getElementById("myCanvas"));

import { countryGroupJson, countryColors } from './countryGroup';

import { nFormatter } from './vizEngineHelperFunctions'

const countryGroup = countryGroupJson;
const countryNames = Object.assign({}, ...Object.values(countryGroup));

export function initTimeSeries() {
    this.timeColor = d3
      .scaleOrdinal()
      .domain(countryColors.map((d) => d.country))
      .range(countryColors.map((d) => d.color));
}

//
export function updateTimeChart({ dataset, optionSelected }) {
  let rootThis = this;
 // console.log({ dataset, optionSelected })
 // console.log(dataset)
  const timeSeriesContainer = d3.select("#timeSeriesContainer");
  const width = 900;
  const height = 560;
  const margin = { top: 20, right: 220, bottom: 50, left: 50 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const timeVariable = 800;

  var isLoading = true;
  const dotRadius = 4;
  const lineStrokWidth = 2.5;

  const dotHoverRadius = dotRadius * 2;
  const lineHoverWidth = lineStrokWidth * 3;

  //data
  const timeData = dataFilter(dataset);
//  console.log(timeData)
  if (timeData.length == 0) return;
  const allData = timeData.map((d) => d.data).flat();

  //scale
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(allData, (d) => d.value))
    .nice()
    .range([innerHeight, 0]);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(allData, (d) => d.year))
    .range([0, innerWidth]);

  //
  const timeSvg = timeSeriesContainer
    .selectAll("svg")
    .data(["svg"])
    .join("svg")
    .attr("width", "100%")
    .attr("viewBox", [0, 0, width, height]);

  //

  const gXAxis = timeSvg
    .selectAll("g.x-axis")
    .data([0])
    .join("g")
    .attr("class", "x-axis")
    .attr(
      "transform",
      `translate(${margin.left},${margin.top + innerHeight})`
    )
    .call(xAxis);

  timeSvg
    .selectAll("g.y-axis")
    .data([0])
    .join("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(yAxis);

  const gMark = timeSvg
    .selectAll("g.mark")
    .data([0])
    .join("g")
    .attr("class", "mark")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(lineMark)
    .call(hoverMark);

  const gLegend = timeSvg
    .selectAll("g.legend")
    .data([0])
    .join("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(${margin.left + innerWidth},${margin.top})`
    )
    .call(legend);

  const gHoverValueText = timeSvg
    .selectAll("g.hover-value-text")
    .data([0])
    .join("g")
    .attr("class", "hover-value-text")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call((g) => {
      g.selectAll("text.hover-value-text")
        .data(["hover-value-text"])
        .join("text")
        .attr("class", "hover-value-text")
        .attr("dominant-baseline", "auto")
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("font-weight", "bold")
        .attr("cursor", "default")
        .attr("visibility", "hidden");
    });

  const timeSeriesTooltip = timeSeriesContainer
    .selectAll("div.timeSeriesTooltip")
    .style("visibility", "hidden");

  timeSvg.on("mousemove", mouseMoveHandler).on("mouseleave", mouseLeaveHandler);

  function lineMark(g) {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));

    //def
    const path = g
      .selectAll("path.mark-line")
      .data(timeData, (d) => d.country);

    const pathEnter = path
      .enter()
      .append("path")
      .attr("class", "mark-line")
      .attr("fill", "none")
      .attr("stroke", (d) => rootThis.timeColor(d.country))
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", lineStrokWidth)
      .attr("cursor", "pointer")
      .attr("opacity", 0)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) => xScale(d.year))
          .y(innerHeight)(d.data)
      );

    path
      .merge(pathEnter)
      .transition()
      .duration(timeVariable)
      .attrTween("opacity", function () {
        const prev = d3.select(this).attr("opacity");
        const next = 1;
        return d3.interpolate(prev, next);
      })
      .attrTween("d", function (d) {
        const prev = d3.select(this).attr("d");
        const next = lineGenerator(d.data);

        d.path = new paper.Path(next);
        return interpolatePath(prev, next);
      })
      .on("interrupt cancel", function () {
        d3.select(this)
          .attr("d", (d) => lineGenerator(d.data))
          .attr("opacity", 1);
        isLoading = false;
      })
      .on("end", function () {
        isLoading = false;
      });

    path.exit().remove();
  }

  function lineMouseEnter(dd) {
    if (isLoading) return;

    // if (hoverOnDot) {
    //   lineMouseLeave();
    //   return;
    // }

    //self
    const targetLine = gMark
      .selectAll("path.mark-line")
      .filter((d) => d.country == dd.country);

    targetLine
      .attr("stroke-width", lineStrokWidth * 1.5)
      .attr("opacity", 1);

    targetLine.raise();

    //else
    gMark
      .selectAll("path.mark-line")
      .filter((d) => d.country !== dd.country)
      .attr("stroke-width", lineStrokWidth)
      .attr("opacity", 0.1);

    //other
    gMark
      .selectAll("text.hover-country-text")
      .attr("fill", rootThis.timeColor(dd.country))
      .attr("visibility", "visible")
      .text(countryNames[dd.country]);

    //
    gMark
      .selectAll("circle.line-hover-dot")
      .data(dd.data)
      .join("circle")
      .attr("class", "line-hover-dot")
      .attr("stroke", "none")
      .attr("opacity", 0)
      .attr("fill", rootThis.timeColor(dd.country))
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", dotRadius)
      .attr("opacity", 1);

    //
    gLegend
      .selectAll("line")
      .attr("opacity", 0.1)
      .filter((d) => d.country == dd.country)
      .attr("opacity", 1);

    gLegend
      .selectAll("text")
      .attr("opacity", 0.1)
      .attr("font-size",11)
      .attr("font-weight","regular")
      .filter((d) => d.country == dd.country)
      .attr("opacity", 1)
      .attr("font-size",14)
      .attr("font-weight","bold");

  }

  function lineMouseLeave() {
    if (isLoading) return;

    //
    gMark
      .selectAll("path.mark-line")
      .attr("stroke-width", lineStrokWidth)
      .attr("opacity", 1);

    //other
    gMark.selectAll("text.hover-country-text").attr("visibility", "hidden");
    gMark.selectAll("circle.line-hover-dot").attr("opacity", 0);
    //
    gLegend.selectAll("line").attr("opacity", 1);

    gLegend.selectAll("text").attr("opacity", 1);
  }

  function hoverMark(g) {
    //
    g.selectAll("line.hover-line")
      .data(["line"])
      .join("line")
      .attr("class", "hover-line")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", 4)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("visibility", "hidden");

    //dot
    g.selectAll("circle.hover-dot")
      .data([0])
      .join("circle")
      .attr("class", "hover-dot")
      .attr("stroke", "none")
      .attr("visibility", "hidden")
      .attr("cursor", "pointer")
      .attr("r", dotRadius);

    //
    g.selectAll("text.hover-country-text")
      .data(["hover-country-text"])
      .join("text")
      .attr("class", "hover-country-text")
      .attr("dominant-baseline", "auto")
      .attr("text-anchor", "middle")
      .attr("font-size", 1)
      .attr("font-weight", "bold")
      .attr("x", innerWidth / 2)
      .attr("y", margin.top * -0.5)
      .attr("visibility", "hidden");

    g.selectAll("circle.line-hover-dot").remove();
  }

  let prevClosest = undefined;
  function mouseMoveHandler() {
    if (isLoading) return;

    let [mouseX, mouseY] = [d3.event.offsetX, d3.event.offsetY];

    mouseX -= margin.left;
    mouseY -= margin.top;



    let state =
      0 <= mouseX &&
      mouseX <= innerWidth &&
      0 <= mouseY &&
      mouseY <= innerHeight;

    if (state) {
      highlightCol();
    } else if (d3.event.target.className.baseVal == "legend") {
      return;
    } else {
      mouseLeaveHandler();
    }

    function highlightCol() {
      //closestPoint
      let iMin;
      let distMin = Number.POSITIVE_INFINITY;
      allData.forEach((d, i) => {
        const dist = Math.hypot(
          xScale(d.year) - mouseX,
          yScale(d.value) - mouseY
        );
        iMin = dist < distMin ? i : iMin;
        distMin = dist < distMin ? dist : distMin;
      });

      const closestPoint = allData[iMin];

      const closestPointDist = Math.hypot(
        xScale(closestPoint.year) - mouseX,
        yScale(closestPoint.value) - mouseY
      );

      //closestLine
      const point = new paper.Point([mouseX, mouseY]);

      iMin;
      distMin = Number.POSITIVE_INFINITY;
      timeData.forEach((d, i) => {
        const dist = point.getDistance(d.path.getNearestPoint(point));
        iMin = dist < distMin ? i : iMin;
        distMin = dist < distMin ? dist : distMin;
      });
      const cloestLine = timeData[iMin];
      const cloestLineDist = point.getDistance(
        cloestLine.path.getNearestPoint(point)
      );

      //if dot or line or not
      if (closestPointDist <= dotHoverRadius) {
        //enlarge dot
        gMark
          .selectAll("circle.hover-dot")
          .attr("visibility", "visible")
          .transition()
          .duration(timeVariable)
          .attrTween("r", function () {
            const prev = d3.select(this).attr("r");
            return d3.interpolate(prev, dotRadius * 1.5);
          })
          .on("interrupt cancel", function () {
            d3.select(this).attr("r", dotRadius * 1.5);
          });

        timeSeriesTooltip
          .style("visibility", "visible")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px")
          .call((div) =>
            div
              .selectAll("div")
              .data([
                {
                  key: "Country",
                  value: countryNames[closestPoint.country],
                },
                { key: "Year", value: closestPoint.year },
                { key: "Value", value: closestPoint.value },
              ])
              .join("div")
              .text((d) => d.key + " : " + d.value)
          );
          console.log("tooltipTime")
      } else {
        //dot normal size
        gMark
          .selectAll("circle.hover-dot")
          .transition()
          .duration(timeVariable)
          .attrTween("r", function () {
            const prev = d3.select(this).attr("r");
            return d3.interpolate(prev, dotRadius);
          })
          .on("interrupt cancel", function () {
            d3.select(this).attr("r", dotRadius);
          });

        timeSeriesTooltip.style("visibility", "hidden");
      }

      gMark.selectAll("circle.hover-dot").raise();

      if (cloestLineDist <= lineHoverWidth) {
        lineMouseEnter(cloestLine);
      } else {
        lineMouseLeave();
      }

      gMark
        .selectAll("path.mark-line")
        .filter((d) => d.country == cloestLine.country)
        .raise();

      //col
      if (
        prevClosest !== undefined &&
        prevClosest.year == closestPoint.year &&
        prevClosest.country == closestPoint.country
      ) {
        return;
      }

      //hover line move
      gMark
        .select("line.hover-line")
        .attr("visibility", "visible")
        .attr("x1", xScale(closestPoint.year))
        .attr("x2", xScale(closestPoint.year));

      gMark
        .selectAll("circle.hover-dot")
        .attr("cx", xScale(closestPoint.year))
        .attr("cy", yScale(closestPoint.value))
        .attr("fill", rootThis.timeColor(closestPoint.country))
        .attr("visibility", "visible");

      gHoverValueText
        .selectAll("text.hover-value-text")
        .attr("visibility", "visible")
        .attr("fill", rootThis.timeColor(closestPoint.country))
        .attr(
          "x",
          xScale(closestPoint.year) + 100 >= innerWidth
            ? xScale(closestPoint.year) - 30
            : xScale(closestPoint.year) + 30
        )
        .attr("y", yScale(closestPoint.value) - 20)
        .text(nFormatter(closestPoint.value,3));

      const tickText = gXAxis
        .selectAll("g.tick")
        .selectAll("text")
        .attr("opacity", 1);

      tickText
        .transition()
        .duration(timeVariable)
        .attrTween("fill", function () {
          const prev = d3.select(this).attr("fill");
          return d3.interpolate(prev, "lightgrey");
        })
        .on("interrupt cancel", function () {
          d3.select(this).attr("fill", "lightgrey");
        });

      tickText.filter((d) => d == closestPoint.year).attr("opacity", 0);

      gXAxis
        .selectAll("text.hover-x-axis")
        .data(["hover-x-axis"])
        .join("text")
        .attr("class", "hover-x-axis")
        .attr("dominant-baseline", "hanging")
        .attr("text-anchor", "middle")
        .attr("fill", "grey")
        .attr("font-size", 11)
        .attr("x", xScale(closestPoint.year))
        .attr("y", 7)
        .text(closestPoint.year);

      prevClosest = closestPoint;
    }
  }

  function mouseLeaveHandler() {
    lineMouseLeave();

    gMark.selectAll("line.hover-line").attr("visibility", "hidden");

    gMark.selectAll("circle.line-hover-dot").attr("opacity", 0);

    gMark
      .selectAll("circle.hover-dot")
      .attr("r", dotRadius)
      .attr("visibility", "hidden");

    gHoverValueText
      .selectAll("text.hover-value-text")
      .attr("visibility", "hidden");

    gXAxis.selectAll("text.hover-x-axis").remove();

    gXAxis
      .selectAll("text")
      .attr("opacity", 1)
      .transition()
      .duration(timeVariable)
      .attrTween("fill", function () {
        const prev = d3.select(this).attr("fill");
        return d3.interpolate(prev, "grey");
      })
      .on("interrupt cancel", function () {
        d3.select(this).attr("fill", "grey").attr("opacity", 1);
      });
    timeSeriesTooltip.style("visibility", "hidden");
  }
  function legend(g) {
    const fontSize = 10;
    const legendData = legendLayout(timeData, fontSize);

    g.selectAll("line.link")
      .data(legendData)
      .join("line")
      .attr("class", "link")
      .attr("stroke", (d) => rootThis.timeColor(d.country))
      .attr("stroke-width", 1)
      .attr("x1", 3)
      .attr("x2", 30)
      .attr("y1", (d) => d.y0)
      .attr("y2", (d) => d.y);

    g.selectAll("line.h")
      .data(legendData)
      .join("line")
      .attr("class", "h")
      .attr("stroke", (d) => rootThis.timeColor(d.country))
      .attr("stroke-width", 1)
      .attr("x1", 30)
      .attr("x2", 40)
      .attr("y1", (d) => d.y)
      .attr("y2", (d) => d.y);

    g.selectAll("text")
      .data(legendData)
      .join("text")
      .attr("class", "legend")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "start")
      .attr("fill", (d) => rootThis.timeColor(d.country))
      //this is the font size for the country names in the legend
      .attr("font-size", 10)
      .attr("x", 43)
      .attr("y", (d) => d.y)
      .attr("cursor", "pointer")
      .text((d) => countryNames[d.country]);

    g.selectAll("text")
      .on("mouseenter", function (dd) {
        lineMouseEnter(dd);
      })
      .on("mouseleave", function () {
        lineMouseLeave();
      });
  }

  function xAxis(g) {
    g.transition()
      .duration(timeVariable)
      .call(d3.axisBottom(xScale).tickFormat((d) => d));
    g.selectAll("text").attr("fill", "grey");
    g.selectAll("line").attr("stroke", "grey");
    g.selectAll(".domain").attr("stroke", "grey");
  }

  function yAxis(g) {
    g.transition().duration(timeVariable).call(d3.axisLeft(yScale));
    g.selectAll("text").attr("fill", "grey");
    g.selectAll("line").attr("stroke", "grey");
    g.selectAll(".domain").attr("stroke", "grey");
  }

  function dataFilter(dataset) {
    const { datasetOption, countryGroupOption } = optionSelected;
    //console.log(dataset)
    const filtered0 = dataset[datasetOption]["data"];

    if (countryGroupOption == "All") {
      return filtered0;
    } else {
      const countries = Object.keys(countryGroup[countryGroupOption]);
      return filtered0.filter((d) => countries.includes(d.country));
    }
  }

  function legendLayout(rawData) {
    const minLineHeight = Math.min(16, innerHeight / rawData.length);

    var dat = rawData
      .map((d) => ({
        country: d.country,
        data: d.data,
        y0: yScale(d.data[d.data.length - 1].value),
        y: yScale(d.data[d.data.length - 1].value),
      }))
      .sort((a, b) => a.y0 - b.y0);

      dat.forEach((d, i) => {
      d.dy = i == 0 ? dat[0].y : d.y0 - dat[i - 1].y0;
    });

    //
    let iMin;
    let vMin = Number.POSITIVE_INFINITY;
    dat.forEach((d, i) => {
      iMin = d.dy < vMin ? i : iMin;
      vMin = d.dy < vMin ? d.dy : vMin;
    });
    const iMinDy = iMin;

    if (dat[iMinDy].dy < minLineHeight) {
      //extend and update dy
      dat.forEach((d, i) => {
        d.dy = d.dy < minLineHeight ? minLineHeight : d.dy;
        d.y = i == 0 ? d.y : dat[i - 1].y + d.dy;
      });
    }

    if (dat[dat.length - 1].y > innerHeight) {
      //shrink
      const yNeed = dat[dat.length - 1].y - innerHeight;

      const chosen = dat.filter((d) => d.dy > minLineHeight);

      chosen.forEach((d) => {
        d.dyCan = d.dy - minLineHeight;
      });
      chosen.forEach((d) => {
        d.dy = d.dy - (yNeed * d.dyCan) / d3.sum(chosen, (d) => d.dyCan);
      });

      dat.forEach((d, i) => {
        d.y = i == 0 ? d.dy : dat[i - 1].y + d.dy;
      });
    }

    for (let j = 0; j < dat.length - 1; j++) {
      for (let i = 0; i < dat.length - 2; i++) {
        let d = dat[i];
        let gap = d.y - d.y0;
        let roomUp = dat[i].dy;
        let roomDown = dat[i + 1].dy;

        if (gap > 0 && roomUp > minLineHeight) {
          let can = roomUp - minLineHeight;
          d.y = can >= gap ? d.y0 : d.y - can;
        }

        if (gap < 0 && roomDown > minLineHeight) {
          let can = roomDown - minLineHeight;
          d.y = can >= -gap ? d.y0 : d.y + can;
        }

        d.dy = i == 0 ? d.y : d.y - dat[i - 1].y;
      }
    }

    return dat;
  }
}

export function parse(rawDataset) {

  Object.keys(rawDataset).forEach((key) => {
    rawDataset[key]["data"] = processData(rawDataset[key]["data"]);

  });
 // console.log(rawDataset)
  return rawDataset;

  function processData(rawData) {
    const numberData = [];

    Object.keys(rawData).forEach((year) => {
      Object.keys(rawData[year]).forEach((country) => {
        const value = rawData[year][country];
        if (isNumber(year)) numberData.push({ country, year, value });
      });
    });

    const rst = [];
    const countries = [...new Set(numberData.map((d) => d.country))];
    countries.forEach((c) => {
      const v = numberData.filter((d) => d.country == c);

      rst.push({
        country: c,
        data: v.map((e) => ({
          country: c,
          year: e.year * 1,
          value: e.value * 1,
        })),
      });
    });

    return rst;
  }

  function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }
}
