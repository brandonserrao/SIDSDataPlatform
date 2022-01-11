import {sidsDict} from './vizEngineGlobals'

export function isNumeric(el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
   // return n === +n && n !== (n|0);
}

export function sort_object(obj) {
    // console.log(obj)
    let items = Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    let sorted_obj = {}
    items.map(function(value, index) {
        var use_key = value[0];
        let use_value = index;//v[1]
        sorted_obj[use_key] = use_value;
    });

    return (sorted_obj)

}

export function getBoundingBox(selection) {
    /* get x,y co-ordinates of top-left of bounding box and width and height */
    let element = selection.node(),
        bbox = element.getBBox(),
    cx = bbox.x + bbox.width / 2,
    cy = bbox.y + bbox.height / 2;
    return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
}
//
// function countryClicked(d, country) {
//     $(".mdl-tabs__tab").removeClass("selectedPage")
//     $("#countryViewTab").addClass("selectedPage")
//     $("#countryViewTab h5").click()
// }

export function regionColors(region, member) {
    region = region.toLowerCase()
    if (member == "N") { return "black" }

    else if (region == "caribbean") { return "c008080"; }
    else if (region == "pacific") { return "cF0A500"; }
    else if (region == "ais") { return "c97002B"; }
    else { return "black" }
}
//
export  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


// function zoomed(dat, country) {
    //console.log("zooming")

    /* Thanks to http://complextosimple.blogspot.ie/2012/10/zoom-and-center-with-d3.html 	*/
    /* for a simple explanation of transform scale and translation  			*/
    /* This function centers the county's bounding box in the map container		*/
    /* The scale is set to the minimum value that enables the county to fit in the	*/
    /* container, horizontally or vertically, up to a maximum value of 3.			*/
    /* If the full width of container is not required, the county is horizontally centred */
    /* Likewise, if the full height of the container is not required, the county is	*/
    /* vertically centred.								*/

    // var xy = getBoundingBox(d);	/* get top left co-ordinates and width and height 	*/




    // // if (d.classed("countryActive")) {	/* if county is active reset map scale and county colour */

    // ///open country profile page to that country

    // main_chart_svg.selectAll("#viewport")
    //   .transition().duration(750).attr("transform", "scale(" + defaultScale + ")");
    // lastActive = "";

    // // console.log(country)

    // d.attr("class", function (d) {
    //   return quantize(rateById.get(this.id))
    // });
    //
    // setSelectedId(document.getElementById('countryCategory'), "all")
    // setSelectedId(document.getElementById('countrySelect'), country)
    // $("#countryViewTab").click()
    //
    // $(".mdl-tabs__tab").removeClass("selectedPage")
    // $("#countryViewTab").addClass("selectedPage")
    //
    //
    // console.log("clicked on country ")
    //




    // } else {			/* zoom into new county      */
    //   // console.log("huh")
    //   // resetAll();			/* reset county colors	     */

    //   /* scale is the max number of times bounding box will fit into container, capped at 3 times */
    //   scale = Math.min(mw / xy[1], mh / xy[3], 3);

    //   /* tx and ty are the translations of the x and y co-ordinates */
    //   /* the translation centers the bounding box in the container  */
    //   var tx = -xy[0] + (mw - xy[1] * scale) / (2 * scale);
    //   var ty = -xy[2] + (mh - xy[3] * scale) / (2 * scale);

    //   main_chart_svg.selectAll("#viewport")
    //     .transition().duration(750).attr("transform", "scale(" + scale + ")translate(" + tx + "," + ty + ")");
    //     d.node().classList.add("countryActive");
    //   console.log(d)
    //   lastActiveCountry = d.attr("id");
    // }
// }
//
//
// function filterObject(obj, arr) {
//     newObj = {}
//     Object.keys(obj).forEach((key) => {
//         if (arr.includes(key)) {
//             newObj[key] = obj[key];
//         };
//     });
//     return newObj;
// }
//
//
export function getIsoByName(countryName) {
  return Object.keys(sidsDict).find(key => sidsDict[key] === countryName);
}
export function nFormatter(num, digits) {
  let si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" }
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function normalizeIndex(val,min,max){
    let normValue;
    if(max>min){
      normValue=(val-min)/(max-min)
    }
    else{
        normValue=0
    }
    return normValue
}
