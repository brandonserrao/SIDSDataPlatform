<!--BRANDON: Ben's New Form RIGHTHAND SIDEBAR-->
<template>
  <div class="sidebarWrapper">
    <!-- Keep this div outside the row   -->
    <div class="close-menu display-none"></div>

    <div class="row container">
      <div class="col-lg-9 HACK"></div>
      <div class="col-lg-3 HACK">
        <div class="menu-box col-flex space-evely align-items-center">
          <div style="font-weight: 600; color: white; font-size: 18px">
            View
          </div>

          <div class="row-flex full-width">
            <div class="col-flex space-evenly">
              <!-- Country Select Menu -->
              <div class="menu row-flex">
                <div class="icon country-icon" @click="toggleMenu(0)"></div>
                <div class="description hover">
                  Map : Select country of your choice
                </div>
                <div class="menu-drop row-flex align-items-center display-none">
                  <div
                    class="col-flex space-evenly"
                    style="position: relative; height: 100%"
                  >
                    <div
                      class="
                        big-menu
                        row-flex
                        selected-country
                        country
                        align-items-center
                      "
                      @click="toggleCountryMenu()"
                    >
                      <!-- <div class="country-name">Search Country or Region</div> -->
                      <div class="country-name">{{ currentCountry }}</div>
                      <div class="flag" style="margin-right: 40px"></div>
                    </div>

                    <div
                      class="
                        small-menu
                        row-flex
                        selected-country
                        country
                        align-items-center
                        display-none
                      "
                      @click="resetCountryMenu()"
                    >
                      <div class="flag" style="margin-right: 40px">Search</div>
                    </div>

                    <!-- Ben's original hardcoded country-options -->
                    <!--
                    <div
                      class="col-flex country-options display-none options-drop"
                    >
                      <div
                        class="row-flex country-option align-items-center"
                        @click="handleCountryChange('Fiji', 'flag fiji')"
                      >
                        <div class="country-name">Fiji</div>
                        <div class="flag fiji" style="margin-right: 10px"></div>
                      </div>
                      <div
                        class="row-flex country-option align-items-center"
                        @click="handleCountryChange('Bermuda', 'flag bermuda')"
                      >
                        <div class="country-name">Bermuda</div>
                        <div
                          class="flag bermuda"
                          style="margin-right: 10px"
                        ></div>
                      </div>
                      <div
                        class="row-flex country-option align-items-center"
                        @click="handleCountryChange('Haiti', 'flag haiti')"
                      >
                        <div class="country-name">Haiti</div>
                        <div
                          class="flag haiti"
                          style="margin-right: 10px"
                        ></div>
                      </div>
                      <div
                        class="row-flex country-option align-items-center"
                        @click="handleCountryChange('Grenada', 'flag grenada')"
                      >
                        <div class="country-name">Grenada</div>
                        <div
                          class="flag grenada"
                          style="margin-right: 10px"
                        ></div>
                      </div>
                    </div> -->

                    <!-- Brandon's component-based country-options-->
                    <div
                      class="col-flex country-options display-none options-drop"
                    >
                      <country-selector-option
                        v-for="name in names"
                        :key="name.GID_0"
                        :name="name.NAME_0"
                        :id="name.GID_0"
                        :flagCode="name.flagCode"
                        @option-select="handleCountryChange($event)"
                      ></country-selector-option>
                    </div>
                    <div
                      class="down-arrow"
                      style="cursor: pointer"
                      @click="toggleCountryMenu()"
                    ></div>
                  </div>
                  <div
                    class="
                      row-flex
                      align-items-center
                      search-bar
                      display-none
                      full-height
                    "
                  >
                    <input
                      type="text"
                      class="search-input"
                      name="search-country"
                      placeholder="Search Country"
                    />
                    <div class="search-icon"></div>
                  </div>
                  <div
                    class="search-icon first-icon"
                    @click="toggleSearchBar()"
                  ></div>
                </div>
              </div>

              <!-- Resolution Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon resolution-icon hex5"
                  @click="toggleMenu(1)"
                ></div>
                <div class="description hover">
                  Resolution: Select Resolution
                </div>
                <div class="menu-drop row-flex display-none menu-big">
                  <div
                    class="col-flex"
                    style="
                      border-top-left-radius: 10px;
                      background-color: #c4c4c4;
                      border-bottom-left-radius: 5px;
                    "
                  >
                    <div class="row-flex align-items-center space-between">
                      <div
                        class="row-flex align-items-center flex-start"
                        style="
                          margin-left: 15px;
                          height: 40px;
                          font-weight: bold;
                        "
                      >
                        Resolution:
                      </div>

                      <div
                        class="info-nobg-icon info-hover-icon-resolution"
                        @click="displayInfo('resolution')"
                      ></div>
                      <div
                        class="
                          info-icon-blue info-blue-icon-resolution
                          display-none
                        "
                        @click="hideInfo('resolution')"
                      ></div>
                    </div>

                    <div
                      class="col-flex"
                      style="
                        height: 150px;
                        width: 380px;
                        margin: 0 8px 8px 8px;
                        background-color: #dfdfdf;
                      "
                    >
                      <div
                        class="row-flex align-items-center"
                        style="margin-left: 10px; height: 50px"
                      >
                        <div style="margin-right: 15px">Hexbins</div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(0, 'hex1')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            1 km
                          </div>
                          <div class="resolution-sub-icon hex1"></div>
                        </div>
                        <div
                          class="
                            row-flex
                            border-blue
                            resolution-option
                            align-items-center
                          "
                          @click="handleResolutionChange(1, 'hex5')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            5 km
                          </div>
                          <div class="resolution-sub-icon hex5"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(2, 'hex10')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            10 km
                          </div>
                          <div class="resolution-sub-icon hex10"></div>
                        </div>
                      </div>
                      <!-- !!DISABLED UNTIL SQUARE DATA GRIDS ARE AVAILABLE~~ -->
                      <div
                        class="row-flex align-items-center display-none"
                        style="margin-left: 10px; height: 50px"
                      >
                        <div style="margin-right: 15px">Squares</div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(3, 'Square1')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            1 km
                          </div>
                          <div class="resolution-sub-icon Square1"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(4, 'Square5')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            5 km
                          </div>
                          <div class="resolution-sub-icon Square5"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(5, 'Square10')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            10 km
                          </div>
                          <div class="resolution-sub-icon Square10"></div>
                        </div>
                      </div>

                      <div
                        class="row-flex align-items-center"
                        style="margin-left: 10px; height: 50px"
                      >
                        <div style="margin-right: 15px">Admin Regions</div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(6, 'admin1')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            Level 1
                          </div>
                          <div class="resolution-sub-icon admin1"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(7, 'admin2')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            Level 2
                          </div>
                          <div class="resolution-sub-icon admin2"></div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="
                        col-flex
                        info-box info-box-resolution
                        align-items-center
                        display-none
                      "
                      style="width: calc(100% - 8px)"
                    >
                      <div
                        style="
                          margin-top: 18px;
                          height: 1.6px;
                          background-color: black;
                          width: 80%;
                        "
                      ></div>
                      <div
                        class="row-flex"
                        style="
                          width: 84%;
                          margin-top: 15px;
                          font-weight: bold;
                          font-size: 16px;
                        "
                      >
                        Resolution
                      </div>
                      <div
                        class="row-flex align-items-center"
                        style="width: 84%; margin-bottom: 10px"
                      >
                        <div
                          style="margin-top: 12px; font-size: 12px; width: 80%"
                        >
                          Draw mode is a nice mode in which you draw some
                          polygons and triangles really great.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-flex">
                    <div class="col-flex grey-rect"></div>
                  </div>
                </div>
              </div>

              <!-- Color Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon color-icon color-icon-1"
                  @click="toggleMenu(2)"
                ></div>
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
                  <div style="margin-right: 12px; width: 120px">
                    Color Scheme:
                  </div>
                  <div
                    class="col-flex space-evenly full-height"
                    style="position: relative"
                  >
                    <div
                      class="
                        row-flex
                        space-between
                        selected-color
                        color
                        align-items-center
                      "
                      @click="toggleColorMenu()"
                    >
                      <div>Palettes</div>
                      <div
                        class="menu-icon color-icon-1"
                        style="margin-right: 30px"
                      ></div>
                    </div>

                    <div
                      class="col-flex color-options display-none options-drop"
                    >
                      <!-- <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('Viridis', 'color-icon-2')"
                      >
                        <div>Viridis</div>
                        <div class="menu-option-icon color-icon-2"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('A', 'color-icon-1')"
                      >
                        <div>A</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('B', 'color-icon-2')"
                      >
                        <div>B</div>
                        <div class="menu-option-icon color-icon-2"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('C', 'color-icon-1')"
                      >
                        <div>C</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div> -->
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('original', 'color-icon-2')"
                      >
                        <div>Default</div>
                        <div class="menu-option-icon color-icon-2"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('invert', 'color-icon-1')"
                      >
                        <div>Invert Current</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('red', 'color-icon-2')"
                      >
                        <div>Reds</div>
                        <div class="menu-option-icon color-icon-2"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('purple', 'color-icon-1')"
                      >
                        <div>Purples</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="handleColorChange('blue', 'color-icon-1')"
                      >
                        <div>Blues</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          color-option
                          align-items-center
                        "
                        @click="
                          handleColorChange('colorblind-safe', 'color-icon-1')
                        "
                      >
                        <div>Colorblind Safe</div>
                        <div class="menu-option-icon color-icon-1"></div>
                      </div>
                    </div>

                    <div
                      class="down-arrow"
                      style="cursor: pointer"
                      @click="toggleColorMenu()"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Basemap Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon basemap-icon-handle basemap-icon"
                  @click="toggleMenu(3)"
                ></div>
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
                  <div
                    class="col-flex full-height align-items-center space-evenly"
                    style="position: relative"
                  >
                    <div
                      class="
                        row-flex
                        space-between
                        selected-basemap
                        basemap
                        align-items-center
                      "
                      @click="toggleBasemapMenu()"
                    >
                      <div>Satellite Imagery</div>
                      <div
                        class="menu-icon-satellite satellite-icon"
                        style="margin-right: 36px"
                      ></div>
                    </div>

                    <div
                      class="col-flex basemap-options display-none options-drop"
                    >
                      <!-- <div
                        class="
                          row-flex
                          space-between
                          basemap-option
                          align-items-center
                        "
                        @click="
                          handleBasemapChange(
                            'Satellite Imagery',
                            'satellite-icon'
                          )
                        "
                      >
                        <div>Satellite Imagery</div>
                        <div
                          class="menu-option-icon-satellite satellite-icon"
                          style="margin-right: 10px"
                        ></div>
                      </div> -->
                      <div
                        class="
                          row-flex
                          space-between
                          basemap-option
                          align-items-center
                        "
                        @click="
                          handleBasemapChange(
                            'Mapbox Satellite Streets',
                            'satellite-icon'
                          )
                        "
                      >
                        <div>Mapbox Satellite Streets</div>
                        <div
                          class="menu-option-icon-satellite satellite-icon"
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
                          class="menu-option-icon-satellite satellite-icon"
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
                          class="menu-option-icon-satellite satellite-icon"
                          style="margin-right: 10px"
                        ></div>
                      </div>
                    </div>

                    <div class="down-arrow" @click="toggleBasemapMenu()"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-flex">
              <!-- Boundaries Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon add-boundaries-icon"
                  @click="toggleMenu(4)"
                ></div>
                <div class="description hover">Boundaries</div>
                <div class="menu-drop row-flex display-none menu-big">
                  <div
                    class="col-flex"
                    style="
                      height: auto;
                      width: auto;
                      background-color: #c4c4c4;
                      border-bottom-right-radius: 5px;
                      border-bottom-left-radius: 5px;
                      border-top-left-radius: 5px;
                    "
                  >
                    <div class="row-flex align-items-center space-between">
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
                        class="info-nobg-icon info-hover-icon-boundaries"
                        @click="displayInfo('boundaries')"
                      ></div>
                      <div
                        class="
                          info-icon-blue info-blue-icon-boundaries
                          display-none
                        "
                        @click="hideInfo('boundaries')"
                      ></div>
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
                          width: 190px;
                          margin: 0 10px 8px 10px;
                          background-color: #dfdfdf;
                          padding: 10px 10px;
                        "
                      >
                        <div class="row-flex align-items-center">
                          <div class="text">Admin Region 1</div>
                          <div class="admin-region-one-icon"></div>
                          <input
                            type="checkbox"
                            id="admin-region-1"
                            name="admin-region"
                            value="admin-region-one"
                            @change="
                              handleBoundryChange({
                                'admin1-overlay': $event.target.checked,
                              })
                            "
                          />
                        </div>
                        <div
                          class="row-flex align-items-center"
                          style="margin-top: 10px"
                        >
                          <div class="text">Admin Region 2</div>
                          <div class="admin-region-two-icon"></div>
                          <input
                            type="checkbox"
                            id="admin-region-2"
                            name="admin-region"
                            value="admin-region-two"
                            @change="
                              handleBoundryChange({
                                'admin2-overlay': $event.target.checked,
                              })
                            "
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      class="
                        col-flex
                        info-box info-box-boundaries
                        align-items-center
                        display-none
                      "
                      style="width: calc(100% - 8px)"
                    >
                      <div
                        style="
                          margin-top: 18px;
                          height: 1.6px;
                          background-color: black;
                          width: 80%;
                        "
                      ></div>
                      <div
                        class="row-flex"
                        style="
                          width: 84%;
                          margin-top: 15px;
                          font-weight: bold;
                          font-size: 16px;
                        "
                      >
                        Boundaries
                      </div>
                      <div
                        class="row-flex align-items-center"
                        style="width: 84%; margin-bottom: 10px"
                      >
                        <div
                          style="margin-top: 12px; font-size: 12px; width: 80%"
                        >
                          Draw mode is a nice mode in which you draw some
                          polygons and triangles really great.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-flex">
                    <div class="col-flex grey-rect"></div>
                  </div>
                </div>
              </div>

              <!-- Height Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon threeD-icon"
                  @click="handleHeightChange('threeD', 'twoD')"
                ></div>
                <div
                  class="icon twoD-icon display-none"
                  @click="handleHeightChange('twoD', 'threeD')"
                ></div>
                <div class="description hover">3D 2D</div>
                <div
                  class="menu-drop row-flex align-items-center display-none"
                ></div>
              </div>
              <!--
              <div class="menu row-flex">
                <div
                  class="icon threeD-icon"
                  @click="handleHeightChange('toggle-3D', 'twoD')"
                ></div>
                <div
                  class="icon twoD-icon display-none"
                  @click="handleHeightChange('toggle-3D', 'threeD')"
                ></div>
                <div class="description hover">3D 2D</div>
                <div
                  class="menu-drop row-flex align-items-center display-none"
                ></div>
              </div>
 -->
              <!-- Opacity Select Menu -->
              <div class="menu row-flex">
                <div class="icon opacity-icon" @click="toggleMenu(6)"></div>
                <div class="description hover">Opacity</div>
                <div class="menu-drop row-flex align-items-center display-none">
                  <div
                    class="row-flex align-items-center"
                    style="
                      height: 80%;
                      margin: 0 6px 0 0;
                      background-color: #dfdfdf;
                    "
                  >
                    <div style="margin: 0 10px">Opacity:</div>
                    <input
                      type="range"
                      class="opacity-slider"
                      id="opacity"
                      name="opacity"
                      min="0"
                      max="50"
                      @input="
                        handleGisMenuChange('change-opacity', {
                          opacity: $event.target.value,
                        })
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- Labels Select Menu

              "handleLabelsChange('aminus', 'aplus')"

              -->
              <div class="menu row-flex">
                <!--
                <div
                  class="icon aminus-icon"
                  @click="emit_toggle_legend()"
                ></div> -->
                <div
                  class="icon aminus-icon display-none"
                  @click="handleLabelsChange('aminus', 'aplus')"
                ></div>
                <div
                  class="icon aplus-icon"
                  @click="handleLabelsChange('aplus', 'aminus')"
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
    </div>
    <!-- SPINNER LOADER -->
    <!--
    <div class="loader-gis">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="170"
        height="170"
        viewbox="0 0 200 173.20508075688772"
      >
        <path
          fill="#003399"
          d="M0 86.60254037844386L50 0L150 0L200 86.60254037844386L150 173.20508075688772L50 173.20508075688772Z"
        ></path>
      </svg>
    </div> -->
  </div>
</template>

<script>
import names from "@/gis/static/names";
import CountrySelectorOption from "@/components/CountrySelectorOption";

export default {
  props: ["active_dataset", "active_layer"], //to receive from MapDatasetController via GeospatialData
  name: "MapToolbar",
  components: {
    CountrySelectorOption,
  },
  data() {
    return {
      names: names, //consider redoing these via props
      debug: true,
      currentCountry: "Search Country or Region", //placeholder text for country select searchbar
    };
  },
  methods: {
    emit_toggle_legend() {
      this.$emit("toggle-legend");
    },
    handleGisMenuChange(change_type, object) {
      //determine type of menuchange based on eventType
      console.log(`change_type: ${change_type}`);
      console.log("handleGisMenuChange: object passed:");
      console.log(object);

      //display loader spinner
      if (!(change_type === "change-opacity")) {
        console.log("showing loading spinner");
        let spinner = document.getElementsByClassName("loader-gis")[0];
        console.log(spinner);
        spinner.classList.remove("display-none");
        console.log(spinner);
      }

      //CANDO: extract object packaging and emit to own line outside of typecheck
      if (change_type === "select-country") {
        //value will be country name; returning the names.js object of sids info
        let name = object.text;
        let flag = object.flag;
        console.log(`name: ${name} flag: ${flag}`);
        let countryObject = this.sidsByName[name];
        let bbox = this.sidsByName[name].bb;
        console.log(`bounding box ${bbox}`);

        this.$emit(change_type, countryObject); //custom event for parent to hear

        document.getElementsByClassName("country-name")[0].textContent = name;
      } else if (change_type === "select-resolution") {
        let resolution = object.resolution;
        let resolutionObject = { resolution: resolution };
        this.$emit(change_type, resolutionObject);
      } else if (change_type === "select-basemap") {
        let basemap = object.name;
        let icon = object.icon;
        let basemapObject = { name: basemap, icon: icon };
        this.$emit(change_type, basemapObject);
      } else if (change_type === "change-opacity") {
        let opacity = object.opacity;
        let opacityObject = { opacity: opacity };
        this.$emit(change_type, opacityObject);
      } else if (change_type === "select-color") {
        let color = object.color;
        let colorObject = { color: color };
        this.$emit(change_type, colorObject);
      } else if (change_type === "toggle-3D") {
        //obj.value = "2D" or "3D"
        let threeD = object.value;
        let threeDObject = { threeD: threeD };
        this.$emit(change_type, threeDObject);
      } else if (change_type === "toggle-labels") {
        let label = object.label;
        let labelObject = { label: label };
        this.$emit(change_type, labelObject);
      } else {
        console.log(`${change_type} not yet handled by handleGisMenuChange`);
      }
    },

    handleResolutionChange(index = 1, resolution = "hex5") {
      //index=1, resolution='hex5' are the desired default state
      console.log("handleResolutionChange");

      //case: empty arguments; shouldn't happen due to default arguements
      /*       if (!index || !resolution) {
        //handle empty args as a reset event and raise higher level log
        alert(`handleResolutionChange called with: ${index} and ${resolution}`);
        console.log("empty handleResolutionChange called: doing nothing");
        return;
      } */

      var resolutionOptions =
        document.getElementsByClassName("resolution-option");

      if (this.active_dataset === "Ocean Data") {
        //handle if called while ocean dataset active
        console.log(
          `active_dataset: ${this.active_dataset}; set resolution selector to 10, do nothing`
        );

        for (let i = 0; i < resolutionOptions.length; i++) {
          if (i === 2) {
            //i = 2 is the hardcoded index for the 10km selector
            resolutionOptions[i].classList.add("border-blue");
          } else {
            resolutionOptions[i].classList.remove("border-blue");
          }
        }
      } else {
        //handle if non-ocean dataset active
        console.log(
          `active_dataset: ${this.active_dataset}; switching resolution`
        );
        /*
        var resolutionOptions = document.getElementsByClassName("resolution-option");
 */
        for (let i = 0; i < resolutionOptions.length; i++) {
          if (index === i) {
            resolutionOptions[i].classList.add("border-blue");
          } else {
            resolutionOptions[i].classList.remove("border-blue");
          }
        }

        document.getElementsByClassName("resolution-icon")[0].className =
          "icon resolution-icon " + resolution;

        let eventData = { index: index, resolution: resolution };
        // this.handleGisMenuChange({ Resolution: text });
        console.log("passing eventData to handleGisMenuChange");
        this.handleGisMenuChange("select-resolution", eventData); //text needs renaming to a better variable name
      }
    },

    //my version: handleBoundariesChange
    handleBoundryChange(object) {
      //my code from handleBoundariesChange(object)
      console.log("handleBoundryChange $emitting object");
      console.log(object);
      // addBoundaryLayer(object);//old code; replace with an emit
      this.$emit("select-boundary-layer", object);
    },

    handleBasemapChange(text, image) {
      console.log("handleBasemapChange");
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

      // this.handleGisMenuChange({ basemap: text });
      console.log(
        "passing handleBasemapChange eventData to handleGisMenuChange"
      );
      let eventData = { name: text, icon: image };
      this.handleGisMenuChange("select-basemap", eventData);
    },

    handleCountryChange(eventData) {
      console.log(`handleCountryChange:`);
      console.log(eventData);
      let text = eventData.name;
      let image = eventData.id;

      //Brandon - considering changing to tak
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

      // this.handleGisMenuChange({ Country: text });
      console.log(
        "passing handleCountryChange eventData to handleGisMenuChange"
      );
      this.handleGisMenuChange("select-country", eventData); //text needs renaming to a better variable name
    },

    closeAllMenu(index) {
      console.log(`closeAllMenu(${index})`);
      var allMenu = document.getElementsByClassName("menu-drop");

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

      var blueBox = document.getElementsByClassName("blue-box");

      for (let i = 0; i < blueBox.length; i++) {
        blueBox[i].classList.add("display-none");
      }

      var options = document.getElementsByClassName("options-drop");

      for (let i = 0; i < options.length; i++) {
        options[i].classList.add("display-none");
      }

      var infoBox = document.getElementsByClassName("info-box");

      for (let i = 0; i < infoBox.length; i++) {
        infoBox[i].classList.add("display-none");
      }

      var infoIconBlue = document.getElementsByClassName("info-icon-blue");
      var infoNoBgIconBlue = document.getElementsByClassName("info-nobg-icon");

      for (let i = 0; i < infoIconBlue.length; i++) {
        infoIconBlue[i].classList.add("display-none");
        infoNoBgIconBlue[i].classList.remove("display-none");
      }
    },

    //handles open/closing related behaviour for sidebar menu
    toggleMenu(index) {
      var allMenu = document.getElementsByClassName("menu-drop");

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

    //country-select related
    resetCountryMenu() {
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
    },
    //country-select related
    toggleSearchBar() {
      document
        .getElementsByClassName("search-bar")[0]
        .classList.remove("display-none");
      document
        .getElementsByClassName("country-options")[0]
        .classList.add("display-none");
      document
        .getElementsByClassName("first-icon")[0]
        .classList.add("display-none");
      document
        .getElementsByClassName("big-menu")[0]
        .classList.add("display-none");
      document
        .getElementsByClassName("small-menu")[0]
        .classList.remove("display-none");
    },

    //NEW--------------------------------------------
    toggleInputBlueColor(event) {
      if (event.classList.contains("color-black")) {
        event.className = "color-blue";
      } else {
        event.className = "color-black";
      }
    },

    toggleBlueColor(event) {
      if (event.classList.contains("color-black")) {
        event.className = "color-blue layers-N";
      } else {
        event.className = "color-black layers-N";
      }
    },
    hideInfo(val) {
      document
        .getElementsByClassName("info-hover-icon-" + val)[0]
        .classList.remove("display-none");
      document
        .getElementsByClassName("info-blue-icon-" + val)[0]
        .classList.add("display-none");
      document
        .getElementsByClassName("info-box-" + val)[0]
        .classList.add("display-none");
    },

    displayInfo(val) {
      document
        .getElementsByClassName("info-hover-icon-" + val)[0]
        .classList.add("display-none");
      document
        .getElementsByClassName("info-blue-icon-" + val)[0]
        .classList.remove("display-none");
      document
        .getElementsByClassName("info-box-" + val)[0]
        .classList.remove("display-none");
    },

    removeHover() {
      var description = document.getElementsByClassName("description");

      for (let i = 0; i < description.length; i++) {
        description[i].classList.remove("hover");
      }
    },

    addHover() {
      var description = document.getElementsByClassName("description");

      for (let i = 0; i < description.length; i++) {
        description[i].classList.add("hover");
      }
    },

    //IRRELEVANT RIGHT NOW---------------------------

    //only used in this function apparently; why is it even outside?
    //  let count = "a";
    addLayer() {
      let count = "a"; //moved in from outside
      var layers = document.getElementsByClassName("layer-input");
      var index = [];

      for (let i = 0; i < layers.length; i++) {
        index.push(layers[i].selectedIndex);
      }

      document.getElementById("layers").innerHTML =
        document.getElementById("layers").innerHTML +
        `
          <div id='` +
        count +
        `-layer' class="row-flex align-items-center" style="margin-top:6px;">
            <div class="row-flex align-items-center space-evenly" style="margin-right:6px; background-color:#A9A9A9;width:30px; height:30px;border-radius:5px;text-align:center; cursor:pointer;" @click="addVariables('` +
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
                <div class="color-black layers-N" style="cursor:pointer;" @click="toggleBlueColor(this)">N</div>
                <div class="row-flex align-items-center" style="margin: 0 10px;cursor: pointer;height:10px;width:11px;" @click="removeLayer('` +
        count +
        `')">
                  <div style="width:11px; height:1.5px; background-color:brown"></div>
                </div>
              </div>
            </div>
          </div>`;

      for (let i = 0; i < layers.length; i++) {
        layers[i].selectedIndex = index[i];
      }

      count = String.fromCharCode(count.charCodeAt(0) + 1);
    },

    calculatorRun() {
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
      for (let i = 0; i < layersValue.length; i++) {
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

      console.log("caculatorRun->handleGisMenuChange");
      this.handleGisMenuChange(object);
    },

    calcButtonPress(val) {
      document.getElementsByClassName("calc-function")[0].value =
        document.getElementsByClassName("calc-function")[0].value + val;
      document.getElementsByClassName("calc-function")[0].focus();
    },

    addVariables(val) {
      document.getElementsByClassName("calc-function")[0].value =
        document.getElementsByClassName("calc-function")[0].value + val;
      document.getElementsByClassName("calc-function")[0].focus();

      var layerVariables = document.getElementById("layer-variables");

      if (layerVariables.innerHTML == "") {
        layerVariables.innerHTML += val;
      } else {
        var string = layerVariables.innerHTML;
        var present = false;
        for (let i = 0; i < string.length; i++) {
          if (string[i] === val) {
            present = true;
          }
        }
        if (!present) {
          layerVariables.innerHTML += "," + val;
        }
      }
    },
    //a calculator-related function i believe
    removeLayer(layer) {
      document.getElementById("" + layer + "-layer").remove();
      let layerVariables = document.getElementById("layer-variables");
      if (layerVariables.innerHTML.length === 1) {
        layerVariables.innerHTML = "";
      } else {
        let string = layerVariables.innerHTML;
        for (let i = 0; i < string.length; i++) {
          if (string[i] === layer) {
            if (i != 0 && string[i - 1] === ",") {
              let val = string.replace("," + layer, "");
              layerVariables.innerHTML = val;
              break;
            } else {
              let val = string.replace(layer + ",", "");
              layerVariables.innerHTML = val;
              break;
            }
          }
        }
      }
    },

    handleDownload() {
      var object = {};

      var regions = document.getElementsByClassName("region");
      for (let i = 0; i < regions.length; i++) {
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
      for (let i = 0; i < temporalResolution.length; i++) {
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

      var spatialResolution =
        document.getElementsByClassName("spatial-resolution");
      for (let i = 0; i < spatialResolution.length; i++) {
        if (spatialResolution[i].checked === true) {
          object["Spatial-resolution"] = spatialResolution[i].value;
        }
      }

      var gridType = document.getElementsByClassName("grid-type");
      for (let i = 0; i < gridType.length; i++) {
        if (gridType[i].checked === true) {
          object["Grid-type"] = gridType[i].value;
        }
      }

      var fileType = document.getElementsByClassName("file-type");
      for (let i = 0; i < fileType.length; i++) {
        if (fileType[i].checked === true) {
          object["File-type"] = fileType[i].value;
        }
      }

      var dataLayers = document.getElementsByClassName("data-layers");
      for (let i = 0; i < dataLayers.length; i++) {
        if (dataLayers[i].checked === true) {
          object["Data-layers"] = dataLayers[i].value;
        }
      }

      console.log("handleDownload->handleGisMenuChange");
      this.handleGisMenuChange(object);
    },

    handleCalcMenu() {
      document
        .getElementsByClassName("close-menu")[0]
        .classList.add("display-none");
      var calc = document.getElementById("calc-menu");
      if (calc.classList.contains("display-none")) {
        this.removeHover();
        this.closeAllMenu(8);
        document
          .getElementsByClassName("blue-box-calc")[0]
          .classList.remove("display-none");
        calc.classList.remove("display-none");
      } else {
        this.closeAllMenu();
        setTimeout(() => {
          this.addHover();
        }, 500);
        document
          .getElementsByClassName("blue-box-calc")[0]
          .classList.add("display-none");
      }
    },

    handleDrawMenu() {
      document
        .getElementsByClassName("close-menu")[0]
        .classList.add("display-none");
      var draw = document.getElementById("draw-menu");
      if (draw.classList.contains("display-none")) {
        this.removeHover();
        this.closeAllMenu(10);
        document
          .getElementsByClassName("blue-box-draw")[0]
          .classList.remove("display-none");
        draw.classList.remove("display-none");
      } else {
        this.closeAllMenu();
        setTimeout(() => {
          this.addHover();
        }, 500);
        document
          .getElementsByClassName("blue-box-draw")[0]
          .classList.add("display-none");
      }
    },

    //TO LOOK AT STILL--------------------------------

    //need to look at how it works/implemented in old version first
    handleHeightChange(first, second) {
      var curr = document.getElementsByClassName(first + "-icon")[0];
      var reqd = document.getElementsByClassName(second + "-icon")[0];

      this.closeAllMenu();

      //animation triggering of the button
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

      //packaging info object to pass on
      var value;
      var object = {};

      if (first === "threeD") {
        value = "2D";
      } else {
        value = "3D";
      }

      object["height"] = value;
      console.log("handleHeightChange->handleGisMenuChange");
      this.handleGisMenuChange("toggle-3D", object);
    },

    handleLabelsChange(first, second) {
      //TODO: simplify this oldcode logic
      var curr = document.getElementsByClassName(first + "-icon")[0];
      var reqd = document.getElementsByClassName(second + "-icon")[0];

      this.closeAllMenu();
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
      /* ///oldcode
      var value;
      var object = {};

      if (first === "aminus") {
        value = "A+";
      } else {
        value = "A-";
      }

      object["Label"] = value;
       */

      let object = { label: first === "aminus" ? true : false };

      console.log("handleLabelsChange->handleGisMenuChange");
      this.handleGisMenuChange("toggle-labels", object);
    },

    handleBivariateMode() {
      document
        .getElementsByClassName("close-menu")[0]
        .classList.add("display-none");

      var bivariate = document.getElementsByClassName("bivariate")[0];
      var object = {};
      var key;
      if (bivariate.classList.contains("display-none")) {
        this.closeAllMenu(9);
        this.removeHover();
        document
          .getElementsByClassName("blue-box-bivariate")[0]
          .classList.remove("display-none");
        bivariate.classList.remove("display-none");
        key = "Enabled";
      } else {
        this.closeAllMenu();
        setTimeout(() => {
          this.addHover();
        }, 500);
        document
          .getElementsByClassName("blue-box-bivariate")[0]
          .classList.add("display-none");
        key = "Disabled";
      }

      object["bivariate-mode"] = key;
      console.log("handleBivariateMode->handleGisMenuChange");
      this.handleGisMenuChange(object);
    },

    handleDualMode() {
      document
        .getElementsByClassName("close-menu")[0]
        .classList.add("display-none");
      var dualMode = document.getElementsByClassName("dual-mode")[0];
      var object = {};
      var key;
      if (dualMode.classList.contains("display-none")) {
        this.closeAllMenu(13);
        this.removeHover();
        document
          .getElementsByClassName("blue-box-dual")[0]
          .classList.remove("display-none");
        dualMode.classList.remove("display-none");
        key = "Enabled";
      } else {
        this.closeAllMenu();
        setTimeout(() => {
          this.addHover();
        }, 500);
        document
          .getElementsByClassName("blue-box-dual")[0]
          .classList.add("display-none");
        key = "Disabled";
      }

      object["dual-mode"] = key;
      console.log("handleDualMode->handleGisMenuChange");
      this.handleGisMenuChange(object);
    },

    handleColorChange(text, image) {
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
      console.log("handleColorChange->handleGisMenuChange");
      this.handleGisMenuChange("select-color", { color: text });
    },

    toggleBasemapMenu() {
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
    },

    toggleCountryMenu() {
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
    },

    toggleColorMenu() {
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
    //2)populate countrySelection with options
    //from old code populateDropdown.js (first half of it)
    let mapToolbar = this;
    document
      .getElementsByClassName("close-menu")[0]
      .addEventListener("click", function () {
        mapToolbar.closeAllMenu();
        mapToolbar.addHover();
        document
          .getElementsByClassName("close-menu")[0]
          .classList.add("display-none");
      });
  },
};
</script>

<style scoped>
.HACK {
  /*deals with the mapnavigation offset issue; caused by Ben's spacing divs for placing the sidebar creating boxes */
  display: contents;
}

.loader-gis {
  position: absolute;
  /* border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px; */
  animation: spin 4s linear infinite;

  z-index: 3;
  left: 45%;
  top: 35%;
}

.loader-gis svg {
  stroke-width: 8;
  fill-opacity: 0.5;
  animation: pulse 1s linear infinite;
  stroke: #003399;
}

body {
  font-family: "Nunito", sans-serif;
}

.menu-box {
  position: absolute;
  width: auto;
  height: auto;
  right: 20px;
  top: 45px;
  padding: 6px 0 0 6px;

  /* background: #c4c4c4; */
  background: none;
  z-index: 1001; /*added to bring in front of mapbox map and in front of leftsidebar*/
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

.threeD-icon {
  background: url("../assets/gis/sidebar/3d-icon.png");
}

.twoD-icon {
  background: url("../assets/gis/sidebar/2d-icon.png");
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

.hex1 {
  background: url("../assets/gis/sidebar/hex1.png");
}

.hex5 {
  background: url("../assets/gis/sidebar/hex5.png");
}

.hex10 {
  background: url("../assets/gis/sidebar/hex10.png");
}

.Square1 {
  background: url("../assets/gis/sidebar/Square1.png");
}

.Square5 {
  background: url("../assets/gis/sidebar/Square5.png");
}

.Square10 {
  background: url("../assets/gis/sidebar/Square10.png");
}

.admin1 {
  background: url("../assets/gis/sidebar/admin1.png");
}

.admin2 {
  background: url("../assets/gis/sidebar/admin2.png");
}

.resolution-sub-icon {
  width: 34px;
  height: 34px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 100;
}

.resolution-option {
  margin-right: 10px;
  align-items: center;
  height: 40px;
  cursor: pointer;
}

.border-blue {
  border: 3px solid #5cefff;
}

.color {
  position: relative;
  height: 80%;
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
  top: 90%;
  animation: growDown 0.4s;
  transform-origin: top;
}

.color-option {
  height: 40px;
  width: 170px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.color-icon-1 {
  background: url("../assets/gis/sidebar/color-icon-1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.color-icon-2 {
  background: url("../assets/gis/sidebar/color-icon-2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.satellite-icon {
  background-image: url("../assets/gis/sidebar/satellite-view.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.menu-icon-satellite {
  width: 32px;
  height: 100%;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.menu-option-icon-satellite {
  width: 35px;
  height: 35px;
  position: relative;
  margin-right: 4px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.menu-icon {
  width: 35px;
  height: 100%;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.menu-option-icon {
  width: 35px;
  height: 35px;
  position: relative;
  margin-right: 4px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

/* Change heights from below 4 css */
.icon {
  width: 40px;
  height: 40px;
  position: relative;
  margin: 0 6px 6px 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  z-index: 1000;
}

.grey-rect {
  width: 8px;
  height: 40px;
  background-color: #c4c4c4;
}

.menu-drop {
  position: absolute;
  height: 40px;
  top: 0;
  right: 100%;
  width: auto;
  transform-origin: right;
  background: #c4c4c4;
  padding: 0 0 0 8px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  z-index: 10000;
  animation: menu-small-ani 0.6s;
}

/* Make Blue box's width and height 8px more than icon's height*/
.blue-box {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 48px;
  height: 48px;
  background: url("/assets/gis/sidebar/rectangle.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
/*Change height from above 4 css*/

.menu-with-blue {
  right: calc(100% + 4px) !important;
}

.menu-big {
  height: auto;
  background: none;
  padding: 0;
  animation: menu-big-ani 0.5s;
}

.description {
  display: none;
  transition: 0.4s;
}

.icon:hover + .hover {
  position: absolute;
  display: block;
  right: calc(100% + 10px);
  top: -10px;
  width: 200px;
  height: 60px;
  background-color: #c4c4c4;
  border-radius: 6px;
  padding: 5px 10px;
  z-index: 1000000;
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
  height: 80%;
  width: 34px;
  margin: 0 8px 0 0;
  background: url("../assets/gis/sidebar/search-icon.png");
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
}

.menu-drop-resolution {
  right: 5px;
}

.country {
  position: relative;
  height: 80%;
  background-color: #dfdfdf;
  margin: 0 6px 0 0;
  padding-left: 8px;
  border: 0;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}

.country-name {
  width: 200px;
}

.country-options {
  position: absolute;
  top: 92%;
  animation: growDown 0.4s;
  transform-origin: top;
  /*added by me to allow scrolling*/
  overflow: auto;
  max-height: 50vh;
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
  height: 40px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.search-input {
  height: 76%;
  width: 190px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  outline: none;
  font-weight: bold;
  border: 0;
}

.full-height {
  height: 100%;
}

.fiji,
.FJI {
  background: url("../assets/gis/sidebar/fiji.png");
}

.bermuda,
.BMU {
  background: url("../assets/gis/sidebar/bermuda.png");
}

.haiti,
.HTI {
  background: url("../assets/gis/sidebar/haiti.png");
}

.grenada,
.GRD {
  background: url("../assets/gis/sidebar/grenada.png");
}

.flag {
  width: 38px;
  height: 23px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.menu-drop-basemap {
  right: 5px;
}

.menu-drop-color {
  right: 5px;
}

.basemap {
  position: relative;
  height: 80%;
  width: 220px;
  background-color: #dfdfdf;
  padding-left: 8px;
  margin-right: 6px;
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
  height: 36px;
  width: 220px;
  background-color: #dfdfdf;
  padding-left: 8px;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
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
  cursor: pointer;
}

.info-icon-blue {
  height: 18px;
  width: 18px;
  margin-right: 8px;
  background: url("../assets/gis/sidebar/info-icon-blue.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
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
  width: 400px;
  height: 70px;
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

.info-box {
  width: 100%;
  height: auto;
  position: absolute;
  top: calc(100% - 4px);
  left: 0;
  background-color: #c4c4c4;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.flip1 {
  animation: flip1 0.15s;
}

@keyframes flip1 {
  0% {
    transform: rotateY(0) perspective(1000px);
  }
  100% {
    transform: rotateY(90deg);
  }
}

.flip2 {
  animation: flip2 0.15s;
}

@keyframes flip2 {
  0% {
    transform: rotateY(90deg) perspective(1000px);
  }
  100% {
    transform: rotateY(0);
  }
}

.color-black {
  color: black;
}

.color-blue {
  color: #3c88fb;
}

.close-menu {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1000;
  /* original value from Ben's Form */
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
</style>
