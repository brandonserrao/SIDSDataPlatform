<!--BRANDON: MY RE-IMPLEMENTATION OF THE OLD RIGHTHAND SIDEBAR TO NEW VUE VERSION-->
<template>
  <div class="sidebarWrapper">
    <br />
    <div class="close-menu display-none"></div>
    <div class="menu-box col-flex space-evenly">
      <div class="row-flex full-width">
        <div class="col-flex space-evenly">
          <!-- Country Select Menu -->
          <div class="menu row-flex">
            <div class="icon country-icon" @click="toggleMenu(0)"></div>
            <div class="description hover">
              Map : Select country of your choice
            </div>
            <div class="menu-drop row-flex align-items-center display-none">
              <div class="row-flex" style="position: relative">
                <select
                  name="countries"
                  id="country"
                  class="countries"
                  v-on:change="
                    handleGisMenuChange({ country: $event.target.value })
                  "
                >
                  <option value="Search Country or Region">
                    Search Country or Region
                  </option>
                  <!--<option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>-->
                </select>
                <div class="down-arrow"></div>
              </div>
              <!--<div class="search-icon"></div> -->
            </div>
          </div>

          <!-- Resolution Select Menu -->
          <div class="menu row-flex">
            <div class="icon resolution-icon" @click="toggleMenu(1)"></div>
            <div class="description hover">Resolution: Select Resolution</div>
            <div
              class="
                menu-drop
                row-flex
                align-items-center
                display-none
                menu-drop-resolution
              "
            >
              <div style="margin-right: 12px">Resolution:</div>

              <div class="col-flex" style="position: relative">
                <div
                  class="
                    row-flex
                    space-between
                    selected-resolution
                    resolution
                    align-items-center
                  "
                  @click="toggleSidebarMenu('resolution')"
                >
                  <div>5km hexbins</div>
                  <div
                    class="resolution-menu-icon"
                    style="margin-right: 30px"
                  ></div>
                </div>

                <div
                  class="col-flex resolution-options display-none options-drop"
                >
                  <div
                    class="
                      row-flex
                      space-between
                      resolution-option
                      align-items-center
                    "
                    @click="
                      handleResolutionChange(
                        '1km hexbins',
                        'resolution-menu-icon'
                      )
                    "
                  >
                    <div>1km hexbins</div>
                    <div class="resolution-menu-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      resolution-option
                      align-items-center
                    "
                    @click="
                      handleResolutionChange(
                        '5km hexbins',
                        'resolution-menu-icon'
                      )
                    "
                  >
                    <div>5km hexbins</div>
                    <div class="resolution-menu-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      resolution-option
                      align-items-center
                    "
                    @click="
                      handleResolutionChange(
                        '10km hexbins',
                        'resolution-menu-icon'
                      )
                    "
                  >
                    <div>10km hexbins</div>
                    <div class="resolution-menu-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      resolution-option
                      align-items-center
                    "
                    @click="
                      handleResolutionChange(
                        'Admin Regions 1',
                        'admin-region-one-icon'
                      )
                    "
                  >
                    <div>Admin Regions 1</div>
                    <div class="admin-region-one-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      resolution-option
                      align-items-center
                    "
                    @click="
                      handleResolutionChange(
                        'Admin Regions 2 ',
                        'admin-region-two-icon'
                      )
                    "
                  >
                    <div>Admin Regions 2</div>
                    <div class="admin-region-two-icon"></div>
                  </div>
                </div>

                <div
                  class="down-arrow"
                  @click="toggleSelect('resolution')"
                ></div>
              </div>
            </div>
          </div>

          <!-- Color Select Menu -->
          <div class="menu row-flex">
            <div class="icon color-icon" @click="toggleMenu(2)"></div>
            <div class="description hover">Color: Select Color</div>
            <div
              class="
                menu-drop
                row-flex
                align-items-center
                display-none
                menu-drop-color
              "
            >
              <div style="margin-right: 12px">Color Scheme:</div>
              <div class="col-flex" style="position: relative">
                <div
                  class="
                    row-flex
                    space-between
                    selected-color
                    color
                    align-items-center
                  "
                  @click="toggleSidebarMenu('color')"
                >
                  <div>Original Color Scheme</div>
                  <div
                    class="menu-icon color-icon"
                    style="margin-right: 30px"
                  ></div>
                </div>

                <div class="col-flex color-options display-none options-drop">
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="handleColorChange('Original', 'icon color-icon')"
                  >
                    <div>Original Color Scheme</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="handleColorChange('invert', 'icon color-icon')"
                  >
                    <div>Invert Colors</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="handleColorChange('red', 'icon color-icon')"
                  >
                    <div>Reds</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="handleColorChange('purple', 'icon color-icon')"
                  >
                    <div>Purples</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="handleColorChange('blue', 'icon color-icon')"
                  >
                    <div>Blues</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      color-option
                      align-items-center
                    "
                    @click="
                      handleColorChange('colorblind-safe', 'icon color-icon')
                    "
                  >
                    <div>Colorblind Safe</div>
                    <div class="menu-icon color-icon"></div>
                  </div>
                </div>

                <div
                  class="down-arrow"
                  style="cursor: pointer"
                  @click="toggleSidebarMenu('color')"
                ></div>
              </div>
            </div>
          </div>

          <!-- Basemap Select Menu -->
          <div class="menu row-flex">
            <div class="icon basemap-icon" @click="toggleMenu(3)"></div>
            <div class="description hover">Basemap: Select Basemap</div>
            <div
              class="
                menu-drop
                row-flex
                align-items-center
                display-none
                menu-drop-basemap
              "
            >
              <div class="basemap-menu-icon"></div>
              <div style="margin: 0 12px 0 8px">Basemap:</div>
              <div class="col-flex" style="position: relative">
                <div
                  class="
                    row-flex
                    space-between
                    selected-basemap
                    color
                    align-items-center
                  "
                  @click="toggleSidebarMenu('basemap')"
                >
                  <div>Satellite Imagery</div>
                  <div class="satellite-icon" style="margin-right: 30px"></div>
                </div>

                <div class="col-flex basemap-options display-none options-drop">
                  <div
                    class="
                      row-flex
                      space-between
                      basemap-option
                      align-items-center
                    "
                    @click="
                      handleBasemapChange('Satellite Imagery', 'satellite-icon')
                    "
                  >
                    <div>Satellite Imagery</div>
                    <div
                      class="satellite-icon"
                      style="margin-right: 10px"
                    ></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      basemap-option
                      align-items-center
                    "
                    @click="
                      handleBasemapChange('Mapbox Light', 'satellite-icon')
                    "
                  >
                    <div>Mapbox Light</div>
                    <div
                      class="satellite-icon"
                      style="margin-right: 10px"
                    ></div>
                  </div>
                  <div
                    class="
                      row-flex
                      space-between
                      basemap-option
                      align-items-center
                    "
                    @click="
                      handleBasemapChange('Mapbox Dark', 'satellite-icon')
                    "
                  >
                    <div>Mapbox Dark</div>
                    <div
                      class="satellite-icon"
                      style="margin-right: 10px"
                    ></div>
                  </div>
                </div>

                <div
                  class="down-arrow"
                  @click="toggleSidebarMenu('basemap')"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-flex">
          <!-- Boundaries Select Menu -->
          <div class="menu row-flex">
            <div class="icon add-boundaries-icon" @click="toggleMenu(4)"></div>
            <div class="description hover">Boundaries</div>
            <div class="menu-drop row-flex display-none menu-big">
              <div class="col-flex" style="height: auto; width: auto">
                <div
                  class="row-flex"
                  style="
                    border-top-left-radius: 5px;
                    line-height: 52px;
                    font-weight: bold;
                    font-size: 16px;
                    height: 52px;
                    background-color: #c4c4c4;
                    padding-left: 20px;
                  "
                >
                  Add Boundaries
                </div>
                <div
                  class="row-flex"
                  style="
                    background-color: #c4c4c4;
                    border-bottom-right-radius: 5px;
                    border-bottom-left-radius: 5px;
                  "
                >
                  <div
                    class="col-flex"
                    style="
                      width: 176px;
                      margin: 0 10px 8px 10px;
                      background-color: #dfdfdf;
                      padding: 10px 10px;
                    "
                  >
                    <div class="row-flex">
                      <div class="text">Admin Region 1</div>
                      <div class="admin-region-one-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-1"
                        name="admin-region"
                        value="admin-region-one"
                        @change="
                          handleBoundariesChange({
                            'admin1-overlay': $event.target.checked,
                          })
                        "
                      />
                    </div>
                    <div class="row-flex" style="margin-top: 10px">
                      <div class="text">Admin Region 2</div>
                      <div class="admin-region-two-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-2"
                        name="admin-region"
                        value="admin-region-two"
                        @change="
                          handleBoundariesChange({
                            'admin2-overlay': $event.target.checked,
                          })
                        "
                      />
                    </div>
                    <div class="row-flex" style="margin-top: 10px">
                      <div class="text">Airports</div>
                      <div class="admin-region-two-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-2"
                        name="admin-region"
                        value="admin-region-two"
                        @change="
                          handleBoundariesChange({
                            'airports-extended': $event.target.checked,
                          })
                        "
                      />
                    </div>
                    <div class="row-flex" style="margin-top: 10px">
                      <div class="text">Ports</div>
                      <div class="admin-region-two-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-2"
                        name="admin-region"
                        value="admin-region-two"
                        @change="
                          handleBoundariesChange({
                            world_port_index: $event.target.checked,
                          })
                        "
                      />
                    </div>
                    <div class="row-flex" style="margin-top: 10px">
                      <div class="text">Health Centers</div>
                      <div class="admin-region-two-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-2"
                        name="admin-region"
                        value="admin-region-two"
                        @change="
                          handleBoundariesChange({
                            healthsites: $event.target.checked,
                          })
                        "
                      />
                    </div>
                    <div class="row-flex" style="margin-top: 10px">
                      <div class="text">Underwater Cables</div>
                      <div class="admin-region-two-icon"></div>
                      <input
                        type="checkbox"
                        autocomplete="off"
                        id="admin-region-2"
                        name="admin-region"
                        value="admin-region-two"
                        @change="
                          handleBoundariesChange({
                            'underwater-overlay': $event.target.checked,
                          })
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-flex">
                <div
                  class="col-flex"
                  style="width: 10px; height: 52px; background-color: #c4c4c4"
                ></div>
              </div>
            </div>
          </div>

          <!-- Height Select Menu -->
          <div class="menu row-flex">
            <div
              id="height"
              class="icon threeD-icon"
              @click="handleHeightChange()"
            ></div>
            <div class="description hover">3D 2D</div>
            <div
              class="menu-drop row-flex align-items-center display-none"
            ></div>
          </div>

          <!-- Opacity Select Menu -->
          <div class="menu row-flex">
            <div class="icon opacity-icon" @click="toggleMenu(6)"></div>
            <div class="description hover">Opacity</div>
            <div class="menu-drop row-flex align-items-center display-none">
              <div
                class="row-flex align-items-center"
                style="
                  height: 40px;
                  margin: 0 6px 0 0;
                  background-color: #dfdfdf;
                "
              >
                <div style="margin: 0 10px">Opacity</div>
                <!--<input type="range" class="opacity-slider" id="opacity" name="opacity" min="0" max="100" oninput="handleGisMenuChange({'opacity':this.value})">-->
                <input
                  type="range"
                  class="opacity-slider"
                  id="opacity"
                  name="opacity"
                  value="70"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <!-- Labels Select Menu -->
          <div class="menu row-flex">
            <div
              id="labels"
              class="icon aminus-icon"
              @click="handleLabelsChange()"
            ></div>
            <div class="description hover">A- A+</div>
            <div
              class="menu-drop row-flex align-items-center display-none"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import names from "@/gis/static/names";

export default {
  name: "MapToolbar",
  data() {
    return {
      names, //consider redoing these via props
      debug: true,
      count: "a", //likely obsolete, from old code; used in addLayer code
    };
  },
  methods: {
    //fo rightsidebar; toggles menu opening/closing via "display-none" class
    toggleMenu(index) {
      console.log(`toggleMenu: index = ${index}`);
      let allMenu = document.getElementsByClassName("menu-drop");

      for (let i = 0; i < allMenu.length; i++) {
        if (i === index) {
          if (allMenu[i].classList.contains("display-none")) {
            this.removeHover();
            this.closeAllMenu(i);
            allMenu[i].classList.remove("display-none");
            document
              .getElementsByClassName("close-menu")[0]
              .classList.remove("display-none");
          } else {
            this.closeAllMenu();
            setTimeout(() => {
              this.addHover();
            }, 500);
            document
              .getElementsByClassName("close-menu")[0]
              .classList.add("display-none");
          }
        }
      }
    },
    //for rightsidebar; closing all menu components
    closeAllMenu(index) {
      console.log(`closeAllMenu: index = ${index}`);
      let allMenu = document.getElementsByClassName("menu-drop");

      for (let i = 0; i < allMenu.length; i++) {
        if (i !== index) {
          allMenu[i].classList.add("close-animation");
        }
      }

      setTimeout(() => {
        for (let i = 0; i < allMenu.length; i++) {
          if (i !== index) {
            allMenu[i].classList.add("display-none");
            allMenu[i].classList.remove("close-animation");
          }
        }
      }, 500);

      let blueBox = document.getElementsByClassName("blue-box");

      for (let i = 0; i < blueBox.length; i++) {
        blueBox[i].classList.add("display-none");
      }

      let options = document.getElementsByClassName("options-drop");

      for (let i = 0; i < options.length; i++) {
        options[i].classList.add("display-none");
      }
    },
    //for rightsidebarbutton tooltip; remove animation class
    removeHover() {
      let description = document.getElementsByClassName("description");

      for (let i = 0; i < description.length; i++) {
        description[i].classList.remove("hover");
      }
    },
    //for rightsidebarbutton tooltip; add animation class
    addHover() {
      let description = document.getElementsByClassName("description");

      for (let i = 0; i < description.length; i++) {
        description[i].classList.add("hover");
      }
    },
    handleGisMenuChange(object) {
      console.log("handleGisMenuChange: object passed:");
      let key = Object.keys(object);
      let value = Object.values(object);
      console.log(object);
      console.log(key[0]);
      console.log(value[0]);

      if (key[0] === "country") {
        //value will be country name; returning the names.js object of sids info
        let countryObject = this.sidsByName[value];
        let bbox = this.sidsByName[value].bb;
        console.log(`bounding box is: ${bbox}`);
        // zoomToCountry(object);
        this.$emit("select-country", countryObject); //custom event for parent to hear
      } else if (key[0] === "Resolution") {
        console.log(value[0]);
        console.log('handleGisMenuChange->"Resolution" under construction');
        /*

        if (value[0] === "5km hexbins") {
          object["Resolution"] = "hex5"; // change the text to get the right layer --
          this.changeHexagonSize(object["Resolution"]);
        }

        if (value[0] === "10km hexbins") {
          object["Resolution"] = "hex10";
          this.changeHexagonSize(object["Resolution"]);
        }

        if (value[0] === "1km hexbins") {
          object["Resolution"] = "hex1";
          this.changeHexagonSize(object["Resolution"]);
        }

        if (value[0] === "Admin Regions 1") {
          object["Resolution"] = "admin1";
          this.changeHexagonSize(object["Resolution"]);
        }

        if (value[0] === "Admin Regions 2") {
          object["Resolution"] = "admin2";
          this.changeHexagonSize(object["Resolution"]);
        }
        */
      } else if (key[0] === "region") {
        console.log('handleGisMenuChange->"region" under construction');
        // downloadData(object);
      } else if (key[0] === "basemap") {
        console.log('handleGisMenuChange->"basemap" under construction'); /*
        if (object["basemap"] === "Satellite Imagery") {
          object["basemap"] = "Mapbox Satellite Streets"; //this is the name of layer for mapbox, have to change it here so it Satellite Imagery shows up in the dropdown still
          basemapSwitch(object);
        } else {
          basemapSwitch(object);
        }
        */
      } else if (key[0] === "dual-mode") {
        console.log("dual mode function here");
      } else if (key[0] === "labels") {
        console.log('handleGisMenuChange->"labels" under construction'); /*
        addLabels(object);
        */
      } else if (key[0] === "Color") {
        console.log('handleGisMenuChange->"Color" under construction'); /*
        switchColorScheme(object);
        */
      } else if (key[0] === "bivariate-mode") {
        console.log(
          'handleGisMenuChange->"bivariate-mode" under construction'
        ); /*
        //createBivar(object)
        */
      }
    },
    //handles revealing the internal options of sidebar;
    //my generalized function; intended to handle resol/color/country/basemap
    toggleSidebarMenu(menuName) {
      console.log(`toggleSidebarMenu for: ${menuName}`);
      let className = `${menuName + "-options"}`;

      let menu = document.getElementsByClassName(className)[0];
      if (menu.classList.contains("display-none")) {
        menu.classList.remove("display-none");
      } else {
        menu.classList.add("growUp");
        setTimeout(() => {
          menu.classList.add("display-none");
          menu.classList.remove("growUp");
        }, 280);
      }
    },
    handleBoundariesChange(object) {
      //{boundaryName:Str : this.checked:Bool?}
      // var k = Object.keys(object);
      // var v = Object.values(object);
      console.log("handleBoundariesChange $emitting object");
      console.log(object);
      // addBoundaryLayer(object);//old code; replace with an emit
      this.$emit("select-boundary-layer", object);
    },
  },
  computed: {
    sidsByName() {
      let sidsDictionary = {};
      for (let entry of names) {
        sidsDictionary[entry.NAME_0] = entry;
      }
      console.log("sidsByName computed");
      return sidsDictionary;
    },
  },
  mounted() {
    //1)initialize invisible close-menu div
    console.log("adding listeners to close-menu div");
    let closeMenuDiv = document.getElementsByClassName("close-menu")[0];
    let closeFunction = this.closeAllMenu;
    let addFunction = this.addHover;
    closeMenuDiv.addEventListener("click", function () {
      // this.closeAllMenu();
      // this.addHover();
      closeFunction(); //attempting to proxy
      addFunction();
      closeMenuDiv.classList.add("display-none");
    });

    //2)populate countrySelection with options
    //from old code populateDropdown.js (first half of it)
    console.log("populating country selector");
    let selectEle = document.getElementById("country");

    names.map(function (x) {
      let option = document.createElement("option");
      option.innerHTML = x.NAME_0; //+ ' ' + x.flag; //TODO CONSIDER EMOJI OR SVG FLAGS
      option.classList.add("sidsb"); //TODO doublecheck usage of this class
      option.setAttribute("id", x.GID_0);
      selectEle.appendChild(option);
    });
  },
};
</script>

<style scoped>
/*
.maptoolbar {
}*/

/*below all is taken from old code*/
.menu-box {
  font-family: "Nunito", sans-serif;
  position: absolute;
  width: auto;
  height: auto;
  right: 20px;
  top: 45px;
  padding: 6px 0 0 6px;
  /* background: #c4c4c4; */
  background: none;
  z-index: 998; /*added to bring in front of mapbox map but behind leftsidebar*/
}
.menu {
  position: relative;
}

.country-icon {
  background: url("../assets/gis/sidebar/country-icon.png");
}

.add-boundaries-icon {
  background: url("../assets/gis/sidebar/add-boundaries-icon.png");
}

.resolution-icon {
  background: url("../assets/gis/sidebar/resolution-icon.png");
}

.threeD-icon {
  background: url("../assets/gis/sidebar/3d-icon.png");
}

.twoD-icon {
  background: url("../assets/gis/sidebar/2d-icon.png");
}

.color-icon {
  background: url("../assets/gis/sidebar/color-icon.png");
}

.opacity-icon {
  background: url("../assets/gis/sidebar/opacity-icon.png");
}

.basemap-icon {
  background: url("../assets/gis/sidebar/basemap-icon.png");
}

.aminus-icon {
  background: url("../assets/gis/sidebar/aminus-icon.png");
}

.aplus-icon {
  background: url("../assets/gis/sidebar/aplus-icon.png");
}

.calculator-icon {
  background: url("../assets/gis/sidebar/calculator-icon.png");
}

.upload-icon {
  background: url("../assets/gis/sidebar/upload-icon.png");
}

.bivariate-mode-icon {
  background: url("../assets/gis/sidebar/bivariate-mode-icon.png");
}

.dual-mode-icon {
  background: url("../assets/gis/sidebar/dual-mode-icon.png");
}

.draw-icon {
  background: url("../assets/gis/sidebar/draw-icon.png");
}

.tbd-icon {
  background: url("../assets/gis/sidebar/tbd-icon.png");
}

.download-icon {
  background: url("../assets/gis/sidebar/download-icon.png");
}

.info-icon {
  background: url("../assets/gis/sidebar/info-icon.png");
}

.icon {
  width: 40px; /* originall 40 */
  height: 40px; /* originall 40 */
  position: relative;
  margin: 0 6px 6px 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  z-index: 1000;
}

.description {
  display: none;
  transition: 0.4s;
}

.icon:hover + .hover {
  position: absolute;
  display: block;
  left: -230px;
  top: -20px;
  width: 200px;
  height: 60px;
  background-color: #c4c4c4;
  border-radius: 6px;
  padding: 10px;
  z-index: 1000000;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  animation-timing-function: ease-in-out;
  animation: hoverAnimation 1s;
}

@keyframes hoverAnimation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.partition-line {
  margin: 2px 6px 8px 0;
  height: 1px;
  background-color: black;
}

.menu-drop {
  position: absolute;
  height: 52px;
  top: -6px;
  right: 46px;
  width: auto;
  transform-origin: right;
  background: #c4c4c4;
  padding: 0 0 0 8px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  z-index: 10000;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  animation-timing-function: ease-in-out;
  animation: menu-small-ani 0.6s;
}

.menu-big {
  height: auto;
  background: none;
  padding: 0;
  animation: menu-big-ani 0.5s;
}

@keyframes menu-small-ani {
  0% {
    transform: perspective(350px) rotateY(-40deg);
    opacity: 0;
  }
  100% {
    transform: perspective(350px) rotateY(0deg);
    opacity: 1;
  }
}

@keyframes menu-big-ani {
  0% {
    transform: perspective(350px) rotateY(-20deg) scaleX(0);
    opacity: 0;
  }
  100% {
    transform: perspective(350px) rotateY(0deg) scaleX(1);
    opacity: 1;
  }
}

@keyframes close-menu-small-ani {
  0% {
    transform: perspective(350px) rotateY(0deg);
    opacity: 1;
  }
  100% {
    transform: perspective(350px) rotateY(-20deg) scaleX(0.3);
    opacity: 0;
    display: none;
  }
}

.close-animation {
  animation: close-menu-small-ani 0.6s;
}

.countries {
  position: relative;
  height: 30px; /* original 40px */
  width: 240px;
  background-color: #dfdfdf;
  margin: 0 10px 0 0;
  padding-left: 6px;
  border: 0;
  font-weight: bold;
  font-size: 14px; /** original 16px */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  top: -2px; /** added by seb **/
}

.countries:focus {
  border: 0;
  outline: none;
}

.down-arrow {
  position: absolute;
  right: 18px;
  top: calc(50% - 4px);
  width: 12px;
  height: 8px;
  background: url("../assets/gis/sidebar/down-arrow.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.search-icon {
  width: 30px; /* original 40 */
  height: 30px; /* original 40 */
  margin: 0 8px 0 0;
  /* background: url("assets/gis/sidebar/search-icon.png"); */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.map-text {
  height: 30px; /* original 40 */
  padding: 0 6px;
  line-height: 30px; /* original 40 */
  font-weight: 300;
  font-size: 16px; /* original 20 */
  background-color: #dfdfdf;
}

.menu-drop-resolution {
  right: 0;
}

.country {
  position: relative;
  height: 40px;
  background-color: #dfdfdf;
  margin: 0 6px 0 0;
  padding-left: 8px;
  border: 0;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.country-name {
  width: 200px;
}

.country-options {
  position: absolute;
  top: 40px;
  animation: growDown 0.4s;
  transform-origin: top;
}

@keyframes growDown {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

.country-option {
  height: 46px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.search-input {
  height: 38px;
  width: 190px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  outline: none;
  font-weight: bold;
  border: 0;
}
/*
.fiji {
  background: url("assets/fiji.png");
}

.bermuda {
  background: url("assets/bermuda.png");
}

.haiti {
  background: url("assets/haiti.png");
}

.grenada {
  background: url("assets/grenada.png");
}
*/
.flag {
  width: 38px;
  height: 23px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.resolution {
  position: relative;
  height: 40px;
  width: 180px;
  background-color: #dfdfdf;
  margin: 0 6px 0 0;
  padding-left: 8px;
  border: 0;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.resolution-options {
  position: absolute;
  top: 40px;
  animation: growDown 0.4s;
  transform-origin: top;
}

.resolution-option {
  height: 46px;
  width: 180px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.resolution-menu-icon {
  height: 40px;
  width: 40px;
  background-image: url("../assets/gis/sidebar/resolution-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.color {
  position: relative;
  height: 40px;
  width: 170px;
  background-color: #dfdfdf;
  margin: 0 6px 0 0;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.color-options {
  position: absolute;
  top: 40px;
  animation: growDown 0.4s;
  transform-origin: top;
}

.color-option {
  height: 46px;
  width: 170px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.menu-icon {
  width: 40px;
  height: 40px;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.menu-drop-basemap {
  right: 0;
}

.basemap {
  position: relative;
  height: 40px;
  width: 220px;
  background-color: #dfdfdf;
  margin: 0 6px 0 0;
  padding-left: 8px;
  border: 0;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.selected-basemap {
  width: 220px;
}

.basemap-options {
  position: absolute;
  top: 40px;
  animation: growDown 0.4s;
  transform-origin: top;
}

.basemap-option {
  height: 46px;
  width: 220px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.satellite-icon {
  height: 30px;
  width: 30px;
  background-image: url("../assets/gis/sidebar/satellite-view.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.basemap-menu-icon {
  height: 30px;
  width: 30px;
  background-image: url("../assets/gis/sidebar/basemap-nobg-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.admin-region-one-icon {
  height: 22px;
  width: 16px;
  margin: 0 10px;
  background: url("../assets/gis/sidebar/admin-region-1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.admin-region-two-icon {
  height: 22px;
  width: 16px;
  margin: 0 10px;
  background: url("../assets/gis/sidebar/admin-region-2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.icon-internal {
  width: 40px;
  height: 40px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.opacity-slider {
  -webkit-appearance: none;
  height: 2px;
  background: rgb(0, 0, 0, 0.7);
  outline: none;
  opacity: 0.7;
  margin-right: 10px;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: url("../assets/gis/sidebar/opacity-slider-icon.svg");
  background-size: 100% 100%;
  cursor: pointer;
}

.calculator-nobg-icon {
  height: 21px;
  width: 15px;
  margin-right: 8px;
  background: url("../assets/gis/sidebar/calculator-nobg-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.calc-button {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 16px;
  width: 16px;
  background-color: #c4c4c4;
  border-radius: 5px;
  margin: 0 4px 0 0;
  line-height: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

#layer-input {
  -webkit-appearance: none;
  -moz-appearance: none;
}

.info-nobg-icon {
  height: 18px;
  width: 18px;
  margin-right: 8px;
  background: url("../assets/gis/sidebar/info-nobg-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.download-nobg-icon {
  height: 20px;
  width: 20px;
  margin-left: 12px;
  background: url("../assets/gis/sidebar/download-nobg-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.grey-plus-icon {
  height: 15px;
  width: 15px;
  margin: 0 10px 0 6px;
  background: url("../assets/gis/sidebar/grey-plus-icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.radio-button {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid black;
  background-color: #c4c4c4;
}

.radio-button:checked {
  width: 16px;
  height: 16px;
  background: url("../assets/gis/sidebar/tick-png.png");
  background-size: 100% 100%;
}

.countryorregion {
  position: relative;
  height: 30px;
  width: 170px;
  background-color: #dfdfdf;
  margin: 0 10px 0 8px;
  padding-left: 6px;
  border: 2px solid #cfcfcf;
  font-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.countryorregion:focus {
  border: 2px solid #cfcfcf;
  outline: none;
}

.down-arrow-c {
  position: absolute;
  right: 16px;
  top: calc(50% - 4px);
  width: 12px;
  height: 8px;
  background: url("../assets/gis/sidebar/down-arrow.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.polygon {
  position: relative;
  height: 30px;
  width: 40px;
  background-color: #dfdfdf;
  margin: 0 10px 0 10px;
  padding-left: 6px;
  border: 2px solid #cfcfcf;
  font-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.polygon:focus {
  border: 2px solid #cfcfcf;
  outline: none;
}

.down-arrow-p {
  position: absolute;
  right: 16px;
  top: calc(50% - 4px);
  width: 12px;
  height: 8px;
  background: url("../assets/gis/sidebar/down-arrow.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.year-range-input {
  background: #c4c4c4;
  height: 16px;
  width: 60px;
  border: 1px solid black;
  outline: none;
}

.calc-input::-webkit-scrollbar {
  display: none;
}

#myfile::-webkit-file-upload-button {
  display: none;
}

#myfile {
  width: 340px;
  height: 40px;
  margin: 0 13px 11px 19px;
  text-align: center !important;
  align-items: center;
  padding: 20px 0 0 40px;
  font-weight: bold;
  background-color: #f1f1f1;
  border: 2px black dashed;
  cursor: pointer;
  content: "Select File";
}

#myfile::before {
  content: "Select file or drop file here - ";
}

.menu-with-blue {
  right: 50px !important;
}

.blue-box {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 48px;
  height: 48px;
  background: url("../assets/gis/sidebar/rectangle.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.growUp {
  animation: growUp 0.3s;
  transform-origin: top;
}

@keyframes growUp {
  0% {
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(0);
  }
}

.close-menu,
.sidebarWrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 900;
}

.close-menu,
.menu-box {
  pointer-events: auto;
}

.sidebarWrapper {
  background: transparent;
  pointer-events: none;
}

/* Flex classes */
.row-flex {
  display: flex;
  flex-direction: row;
}

.col-flex {
  display: flex;
  flex-direction: column;
}

.space-between {
  justify-content: space-between;
}

.space-around {
  justify-content: space-around;
}

.full-width {
  width: 100%;
}

.align-items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-start {
  justify-content: flex-start;
}

.align-start {
  align-items: flex-start;
}

.space-evenly {
  justify-content: space-evenly;
}

.align-end {
  align-items: flex-end;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-end {
  justify-content: flex-end;
}

.display-none {
  display: none;
}
/*old code style end*/
</style>
