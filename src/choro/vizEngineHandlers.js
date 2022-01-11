
///////////////////////////////////
/////First click of  mvi or indicators with element loading
//////////////////////////////////


$("#mviTab,#countryDataTab").one("click", function () {
    if (sidsEngineInit == 0) {

        setTimeout(() => {
            appendAllElements()
            ///this should be in initVizEngine, but it breaks for some reason


        }, .001);
    }
    sidsEngineInit = 1

});


////////
// Development Indicators tab
//////////////

$("#countryDataTab").on("click", function () {
    $("#countryDataTitle").text("Indicators for Small Island Developing States")
    $(".mdl-tabs__tab").removeClass("selectedPage")
    $(this).addClass("selectedPage")

    $("#mviCustomSelectBox").css("display", "none");
    $("#indicatorSelector").css("display", "block");
    // $("#customSpider").css("display", "none") //delete

    d3.select("#regionLegend").style("height", 42)

if (indicatorGlobal=="region"){
///do this later
}
else{
    updateVizEngine(indicatorGlobal);
}

})


////////
// MVI tab
//////////////


$("#mviTab").on("click",function () {

    //++ change tab title and class
    $("#countryDataTitle").text("Towards a Multidimensional Vulnerability Index")
    $(".mdl-tabs__tab").removeClass("selectedPage")
    $(this).addClass("selectedPage")

        //++ swap menu out
    $("#indicatorSelector").css("display", "none");
    $("#mviCustomSelectBox").css("display", "block");

    ///package selections and update viz engine
    updateVizEngine("mvi");//this doesn't actually matter what the argment is

    // d3.select("#regionLegend").style("height", 0)///remove? and these next two lines
    // // d3.select("#regionLegend").transition().duration(1000).style("height",0)
    // // d3.select("#choro_legend_container").transition().duration(1000).style("height",0)

});


///////////////////////////////////
/////Viz Type Select
//////////////////////////////////


$('#vizSelect ul li').click(function () {

    $('.selectedViz').removeClass('selectedViz');
    $(this).addClass('selectedViz');
    updateVizEngine(indicatorGlobal);

});

///////////////////////////////////
/////Rank or region sortby select
//////////////////////////////////

$('#sortbySelect ul li').click(function () {

    $('.selectedSortby').removeClass('selectedSortby');
    $(this).addClass('selectedSortby');
    updateVizEngine(indicatorGlobal);

})

////////
//MVI Preset
//////////////


$("#mviPresetSelect ul li").click(function () {
    var x = $(this);

    $(".selectedMviPreset").removeClass("selectedMviPreset");
    $(this).addClass("selectedMviPreset");
    // console.log(this)

    selectedMviPreset = this.id;
    console.log(selectedMviPreset);

    const cbs = document.querySelectorAll('input[name="mviIndicator"]');

    if (selectedMviPreset == "mviLi") {
      cbs.forEach((cb) => {
        cb.checked = true;
      });
    } else if (selectedMviPreset == "eviLi") {
      cbs.forEach((cb) => {
        if (presetDict["evi"].includes(cb.id)) cb.checked = true;
        else {
          cb.checked = false;
        }
      });
    }

    updateVizEngine("mvi") //same function as if you were to select an index

  });

  ///////////////////////////////////
/////Indicator data export
//////////////////////////////////

$("#indicatorExport").change(function () {
    console.log("exporting indicator data (disabled)")
    // newIndicators = []
    // for (const [key, value] of Object.entries(indicatorData)) {
    //     newIndicators.push({ "Country": key, "Value": value })
    // }

    // note = "Indicator: " + wdiMeta[indicator]["Indicator Name"] + ";" + wdiMeta[indicator].Source + "; For the most recent year with data."

    // exportCSVFile({ Country: "Country", Value: "Value" }, newIndicators, "indicator_data", note.replace(/,/g, ''))

    // $("#indicatorExport").val("export")

})

////setup devmode button
$('#devMode').click(function() {
    $('body div').css( 'outline', '2px solid red');
    $('body row').css( 'outline', '2px solid blue');
    $('#devMode').css({  'color': '#fff',
   'border-bottom-color': '#fff'});
   $('#homeMode').css({  'color': 'rgba(255, 255, 255, .5)',
   'border-bottom-color': 'rgba(255, 255, 255, .5)'});
  });
  $('#homeMode').click(function() {
    $('body div').css( 'outline', '0px');
    $('body row').css( 'outline', '0px');
    $('#homeMode').css({  'color': '#fff',
   'border-bottom-color': '#fff'});
   $('#devMode').css({  'color': 'rgba(255, 255, 255, .5)',
   'border-bottom-color': 'rgba(255, 255, 255, .5)'});

  });

  $("#undpLogo").click(function(){
    console.log("bop");
  $("#verticalMenu").remove();
  $("#verticalMenu2").css({display:"block"});
    });

///////////////////////////////////
/////Main indicator change. Abstracted this out for clarity
//////////////////////////////////

function handleIndicatorSelect(dimensions,index,indicatorCode){
    showDescription(dimensions,index,indicatorCode)
     //console.log({'Indicator':indicatorCode},dimensions);
     ///run full update function
     updateVizEngine(indicatorCode);
}

function handleDimensionSelect(indicatorCode){
    updateVizEngine(indicatorCode);
}

function customSelectChange() {
    ///I'm sure there is a better way to do this than having this function
    $("#customLi").trigger("click")
}
