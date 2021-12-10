//CODE FOR THE SIDEBAR ON THE LEFT

function check_all_values() {
  //Function to check all the values
  //gets and stores some variables
  //TODO located as the very last function in the main file; unsure intended usage; using var would have redefined variables externally, should check for their existence
  console.log("check_all_values called");

  /* 
  let top_left_nav = $(".tab-nav.active span").text();
  let btnValue = $(".button-option-select-1.active").data("value");
  let datasetSelect = $('select[name="dataset-selection"]').val();
  let layerSelect = $('select[name="layer-selection"]').val();
  //var year = $('input[name="year-selected"]:checked').val();
 */
  //MY INTENDED NONJQUERY REPLACEMENTS
  let top_left_nav = document.querySelector(".tab-nav.active span").textContent;
  let btnValue = document.querySelector(".button-option-select-1.active")[
    "data-value"
  ]; //REF: https://api.jquery.com/data/#:~:text=For%20example%2C%20given-,the%20following%20HTML,-%3A
  let datasetSelect = document.querySelector(
    'select[name="dataset-selection"]'
  ).value;
  let layerSelect = document.querySelector(
    'select[name="layer-selection"]'
  ).value;

  //TODO CLEAN THIS OUT
  //console.log('Top left nav = ' + top_left_nav);
  //console.log('Top right Button = ' + btnValue);
  //console.log('DATASET selection = ' + datasetSelect);
  //console.log('Layer selection = ' + layerSelect);
  //console.log('Year selection = ' + year);
}

function resetData() {
  //-FROM LEFTSIDEBAR

  var w = $("#dataDrop")[0].options;
  //console.log(w);
  for (var z in w) {
    //console.log(w[z].id)
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }

  $("#resetData").toggle();
}

///// DATASET SELECTOR PART
//on data selection from dropdown
$('select[name="dataset-selection"]').on("change", function () {
  //KEY FUNCTION

  console.log(this.selectedOptions[0].innerHTML);

  var legendTitle = document.getElementById("legendTitle");
  var legend = document.getElementById("updateLegend");
  legend.innerHTML = "";
  legendTitle.innerHTML = "";
  var infoBoxTitle = document.getElementById("infoBoxTitle");
  var infoBoxText = document.getElementById("infoBoxText");
  var infoBoxLink = document.getElementById("infoBoxLink");
  infoBoxTitle.innerHTML = "";
  infoBoxText.innerHTML = "";
  infoBoxLink.innerHTML = "";

  if (this.selectedOptions[0].className === "basemap") {
    $("#layer-id").hide();
    $("#icon3d").hide();
    $(".year-timeline-wrapper").hide();
    $(".opacityslider").hide();
    $(".download").hide();
    $("#color-switch").hide();
    map.removeControl(Draw);
    console.log("basemap");

    if (map.getLayer(currentGeojsonLayers.hexSize)) {
      map.removeLayer(currentGeojsonLayers.hexSize);
    }

    var lyr = this.selectedOptions[0].innerHTML;
    legend.innerHTML = "";
    legendTitle.innerHTML = "";
    infoBoxTitle.innerHTML = lyr;
    infoBoxText.innerHTML =
      "Satellite Imagery from Mapbox, NASA MODIS, Landsat 5 & 7, and Maxar";
    infoBoxLink.innerHTML =
      '<a href="https://www.mapbox.com/maps/satellite" target="_blank">Source</a>';

    var element = document.getElementById("histogram");
    if (typeof element != "undefined" && element != null) {
      $("#histogram").remove();
    }

    //if (map.getStyle().name != 'Mapbox Satellite Streets') {

    var thisStyle = _.find(styles, function (o) {
      return o.title === "Satellite With Labels";
    });
    map.setStyle(thisStyle.uri);
    //addHexSource()
    //addLabels();
    map.once("idle", function () {
      map.removeLayer("admin-1-boundary");
      map.removeLayer("road-label");
      map.removeLayer("road-number-shield");
      map.removeLayer("road-exit-shield");
      map.removeLayer("admin-1-boundary-bg");
      map.removeLayer("airport-label");
    });
    console.log("hi");
    //}

    //addLabels();
    var layers = map.getStyle().layers;

    if (layers.length <= 3) {
      firstSymbolId = null;
    } else {
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol") {
          firstSymbolId = layers[i].id;
          break;
        }
      }
    }
  } else if (
    this.selectedOptions[0].innerHTML === "GDP per Capita" ||
    this.selectedOptions[0].innerHTML === "Population Density"
  ) {
    //map.setPaintProperty(currentGeojsonLayers.hexSize,'fill-opacity', 0.0)
    console.log(this.selectedOptions[0].innerHTML);
    $(".year-timeline-wrapper").show(); //show the timeslider
    $("#layer-id").hide();
    //$('.opacityslider').show()
    //$('.download').show()
    //$('#color-switch').show()
    //$('#icon3d').show()

    if (this.selectedOptions[0].innerHTML === "Population Density") {
      //$('#icon3d').show()
    }

    var layers = [];
    //console.log(this.selectedOptions[0])
    for (var x in allLayers) {
      if (allLayers[x].title === this.selectedOptions[0].innerHTML) {
        //console.log(allLayers[x]);
        layers.push(allLayers[x]);
      }
    }
    updateTime(layers);
    //addToLayersDrop(layers);
  } else if (
    this.selectedOptions[0].innerHTML === "Food Insecurity" ||
    this.selectedOptions[0].innerHTML === "Water Use" ||
    this.selectedOptions[0].innerHTML === "Development Potential Index" ||
    this.selectedOptions[0].innerHTML === "Ocean Data"
  ) {
    //$('#icon3d').hide()

    $(".year-timeline-wrapper").hide();
    $(".year-timeline").empty();
    $(".opacityslider").show();
    $(".download").show();
    $("#color-switch").show();
    $("#icon3d").show();
    map.setPaintProperty(currentGeojsonLayers.hexSize, "fill-opacity", 0.0);

    var layers = [];
    //console.log(this.selectedOptions[0])
    for (var x in allLayers) {
      if (allLayers[x].title === this.selectedOptions[0].innerHTML) {
        //console.log(allLayers[x]);
        layers.push(allLayers[x]);
      }
    }

    addToLayersDrop(layers);
  } else {
    //$('#icon3d').hide()
    $(".opacityslider").show();
    $(".download").show();
    $("#color-switch").show();
    $("#icon3d").show();
    //map.addControl(Draw, 'bottom-right');
    var layersHolder = document.getElementById("layer-drop");
    var length = layersHolder.options.length;

    for (var i = length - 1; i >= 0; i--) {
      layersHolder.options[i] = null;
    }
    $("#layer-id").hide();
    $(".year-timeline-wrapper").hide();
    $(".year-timeline").empty();
    changeDataOnMap(this.selectedOptions[0].id);
  }

  //changeDataOnMap(this.selectedOptions[0].id);
});

//??? NEEDS REVIEW AND POTENTIALLY REMOVAL
//OLD HEXAGON CHANGE PART - NOT USED BUT SCARED TO DELETE -seb note
/*
$('select[name="hexbin-change"]').on('change', function () {

    console.log(this.selectedOptions[0].value);
    changeHexagonSize(this.selectedOptions[0].value)
}) */

//-----------------------------------
//if a layer is selected from dropdown
$('select[name="layer-selection"]').on("change", function () {
  //TODO - IMPORTANT FUNCTION
  console.log("changeDataOnMap being called for layer-selector");
  console.log("Layer: " + $(this).val());
  changeDataOnMap(this.selectedOptions[0].id);
});

//------------------------------------

//ADD LISTENER FOR: OPEN/CLOSE
$("#layer-id").hide();
$(".year-timeline-wrapper").hide();

/** Collapse/Expand for Box  */
$(".bottom-left").on("click", function () {
  console.log("collapse/expand for box");
  $(".app-body").toggleClass("collapsed");
  $(this).toggleClass("collapsed");
});

//(MOIN'S) TOOLTIP FOR SDFS .CAROUSEL
$(".sdgimg .carousel-item, .sdgs .icon-grid-item , .sdg-tool").mouseover(
  function () {
    $("#gridsdgs").removeClass("d-none");
    $("#samimg").removeClass("d-none");
    var index = $(this).data("imgid");
    $(".title-text").text(sdg[index - 1].title);
    $(".title-text").css("color", sdgColorsSeb[index - 1]);
    $(".img-tooltip-content").html(sdg[index - 1].content);
  }
);

$(".sdgimg .carousel-item, .grid-container,.sdg-tool ").mouseout(function () {
  $("#gridsdgs").addClass("d-none");
  $("#samimg").addClass("d-none");
});

// samoa hover events
$(".samoa .carousel-item, .samoa-grid .icon-grid-item").mouseover(function () {
  $("#gridsamoa").removeClass("d-none");
  $("#samimg").removeClass("d-none");
  var index = $(this).data("imgid");
  $(".title-text").text(arrsamoa[index - 1].title);
  $(".title-text").css("color", samoaColorsSeb[index - 1]);
  $(".img-tooltip-content").html(arrsamoa[index - 1].content);
});

$(".samoa .carousel-item,.grid-container, .samoa-grid ").mouseout(function () {
  $("#gridsamoa").addClass("d-none");
  $("#samimg").addClass("d-none");
});

/**sdg grid hover */
$(".sdgs .icon-grid-item").click(function () {
  if (!$("#resetData").is(":visible")) {
    $("#resetData").toggle();
  }
  //$('#resetData').toggle();
  /*if($('#layer-id').is(':visible')) {
        $('#layer-id').hide()
    } */

  var w = $("#dataDrop")[0].options;
  console.log(w);
  for (var z in w) {
    console.log(w[z].id);
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }

  $("#sdg_slider .carousel-item").removeClass("active");
  var index = $(this).data("imgid");
  console.log(index);
  var filtered = _.filter(allLayers, function (o) {
    return o.sdg.includes(index);
  });
  console.log(allLayers);
  var filteredSDG = filtered.map((x) => x.field_name);
  console.log(filteredSDG);

  for (var x in w) {
    console.log(w[x].id);
    if (!filteredSDG.includes(w[x].id)) {
      if (w[x].id) {
        $("#dataDrop option[id=" + w[x].id + "]").hide();
      }
    }
  }

  $("#sdg_slider div[data-imgid='" + index + "']").addClass("active");
});

/**samoa grid hover */
$(".samoa-grid .icon-grid-item").click(function () {
  if (!$("#resetData").is(":visible")) {
    $("#resetData").toggle();
  }

  var w = $("#dataDrop")[0].options;
  //console.log(w);
  for (var z in w) {
    //console.log(w[z].id)
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }

  $("#SAMOA_slider .carousel-item").removeClass("active");
  var index = $(this).data("imgid");
  $("#SAMOA_slider div[data-imgid='" + index + "']").addClass("active");
  var filtered = _.filter(allLayers, function (o) {
    return o.samoa_path.includes(index);
  });
  var filteredSamoa = filtered.map((x) => x.field_name);
  //console.log(allLayers.length)
  console.log(filtered);
  console.log("add");
  console.log("remov");

  for (var x in w) {
    console.log(w[x].id);
    if (!filteredSamoa.includes(w[x].id)) {
      if (w[x].id) {
        $("#dataDrop option[id=" + w[x].id + "]").hide();
      }
    }
  }
});

// hover for economy
// $(".BE, #tooleconnomy").mouseover(function () { //ORIGINAL; I NOTICED MISPELLING AND BLINDLY CORRECTED IT BELOW
//   $("#tooleconomy").removeClass("d-none");
// });
$(".BE, #tooleconomy").mouseover(function () {
  $("#tooleconomy").removeClass("d-none");
});

$(".BE, #tooleconomy").mouseout(function () {
  $("#tooleconomy").addClass("d-none");
});

$(".BE").click(function () {
  if (!$("#resetData").is(":visible")) {
    $("#resetData").toggle();
  }
  var index = 1;
  var w = $("#dataDrop")[0].options;
  //console.log(w);
  for (var z in w) {
    //console.log(w[z].id)
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }
  console.log("BE");

  var filtered = _.filter(allLayers, function (o) {
    return o.pillar.includes(index);
  });
  var filteredBE = filtered.map((x) => x.field_name);

  for (var x in w) {
    console.log(w[x].id);
    if (!filteredBE.includes(w[x].id)) {
      if (w[x].id) {
        $("#dataDrop option[id=" + w[x].id + "]").hide();
      }
    }
  }
});

$(".CA").click(function () {
  if (!$("#resetData").is(":visible")) {
    $("#resetData").toggle();
  }
  var index = 2;
  var w = $("#dataDrop")[0].options;
  //console.log(w);
  for (var z in w) {
    //console.log(w[z].id)
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }

  console.log("CA");

  var filtered = _.filter(allLayers, function (o) {
    return o.pillar.includes(index);
  });
  var filteredCA = filtered.map((x) => x.field_name);

  for (var x in w) {
    console.log(w[x].id);
    if (!filteredCA.includes(w[x].id)) {
      if (w[x].id) {
        $("#dataDrop option[id=" + w[x].id + "]").hide();
      }
    }
  }
});

$(".DT").click(function () {
  if (!$("#resetData").is(":visible")) {
    $("#resetData").toggle();
  }
  var index = 3;
  var w = $("#dataDrop")[0].options;
  //console.log(w);
  for (var z in w) {
    //console.log(w[z].id)
    if (w[z].id) {
      $("#dataDrop option[id=" + w[z].id + "]").show();
    }
  }
  console.log("DT");

  var filtered = _.filter(allLayers, function (o) {
    return o.pillar.includes(index);
  });
  var filteredDT = filtered.map((x) => x.field_name);

  for (var x in w) {
    console.log(w[x].id);
    if (!filteredDT.includes(w[x].id)) {
      if (w[x].id) {
        $("#dataDrop option[id=" + w[x].id + "]").hide();
      }
    }
  }
});

// hover action for climate action
$(".CA, #toolclimate").mouseover(function () {
  $("#tooleclimate").removeClass("d-none");
});
$(".CA, #tooleclimate").mouseout(function () {
  $("#tooleclimate").addClass("d-none");
});

// hover action for Digital	Transformation
$(".DT, #tooldigi").mouseover(function () {
  $("#tooldigi").removeClass("d-none");
});
$(".DT, #tooldigi").mouseout(function () {
  $("#tooldigi").addClass("d-none");
});

// Button click and select FOR SIDS OFFER
$(".button-option-select-1").on("click", function (e) {
  var btnValue = $(this).data("value");

  $(".button-option-select-1.active").removeClass("active");

  $(this).addClass("active");
  // Button value
  console.log("Button Value: " + btnValue);

  e.preventDefault();
});
// END MOIN'S TOOLTIP SECTION//

/**
 * Dynamic year list creation
 */

function updateTime(layers) {
  $(".year-timeline-wrapper").show();
  //console.log(yearList)
  //console.log(layers);
  //var currentLayer = {}
  currentTimeLayer = layers;
  var latestTime = currentTimeLayer.slice(-1);
  changeDataOnMap(latestTime[0].field_name);

  //var startLayer = find(currentTimeLayer, function(o) {return o.time === yearValue})
  //console.log(showLayer)
  //changeDataOnMap(showLayer.field_name);
  //console.log(currentLayer)
  var yearList = currentTimeLayer.map((x) => x.time);
  var year_html = "";
  //$('.year-timeline').append(year_html);
  $(".year-timeline").empty();

  if (yearList.length == 1) {
    $(".year-timeline").html(
      `<p class='m-0'> Data only available for ${yearList}</p>`
    );
    $(".year-timeline-wrapper").addClass("single-year-only");
    return;
  }

  var last_percentage = 0;

  for (var i = 0; i < yearList.length; i++) {
    var class_for_year = "";
    if (i == 0) {
      class_for_year = "alpha";
    } else if (i == yearList.length - 1) {
      class_for_year = "omega";
    }

    //
    var totalContainerWidth = $(".year-timeline").outerWidth();

    // Calculating the pecetange of this block
    var different_first_last = yearList[yearList.length - 1] - yearList[0];

    // Now calculate the distance between the current item and the next one
    var distance_to_next = yearList[i] - yearList[0];

    if (i == yearList.length - 1) {
      console.log("is omega");
    }

    var size_in_percentage = (distance_to_next / different_first_last) * 100;
    size_in_percentage = size_in_percentage.toFixed(2);

    var widthStyle = `width: ${size_in_percentage}%;`;

    var fromLeftPosition = 0;
    var fromLeftPixels = 0;
    var fromLeftStyle = ``;

    if (i > 0 && i < yearList.length - 1) {
      fromLeftPosition = parseInt(size_in_percentage);
      // convert from left position to pixels
      fromLeftPixels = (fromLeftPosition / 100) * totalContainerWidth;
      fromLeftStyle = `left: ${fromLeftPixels}px;`;
    } else {
      last_percentage = parseInt(size_in_percentage);
    }

    last_percentage = fromLeftPosition;

    year_html = `<div _style=' ${widthStyle}' data-width='${size_in_percentage}' class="year-timeline-block ${class_for_year}" data-year-idx="${
      i + 1
    }">
          <input type="radio" name="year-selected" value="${
            yearList[i]
          }" id="year-${yearList[i]}" ${i == 0 ? "checked" : ""}>
          <label for="year-${yearList[i]}">
          <span style='${fromLeftStyle}' class="label-value">${
      yearList[i]
    }</span>
          <span style='${fromLeftStyle}' class="circle-radio"></span>
          </label>
          </div>`;
    $(".year-timeline").append(year_html);
  }

  $("body").on("change click", 'input[name="year-selected"]', function (e) {
    //e.preventDefault() //so it doesn't run twice
    isReachedToEnd = false;
    var yearValue = $('[name="year-selected"]:checked').val();
    //$('.year-timeline-block.alpha input[type="radio"').prop('checked', true);
    //console.log('-----')
    //console.log(yearValue);
    //console.log(this)
    var check = $(this).prop("checked");
    //$(this).prop('checked',true)
    //console.log(check);
    /*if(check){
          console.log('yo')
          $(this).prop('checked',false)
          console.log(this)
        } else {
          console.log('hi')
          $(this).prop('checked',true) 
        } */
    /*if (check) {$(this).removeAttr('checked').prop('checked',false)}
        else {$(this).attr('checked', true).prop('checked',true) } */
    //console.log(this)
    //console.log(currentTimeLayer);
    var showLayer = _.find(currentTimeLayer, function (o) {
      return o.time === yearValue;
    });
    //console.log(showLayer)
    changeDataOnMap(showLayer.field_name);
    //console.log(yearValue);
  });
}
// }

// Year selection

// play / pause
var playPauseInterval;

$("#year-play-pause").on("click", function (e) {
  var isPaused = $(this).hasClass("play");

  if (!isPaused) {
    clearInterval(playPauseInterval);
    $(this).removeClass("pause").addClass("play");
  } else {
    playPauseInterval = window.setInterval(function () {
      var $checkedBox = $('input[name="year-selected"]:checked');
      //console.log($checkedBox[0].value);
      if (
        $checkedBox.parent(".year-timeline-block").hasClass("omega") &&
        isReachedToEnd
      ) {
        $('.year-timeline-block.alpha input[type="radio"').prop(
          "checked",
          true
        );
        isReachedToEnd = false; // Reset, once replayed
      }
      // Reached to end
      else if ($checkedBox.parent(".year-timeline-block").hasClass("omega")) {
        clearInterval(playPauseInterval);
        $("#year-play-pause").removeClass("pause").addClass("play");
        isReachedToEnd = true; // Flag that indicates to replay the year selection
        return;
      }
      // Find the idx of checked item
      var currentIdx = $checkedBox
        .parent(".year-timeline-block")
        .data("year-idx");

      var nextCheckedBoxIdx = currentIdx + 1;
      $(".year-selected[value=1990]").prop("checked", true);
      $('.year-timeline-block[data-year-idx="' + nextCheckedBoxIdx + '"]')
        .find('input[name="year-selected"]')
        .prop("checked", true);

      var currentYear = $('input[name="year-selected"]:checked').val();
      var display = _.find(currentTimeLayer, function (o) {
        return o.time === currentYear;
      });
      console.log($('input[name="year-selected"]:checked').val());
      changeDataOnMap(display.field_name);
    }, 1600);

    $(this).addClass("pause").removeClass("play");
  }

  e.preventDefault();
});

/* Tabs */
$(".tab-nav").on("click", function () {
  $(".tab-nav").removeClass("active");
  $(this).addClass("active");

  var target = $(this).data("target");

  $(".tab").removeClass("active");
  $(target).addClass("active");
});

/**
 *  Top Toolip
 */
$(".tab-nav").on("mouseover", function () {
  var $target = $(this).data("tooltip-target");
  $($target).show();
});

$(".tab-nav").on("mouseout", function () {
  var $target = $(this).data("tooltip-target");
  $($target).hide();
});
/* END TOP TOOLTIP */

$(".selection-dropdown-arrow").on("click", function () {
  // Get <select> tag
  var $select = $(this).parent().find("select");
  // Count options
  var totalOpts = $select.find("option").length;
  // Get current selection s
  var currentIndex = $select.prop("selectedIndex");

  if ($(this).hasClass("up")) {
    if (currentIndex === 0) {
      currentIndex = totalOpts - 1;
      $select.prop("selectedIndex", currentIndex);
    } else {
      $select.prop("selectedIndex", currentIndex - 1);
    }
  } else if ($(this).hasClass("down")) {
    if (currentIndex === totalOpts - 1) {
      currentIndex = 0;
      $select.prop("selectedIndex", currentIndex);
    } else {
      $select.prop("selectedIndex", currentIndex + 1);
    }
  }
});
