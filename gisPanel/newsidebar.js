function handleGisMenuChange(object){
  
  var k = Object.keys(object);
  var v = Object.values(object)
  console.log(object)
  console.log(k[0])
  console.log(v[0])



  if(k[0] === 'Resolution') {
    console.log('hey')
    console.log(v[0])

    if(v[0] === '5km hexbins') {
        object['Resolution'] = 'hex5' // change the text to get the right layer --
        changeHexagonSize(object['Resolution'])
      }

    if(v[0] === '10km hexbins') {
        object['Resolution'] = 'hex10' 
        changeHexagonSize(object['Resolution'])
      }

    if(v[0] === '1km hexbins') {
        object['Resolution'] = 'hex1' 
        changeHexagonSize(object['Resolution'])
      }

    if(v[0] === 'Admin Regions 1') {
        object['Resolution'] = 'admin1' 
        changeHexagonSize(object['Resolution'])
      }

    if(v[0] === 'Admin Regions 2') {
        object['Resolution'] = 'admin2' 
        changeHexagonSize(object['Resolution'])
      }

  }

  if(k[0] === 'region') {

    downloadData(object)

  }

  if(k[0] === 'basemap') {

    if(object['basemap'] === 'Satellite Imagery') {

      object['basemap'] = 'Mapbox Satellite Streets'; //this is the name of layer for mapbox, have to change it here so it Satellite Imagery shows up in the dropdown still
      basemapSwitch(object)

    } else {

      basemapSwitch(object)
    } 

  }
  
  if(k[0] === 'country') {

    zoomToCountry(object)

  }

  if(k[0] === 'dual-mode') {
    console.log('dual mode function here');
  }


  if(k[0] === 'labels') {
    addLabels(object)
  }

  if(k[0] === 'Color') {
    switchColorScheme(object)
  }


}




function handleBoundariesChange(object) {

  var k = Object.keys(object);
  var v = Object.values(object)
  //console.log(object)
  //console.log(v[0])
  //console.log(k[0]) //name of layer

  addBoundaryLayer(object)

}

function calculatorRun(){
  var object = {};

  var value = document.getElementsByClassName('calc-function')[0].innerHTML;
  object['calc-input'] = value;

  var layersValue = document.getElementsByClassName('layer-input');
  var layers = [];
  for(var i = 0; i < layersValue.length ; i++){
    var newVal = layersValue[i].name +' - '+ layersValue[i].value;
    layers.push(newVal);
  }
  object['layers'] = layers;

  handleGisMenuChange(object);
}

function calcButtonPress(val){
  document.getElementsByClassName('calc-function')[0].innerHTML = document.getElementsByClassName('calc-function')[0].innerHTML + val;
}

function removeLayer(layer){
  document.getElementById(""+ layer +"-layer").remove();
  var layerVariables = document.getElementById('layer-variables');
  if(layerVariables.innerHTML.length === 1){
    layerVariables.innerHTML="";
  } else {
    var string = layerVariables.innerHTML;
    for(var i = 0; i < string.length; i++){
      if(string[i] === layer){
        if(i!=0 && string[i-1] === ','){
          var val = string.replace(','+layer,'');
          layerVariables.innerHTML = val;
          break;
        } else {
          var val = string.replace(layer+',','');
          layerVariables.innerHTML = val;
          break;
        }
      }
    }
  }
}

var count = 'a';
function addLayer(){
  var variable = '(' + count + ') - ';

  document.getElementsByClassName('calc-function')[0].innerHTML = document.getElementsByClassName('calc-function')[0].innerHTML + count;

  var layers = document.getElementsByClassName('layer-input');
  var index = [];

  for(var i = 0; i < layers.length; i++){
    index.push(layers[i].selectedIndex);
  }

  document.getElementById('layers').innerHTML = document.getElementById('layers').innerHTML + `<div class="row-flex space-between align-items-center" id='`+count+`-layer' style="height:30px;width:340px;background-color:#DFDFDF;margin-top:6px; border-radius:5px;">
     <div class="row-flex align-items-center" style="margin: 0 10px;">
       <i class='layers-value'>`+ variable +`</i>
       <select name="`+count+`" class="layer-input" id="`+count+`layer-input" style=" padding: 0 0 0 4px; width: 240px; height: 30px;border:0; outline:none; background-color:#DFDFDF;">
         <option value="">Select New Dataset</option>
         <option value="Aaaaa">Aaaaa</option>
         <option value="Bbbbb">Bbbbb</option>
         <option value="Ccccc">Ccccc</option>
       </select>
     </div>

     <div class="row-flex align-items-center">
       <div>N</div>
       <div class="row-flex align-items-center" style="margin: 0 10px;cursor: pointer;height:10px;width:11px;" onClick="removeLayer('`+ count +`')">
         <div style="width:11px; height:1.5px; background-color:brown"></div>
       </div>
     </div>
  </div>`;

  for(var i = 0; i < layers.length; i++){
    layers[i].selectedIndex = index[i];
  }

  var layerVariables = document.getElementById('layer-variables');
  if(layerVariables.innerHTML == ""){
    layerVariables.innerHTML+=count;
  }else {
    layerVariables.innerHTML+=","+count;
  }

  count = String.fromCharCode(count.charCodeAt(0) + 1);
}

function handleDownload(){
  var object={};

  var regions = document.getElementsByClassName('region');
  for (var i = 0; i < regions.length; i++) {
    if(regions[i].checked === true){
      if(regions[i].value === 'Visible-Area'){
        object['region'] = 'Visible-Area';
      } else if (regions[i].value === 'CountryOrRegion'){
        object['region'] = "Country" + document.getElementById('cuntryorregion').value;
      } else {
        object['region'] = "Polygon " + document.getElementById('polygon').value;
      }
    }
  }

  var temporalResolution = document.getElementsByClassName('temporal-resolution');
  for (var i = 0; i < temporalResolution.length; i++) {
    if(temporalResolution[i].checked === true){
      if(temporalResolution[i].value === 'chosen-year'){
        object['Temporal-resolution'] = 'Chosen-year';
      } else if (temporalResolution[i].value === 'year-range'){
        object['Temporal-resolution'] = "From " + document.getElementById('year-range-from').value + " to " + document.getElementById('year-range-to').value;
      }
    }
  }

  var spatialResolution = document.getElementsByClassName('spatial-resolution');
  for (var i = 0; i < spatialResolution.length; i++) {
    if(spatialResolution[i].checked === true){
      object['Spatial-resolution'] = spatialResolution[i].value;
    }
  }

  var gridType = document.getElementsByClassName('grid-type');
  for (var i = 0; i < gridType.length; i++) {
    if(gridType[i].checked === true){
      object['Grid-type'] = gridType[i].value;
    }
  }

  var fileType = document.getElementsByClassName('file-type');
  for (var i = 0; i < fileType.length; i++) {
    if(fileType[i].checked === true){
      object['File-type'] = fileType[i].value;
    }
  }

  var dataLayers = document.getElementsByClassName('data-layers');
  for (var i = 0; i < dataLayers.length; i++) {
    if(dataLayers[i].checked === true){
      object['Data-layers'] = dataLayers[i].value;
    }
  }

  handleGisMenuChange(object);
}

function handleCalcMenu(){
  document.getElementsByClassName("close-menu")[0].classList.add("display-none");
  var calc = document.getElementById('calc-menu');
  if(calc.classList.contains('display-none')){
    removeHover();
    closeAllMenu(8);
    document.getElementsByClassName('blue-box-calc')[0].classList.remove('display-none');
    calc.classList.remove('display-none');
  } else {
    closeAllMenu();
    setTimeout( () => {
      addHover();
    },500)
    document.getElementsByClassName('blue-box-calc')[0].classList.add('display-none');
  }
}


function handleDrawMenu(){
  document.getElementsByClassName("close-menu")[0].classList.add("display-none");
  var draw = document.getElementById('draw-menu');
  if(draw.classList.contains('display-none')){
    removeHover();
    closeAllMenu(10);
    document.getElementsByClassName('blue-box-draw')[0].classList.remove('display-none');
    draw.classList.remove('display-none');
  } else {
    closeAllMenu();
    setTimeout( () => {
      addHover();
    },500)
    document.getElementsByClassName('blue-box-draw')[0].classList.add('display-none');
  }
}


//this function is currently not used -- uses the boundary one I made
function handleBoundryChange(){
  var object = {};

  object['boundry-region-1'] = document.getElementById('admin-region-1').checked;
  object['boundry-region-2'] = document.getElementById('admin-region-2').checked;

  handleGisMenuChange(object);
}

function handleHeightChange(){
  var curr = document.getElementById('height');
  var value;
  var object ={};

  // removeHover();
  closeAllMenu();
  if(curr.classList.contains('threeD-icon')){
    curr.classList.remove('threeD-icon');
    curr.classList.add('twoD-icon');
    value = '2D';
  } else {
    curr.classList.add('threeD-icon');
    curr.classList.remove('twoD-icon');
    value = '3D';
  }

  object['height'] = value;
  handleGisMenuChange(object);
}

function handleLabelsChange(){
  var curr = document.getElementById('labels');
  var value;
  var object ={};

  // removeHover();
  closeAllMenu();
  if(curr.classList.contains('aminus-icon')){
    curr.classList.remove('aminus-icon');
    curr.classList.add('aplus-icon');
    value = 'Off';
  } else {
    curr.classList.add('aminus-icon');
    curr.classList.remove('aplus-icon');
    value = 'On';
  }

  object['labels'] = value;
  handleGisMenuChange(object);
}

function handleBivariateMode(){
  document.getElementsByClassName("close-menu")[0].classList.add("display-none");

  var bivariate = document.getElementsByClassName("bivariate")[0];
  var object = {};
  var key;
  if(bivariate.classList.contains("display-none")){
    closeAllMenu(9);
    removeHover();
    document.getElementsByClassName('blue-box-bivariate')[0].classList.remove('display-none');
    bivariate.classList.remove("display-none");
    key = 'Enabled';
  } else {
    closeAllMenu();
    setTimeout( () => {
      addHover();
    },500);
    document.getElementsByClassName('blue-box-bivariate')[0].classList.add('display-none');
    key = 'Disabled';
  }

  object['bivariate-mode'] = key;
  handleGisMenuChange(object);
}

function handleDualMode(){
  document.getElementsByClassName("close-menu")[0].classList.add("display-none");
  var dualMode = document.getElementsByClassName("dual-mode")[0];
  var object = {};
  var key;
  if(dualMode.classList.contains("display-none")){
    closeAllMenu(13);
    removeHover();
    document.getElementsByClassName('blue-box-dual')[0].classList.remove('display-none');
    dualMode.classList.remove("display-none");
    key = 'Enabled';
  } else {
    closeAllMenu();
    setTimeout( () => {
      addHover();
    },500)
    document.getElementsByClassName('blue-box-dual')[0].classList.add('display-none');
    key = 'Disabled';
  }

  object['dual-mode'] = key;
  handleGisMenuChange(object);
}

function resetCountryMenu(){
  document.getElementsByClassName("search-bar")[0].classList.add('display-none');
  document.getElementsByClassName("first-icon")[0].classList.remove('display-none');
  document.getElementsByClassName("big-menu")[0].classList.remove("display-none");
  document.getElementsByClassName("small-menu")[0].classList.add("display-none");
}

function toggleSearchBar(){
  document.getElementsByClassName("search-bar")[0].classList.remove('display-none');
  document.getElementsByClassName("country-options")[0].classList.add('display-none');
  document.getElementsByClassName("first-icon")[0].classList.add('display-none');
  document.getElementsByClassName("big-menu")[0].classList.add("display-none");
  document.getElementsByClassName("small-menu")[0].classList.remove("display-none");
}

function handleBasemapChange(text, image){

  var selected = document.getElementsByClassName('selected-basemap')[0];
  var basemapMenu = document.getElementsByClassName("basemap-options")[0];
  basemapMenu.classList.add('growUp');
  setTimeout(()=>{
    basemapMenu.classList.add('display-none');
    basemapMenu.classList.remove('growUp');
  },280)

  selected.children[0].innerHTML = text;
  selected.children[1].className = image;

  handleGisMenuChange({'basemap':text});
}

function handleCountryChange(text, image){
  var selected = document.getElementsByClassName('big-menu')[0];
  var countryMenu = document.getElementsByClassName("country-options")[0];
  countryMenu.classList.add('growUp');
  setTimeout(()=>{
    countryMenu.classList.add('display-none');
    countryMenu.classList.remove('growUp');
  },280);

  selected.children[0].innerHTML = text;
  selected.children[1].className = image;

  var selected2 = document.getElementsByClassName('small-menu')[0];
  selected2.children[0].className = image;
  selected2.children[0].innerHTML = "";

  handleGisMenuChange({'Country':text});
}

function handleColorChange(text, image){
  var selected = document.getElementsByClassName('selected-color')[0];
  var colorMenu = document.getElementsByClassName("color-options")[0];

  colorMenu.classList.add('growUp');
  setTimeout(()=>{
    colorMenu.classList.add('display-none');
    colorMenu.classList.remove('growUp');
  },280);

  selected.children[0].innerHTML = text;
  selected.children[1].className = "menu-" + image;

  handleGisMenuChange({'Color':text});
}

function toggleBasemapMenu(){
  var basemapMenu = document.getElementsByClassName("basemap-options")[0];
  if(basemapMenu.classList.contains('display-none')){
    basemapMenu.classList.remove('display-none');
  } else {
    basemapMenu.classList.add('growUp');
    setTimeout(()=>{
      basemapMenu.classList.add('display-none');
      basemapMenu.classList.remove('growUp');
    },280);
  }
}

function toggleCountryMenu(){
  var countryMenu = document.getElementsByClassName("country-options")[0];
  if(countryMenu.classList.contains('display-none')){
    countryMenu.classList.remove('display-none');
  } else {
    countryMenu.classList.add('growUp');
    setTimeout(()=>{
      countryMenu.classList.add('display-none');
      countryMenu.classList.remove('growUp');
    },280);
  }
}

function toggleColorMenu(){
  var colorMenu = document.getElementsByClassName("color-options")[0];
  if(colorMenu.classList.contains('display-none')){
    colorMenu.classList.remove('display-none');
  } else {
    colorMenu.classList.add('growUp');
    setTimeout(()=>{
      colorMenu.classList.add('display-none');
      colorMenu.classList.remove('growUp');
    },280);
  }
}

function handleResolutionChange(text, image){
  var resolutionMenu = document.getElementsByClassName("resolution-options")[0];
  resolutionMenu.classList.add('growUp');
  setTimeout(()=>{
    resolutionMenu.classList.add('display-none');
    resolutionMenu.classList.remove('growUp');
  },280);

  var selected = document.getElementsByClassName('selected-resolution')[0];

  selected.children[0].innerHTML = text;
  selected.children[1].className = image;

  handleGisMenuChange({'Resolution':text});
}

function toggleResolutionMenu(){
  var resolutionMenu = document.getElementsByClassName("resolution-options")[0];
  if(resolutionMenu.classList.contains('display-none')){
    resolutionMenu.classList.remove('display-none');
  } else {
    resolutionMenu.classList.add('growUp');
    setTimeout(()=>{
      resolutionMenu.classList.add('display-none');
      resolutionMenu.classList.remove('growUp');
    },280);
  }
}

function closeAllMenu(index){
  var allMenu = document.getElementsByClassName("menu-drop");

  for (var i = 0; i < allMenu.length; i++) {
    if(i!==index){
      allMenu[i].classList.add("close-animation");
    }
  }

  setTimeout( () => {
    for (var i = 0; i < allMenu.length; i++) {
      if(i!==index){
        allMenu[i].classList.add("display-none");
        allMenu[i].classList.remove("close-animation");
      }
    }
  },500)


  var blueBox = document.getElementsByClassName("blue-box");

  for (var i = 0; i < blueBox.length; i++) {
    blueBox[i].classList.add("display-none");
  }

  var options = document.getElementsByClassName("options-drop");

  for (var i = 0; i < options.length; i++) {
    options[i].classList.add("display-none");
  }
}

function removeHover(){
  var description = document.getElementsByClassName('description');

  for(var i = 0 ; i < description.length ; i++){
    description[i].classList.remove('hover');
  }
}

function addHover(){
  var description = document.getElementsByClassName('description');

  for(var i = 0 ; i < description.length ; i++){
    description[i].classList.add('hover');
  }
}

function toggleMenu(index){
  var allMenu = document.getElementsByClassName("menu-drop");

  for (var i = 0; i < allMenu.length; i++) {
    if(i===index){
      if(allMenu[i].classList.contains("display-none")){
        removeHover();
        closeAllMenu(i);
        allMenu[i].classList.remove("display-none");
        document.getElementsByClassName("close-menu")[0].classList.remove("display-none");
      } else {
        closeAllMenu();
        setTimeout( () => {
          addHover();
        },500)
        document.getElementsByClassName("close-menu")[0].classList.add("display-none");
      }
    }
  }
}

document.getElementsByClassName("close-menu")[0].addEventListener('click', function(){
  closeAllMenu();
  addHover();
  document.getElementsByClassName("close-menu")[0].classList.add("display-none");
});


function removeUpload() {


  if(map.getLayer('upload')) {

    map.removeLayer('upload')
    map.removeLayer('uploadline')
    map.removeSource('upload')

  }
}