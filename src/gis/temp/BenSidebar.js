function handleGisMenuChange(object) {
  console.log(object);
}
//my version: handleBoundariesChange
function handleBoundryChange() {
  var object = {};

  object["boundry-region-1"] =
    document.getElementById("admin-region-1").checked;
  object["boundry-region-2"] =
    document.getElementById("admin-region-2").checked;

  handleGisMenuChange(object);
}
function closeAllMenu(index) {
  var allMenu = document.getElementsByClassName("menu-drop");

  for (var i = 0; i < allMenu.length; i++) {
    if (i !== index) {
      allMenu[i].classList.add("close-animation");
    }
  }

  setTimeout(() => {
    for (var i = 0; i < allMenu.length; i++) {
      if (i !== index) {
        allMenu[i].classList.add("display-none");
        allMenu[i].classList.remove("close-animation");
      }
    }
  }, 500);

  var blueBox = document.getElementsByClassName("blue-box");

  for (var i = 0; i < blueBox.length; i++) {
    blueBox[i].classList.add("display-none");
  }

  var options = document.getElementsByClassName("options-drop");

  for (var i = 0; i < options.length; i++) {
    options[i].classList.add("display-none");
  }

  var infoBox = document.getElementsByClassName("info-box");

  for (var i = 0; i < infoBox.length; i++) {
    infoBox[i].classList.add("display-none");
  }

  var infoIconBlue = document.getElementsByClassName("info-icon-blue");
  var infoNoBgIconBlue = document.getElementsByClassName("info-nobg-icon");

  for (var i = 0; i < infoIconBlue.length; i++) {
    infoIconBlue[i].classList.add("display-none");
    infoNoBgIconBlue[i].classList.remove("display-none");
  }
}
/*calculator functions
function calculatorRun() {
  var object = {};

  var value = document.getElementsByClassName("calc-function")[0].value;
  var inputN = document.getElementById("input-N");

  if (inputN.classList.contains("color-blue")) {
    object["calc-input"] = { Value: value, Normalize: 1 };
  } else {
    object["calc-input"] = { Value: value, Normalize: 0 };
  }

  var layersValue = document.getElementsByClassName("layer-input");
  var layersN = document.getElementsByClassName("layers-N");

  var layers = [];
  for (var i = 0; i < layersValue.length; i++) {
    if (layersN[i].classList.contains("color-blue")) {
      layers.push({
        Variable: layersValue[i].name,
        Value: layersValue[i].value,
        Normalize: 1,
      });
    } else {
      layers.push({
        Variable: layersValue[i].name,
        Value: layersValue[i].value,
        Normalize: 0,
      });
    }
  }
  object["layers"] = layers;

  handleGisMenuChange(object);
}

function calcButtonPress(val) {
  document.getElementsByClassName("calc-function")[0].value =
    document.getElementsByClassName("calc-function")[0].value + val;
  document.getElementsByClassName("calc-function")[0].focus();
}

function addVariables(val) {
  document.getElementsByClassName("calc-function")[0].value =
    document.getElementsByClassName("calc-function")[0].value + val;
  document.getElementsByClassName("calc-function")[0].focus();

  var layerVariables = document.getElementById("layer-variables");

  if (layerVariables.innerHTML == "") {
    layerVariables.innerHTML += val;
  } else {
    var string = layerVariables.innerHTML;
    var present = false;
    for (var i = 0; i < string.length; i++) {
      if (string[i] === val) {
        present = true;
      }
    }
    if (!present) {
      layerVariables.innerHTML += "," + val;
    }
  }
}
//a calculator-related function i believe
function removeLayer(layer) {
  document.getElementById("" + layer + "-layer").remove();
  var layerVariables = document.getElementById("layer-variables");
  if (layerVariables.innerHTML.length === 1) {
    layerVariables.innerHTML = "";
  } else {
    var string = layerVariables.innerHTML;
    for (var i = 0; i < string.length; i++) {
      if (string[i] === layer) {
        if (i != 0 && string[i - 1] === ",") {
          var val = string.replace("," + layer, "");
          layerVariables.innerHTML = val;
          break;
        } else {
          var val = string.replace(layer + ",", "");
          layerVariables.innerHTML = val;
          break;
        }
      }
    }
  }
}
*/

//NEW--------------------------------------------
function toggleInputBlueColor(event) {
  if (event.classList.contains("color-black")) {
    event.className = "color-blue";
  } else {
    event.className = "color-black";
  }
}

function toggleBlueColor(event) {
  if (event.classList.contains("color-black")) {
    event.className = "color-blue layers-N";
  } else {
    event.className = "color-black layers-N";
  }
}

//IRRELEVANT RIGHT NOW---------------------------
var count = "a"; //only used in this function apparently; why is it even outside?
function addLayer() {
  var layers = document.getElementsByClassName("layer-input");
  var index = [];

  for (var i = 0; i < layers.length; i++) {
    index.push(layers[i].selectedIndex);
  }

  document.getElementById("layers").innerHTML =
    document.getElementById("layers").innerHTML +
    `
  <div id='` +
    count +
    `-layer' class="row-flex align-items-center" style="margin-top:6px;">
    <div class="row-flex align-items-center space-evenly" style="margin-right:6px; background-color:#A9A9A9;width:30px; height:30px;border-radius:5px;text-align:center; cursor:pointer;" onClick="addVariables('` +
    count +
    `')"><i class='layers-value'><b>` +
    count +
    `</b></i></div>
    <div class="row-flex space-between align-items-center" style="height:30px;width:304px;background-color:#DFDFDF; border-radius:5px;">

       <div class="row-flex align-items-center" style="margin: 0 10px;">
         <select name="` +
    count +
    `" class="layer-input" id="` +
    count +
    `layer-input" style=" padding: 0 0 0 4px; width: 240px; height: 30px;border:0; outline:none; background-color:#DFDFDF;">
           <option value="">Select New Dataset</option>
           <option value="Aaaaa">Aaaaa</option>
           <option value="Bbbbb">Bbbbb</option>
           <option value="Ccccc">Ccccc</option>
         </select>
       </div>

       <div class="row-flex align-items-center">
         <div class="color-black layers-N" style="cursor:pointer;" onClick="toggleBlueColor(this)">N</div>
         <div class="row-flex align-items-center" style="margin: 0 10px;cursor: pointer;height:10px;width:11px;" onClick="removeLayer('` +
    count +
    `')">
           <div style="width:11px; height:1.5px; background-color:brown"></div>
         </div>
       </div>
    </div>
  </div>`;

  for (var i = 0; i < layers.length; i++) {
    layers[i].selectedIndex = index[i];
  }

  count = String.fromCharCode(count.charCodeAt(0) + 1);
}

function handleDownload() {
  var object = {};

  var regions = document.getElementsByClassName("region");
  for (var i = 0; i < regions.length; i++) {
    if (regions[i].checked === true) {
      if (regions[i].value === "Visible-Area") {
        object["region"] = "Visible-Area";
      } else if (regions[i].value === "CountryOrRegion") {
        object["region"] =
          "Country" + document.getElementById("cuntryorregion").value;
      } else {
        object["region"] =
          "Polygon " + document.getElementById("polygon").value;
      }
    }
  }

  var temporalResolution = document.getElementsByClassName(
    "temporal-resolution"
  );
  for (var i = 0; i < temporalResolution.length; i++) {
    if (temporalResolution[i].checked === true) {
      if (temporalResolution[i].value === "chosen-year") {
        object["Temporal-resolution"] = "Chosen-year";
      } else if (temporalResolution[i].value === "year-range") {
        object["Temporal-resolution"] =
          "From " +
          document.getElementById("year-range-from").value +
          " to " +
          document.getElementById("year-range-to").value;
      }
    }
  }

  var spatialResolution = document.getElementsByClassName("spatial-resolution");
  for (var i = 0; i < spatialResolution.length; i++) {
    if (spatialResolution[i].checked === true) {
      object["Spatial-resolution"] = spatialResolution[i].value;
    }
  }

  var gridType = document.getElementsByClassName("grid-type");
  for (var i = 0; i < gridType.length; i++) {
    if (gridType[i].checked === true) {
      object["Grid-type"] = gridType[i].value;
    }
  }

  var fileType = document.getElementsByClassName("file-type");
  for (var i = 0; i < fileType.length; i++) {
    if (fileType[i].checked === true) {
      object["File-type"] = fileType[i].value;
    }
  }

  var dataLayers = document.getElementsByClassName("data-layers");
  for (var i = 0; i < dataLayers.length; i++) {
    if (dataLayers[i].checked === true) {
      object["Data-layers"] = dataLayers[i].value;
    }
  }

  handleGisMenuChange(object);
}

function handleCalcMenu() {
  document
    .getElementsByClassName("close-menu")[0]
    .classList.add("display-none");
  var calc = document.getElementById("calc-menu");
  if (calc.classList.contains("display-none")) {
    removeHover();
    closeAllMenu(8);
    document
      .getElementsByClassName("blue-box-calc")[0]
      .classList.remove("display-none");
    calc.classList.remove("display-none");
  } else {
    closeAllMenu();
    setTimeout(() => {
      addHover();
    }, 500);
    document
      .getElementsByClassName("blue-box-calc")[0]
      .classList.add("display-none");
  }
}

function handleDrawMenu() {
  document
    .getElementsByClassName("close-menu")[0]
    .classList.add("display-none");
  var draw = document.getElementById("draw-menu");
  if (draw.classList.contains("display-none")) {
    removeHover();
    closeAllMenu(10);
    document
      .getElementsByClassName("blue-box-draw")[0]
      .classList.remove("display-none");
    draw.classList.remove("display-none");
  } else {
    closeAllMenu();
    setTimeout(() => {
      addHover();
    }, 500);
    document
      .getElementsByClassName("blue-box-draw")[0]
      .classList.add("display-none");
  }
}
//TO LOOK AT STILL--------------------------------

//need to look at how it works/implemented in old version first
function handleHeightChange(first, second) {
  var curr = document.getElementsByClassName(first + "-icon")[0];
  var reqd = document.getElementsByClassName(second + "-icon")[0];

  closeAllMenu();
  curr.classList.add("flip1");
  setTimeout(() => {
    reqd.classList.remove("display-none");
    reqd.classList.add("flip2");
    curr.classList.add("display-none");
    curr.classList.remove("flip1");
  }, 140);
  setTimeout(() => {
    reqd.classList.remove("flip2");
  }, 280);

  var value;
  var object = {};

  if (first === "threeD") {
    value = "2D";
  } else {
    value = "3D";
  }

  object["height"] = value;
  handleGisMenuChange(object);
}

function handleLabelsChange(first, second) {
  var curr = document.getElementsByClassName(first + "-icon")[0];
  var reqd = document.getElementsByClassName(second + "-icon")[0];

  closeAllMenu();
  curr.classList.add("flip1");
  setTimeout(() => {
    reqd.classList.remove("display-none");
    reqd.classList.add("flip2");
    curr.classList.add("display-none");
    curr.classList.remove("flip1");
  }, 140);
  setTimeout(() => {
    reqd.classList.remove("flip2");
  }, 280);

  var value;
  var object = {};

  if (first === "aminus") {
    value = "A+";
  } else {
    value = "A-";
  }

  object["Label"] = value;
  handleGisMenuChange(object);
}

function hideInfo(val) {
  document
    .getElementsByClassName("info-hover-icon-" + val)[0]
    .classList.remove("display-none");
  document
    .getElementsByClassName("info-blue-icon-" + val)[0]
    .classList.add("display-none");
  document
    .getElementsByClassName("info-box-" + val)[0]
    .classList.add("display-none");
}

function displayInfo(val) {
  document
    .getElementsByClassName("info-hover-icon-" + val)[0]
    .classList.add("display-none");
  document
    .getElementsByClassName("info-blue-icon-" + val)[0]
    .classList.remove("display-none");
  document
    .getElementsByClassName("info-box-" + val)[0]
    .classList.remove("display-none");
}

function handleBivariateMode() {
  document
    .getElementsByClassName("close-menu")[0]
    .classList.add("display-none");

  var bivariate = document.getElementsByClassName("bivariate")[0];
  var object = {};
  var key;
  if (bivariate.classList.contains("display-none")) {
    closeAllMenu(9);
    removeHover();
    document
      .getElementsByClassName("blue-box-bivariate")[0]
      .classList.remove("display-none");
    bivariate.classList.remove("display-none");
    key = "Enabled";
  } else {
    closeAllMenu();
    setTimeout(() => {
      addHover();
    }, 500);
    document
      .getElementsByClassName("blue-box-bivariate")[0]
      .classList.add("display-none");
    key = "Disabled";
  }

  object["bivariate-mode"] = key;
  handleGisMenuChange(object);
}

function handleDualMode() {
  document
    .getElementsByClassName("close-menu")[0]
    .classList.add("display-none");
  var dualMode = document.getElementsByClassName("dual-mode")[0];
  var object = {};
  var key;
  if (dualMode.classList.contains("display-none")) {
    closeAllMenu(13);
    removeHover();
    document
      .getElementsByClassName("blue-box-dual")[0]
      .classList.remove("display-none");
    dualMode.classList.remove("display-none");
    key = "Enabled";
  } else {
    closeAllMenu();
    setTimeout(() => {
      addHover();
    }, 500);
    document
      .getElementsByClassName("blue-box-dual")[0]
      .classList.add("display-none");
    key = "Disabled";
  }

  object["dual-mode"] = key;
  handleGisMenuChange(object);
}

function resetCountryMenu() {
  document
    .getElementsByClassName("search-bar")[0]
    .classList.add("display-none");
  document
    .getElementsByClassName("first-icon")[0]
    .classList.remove("display-none");
  document
    .getElementsByClassName("big-menu")[0]
    .classList.remove("display-none");
  document
    .getElementsByClassName("small-menu")[0]
    .classList.add("display-none");
}

function toggleSearchBar() {
  document
    .getElementsByClassName("search-bar")[0]
    .classList.remove("display-none");
  document
    .getElementsByClassName("country-options")[0]
    .classList.add("display-none");
  document
    .getElementsByClassName("first-icon")[0]
    .classList.add("display-none");
  document.getElementsByClassName("big-menu")[0].classList.add("display-none");
  document
    .getElementsByClassName("small-menu")[0]
    .classList.remove("display-none");
}

function handleBasemapChange(text, image) {
  var selected = document.getElementsByClassName("selected-basemap")[0];
  var basemapMenu = document.getElementsByClassName("basemap-options")[0];
  basemapMenu.classList.add("growUp");
  setTimeout(() => {
    basemapMenu.classList.add("display-none");
    basemapMenu.classList.remove("growUp");
  }, 280);

  selected.children[0].innerHTML = text;
  selected.children[1].className = "menu-icon-satellite " + image;

  document.getElementsByClassName("basemap-icon-handle")[0].className =
    "icon basemap-icon-handle " + image;
  handleGisMenuChange({ basemap: text });
}

function handleCountryChange(text, image) {
  var selected = document.getElementsByClassName("big-menu")[0];
  var countryMenu = document.getElementsByClassName("country-options")[0];
  countryMenu.classList.add("growUp");
  setTimeout(() => {
    countryMenu.classList.add("display-none");
    countryMenu.classList.remove("growUp");
  }, 280);

  selected.children[0].innerHTML = text;
  selected.children[1].className = image;

  var selected2 = document.getElementsByClassName("small-menu")[0];
  selected2.children[0].className = image;
  selected2.children[0].innerHTML = "";

  handleGisMenuChange({ Country: text });
}

function handleColorChange(text, image) {
  var selected = document.getElementsByClassName("selected-color")[0];
  var colorMenu = document.getElementsByClassName("color-options")[0];

  colorMenu.classList.add("growUp");
  setTimeout(() => {
    colorMenu.classList.add("display-none");
    colorMenu.classList.remove("growUp");
  }, 280);

  selected.children[0].innerHTML = text;
  selected.children[1].className = "menu-icon " + image;

  document.getElementsByClassName("color-icon")[0].className =
    "icon color-icon " + image;
  handleGisMenuChange({ Color: text });
}

function toggleBasemapMenu() {
  var basemapMenu = document.getElementsByClassName("basemap-options")[0];
  if (basemapMenu.classList.contains("display-none")) {
    basemapMenu.classList.remove("display-none");
  } else {
    basemapMenu.classList.add("growUp");
    setTimeout(() => {
      basemapMenu.classList.add("display-none");
      basemapMenu.classList.remove("growUp");
    }, 280);
  }
}

function toggleCountryMenu() {
  var countryMenu = document.getElementsByClassName("country-options")[0];
  if (countryMenu.classList.contains("display-none")) {
    countryMenu.classList.remove("display-none");
  } else {
    countryMenu.classList.add("growUp");
    setTimeout(() => {
      countryMenu.classList.add("display-none");
      countryMenu.classList.remove("growUp");
    }, 280);
  }
}

function toggleColorMenu() {
  var colorMenu = document.getElementsByClassName("color-options")[0];
  if (colorMenu.classList.contains("display-none")) {
    colorMenu.classList.remove("display-none");
  } else {
    colorMenu.classList.add("growUp");
    setTimeout(() => {
      colorMenu.classList.add("display-none");
      colorMenu.classList.remove("growUp");
    }, 280);
  }
}

function handleResolutionChange(index, val) {
  var resolutionOptions = document.getElementsByClassName("resolution-option");

  for (var i = 0; i < resolutionOptions.length; i++) {
    if (index === i) {
      resolutionOptions[i].classList.add("border-blue");
    } else {
      resolutionOptions[i].classList.remove("border-blue");
    }
  }

  document.getElementsByClassName("resolution-icon")[0].className =
    "icon resolution-icon " + val;

  var object = {};
  object["Resolution"] = val;

  handleGisMenuChange(object);
}

function removeHover() {
  var description = document.getElementsByClassName("description");

  for (var i = 0; i < description.length; i++) {
    description[i].classList.remove("hover");
  }
}

function addHover() {
  var description = document.getElementsByClassName("description");

  for (var i = 0; i < description.length; i++) {
    description[i].classList.add("hover");
  }
}

function toggleMenu(index) {
  var allMenu = document.getElementsByClassName("menu-drop");

  for (var i = 0; i < allMenu.length; i++) {
    if (i === index) {
      if (allMenu[i].classList.contains("display-none")) {
        removeHover();
        closeAllMenu(i);
        allMenu[i].classList.remove("display-none");
        document
          .getElementsByClassName("close-menu")[0]
          .classList.remove("display-none");
      } else {
        closeAllMenu();
        setTimeout(() => {
          addHover();
        }, 500);
        document
          .getElementsByClassName("close-menu")[0]
          .classList.add("display-none");
      }
    }
  }
}

document
  .getElementsByClassName("close-menu")[0]
  .addEventListener("click", function () {
    closeAllMenu();
    addHover();
    document
      .getElementsByClassName("close-menu")[0]
      .classList.add("display-none");
  });
