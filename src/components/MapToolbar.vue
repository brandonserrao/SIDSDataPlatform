<template>
  <div class="sidebarWrapper">
    <!-- Keep this div outside the row   -->
    <div class="close-menu display-none"></div>

    <div class="row container">
      <div class="col-lg-9 HACK"></div>
      <div class="col-lg-3 HACK">
        <div class="menu-box col-flex space-evely align-items-center">
          <!-- <div style="font-weight: 600; color: white; font-size: 18px">
            View
          </div> -->
          <div class="row-flex full-width">
            <div class="col-flex space-evenly">
              <!-- Country Select Menu -->
              <div class="menu row-flex">
                <div class="icon country-icon" @click="toggleMenu(0)"></div>
                <div class="description hover">
                  Map : Select country of your choice
                </div>
                <div
                  class="
                    menu-drop
                    row-flex
                    align-items-center
                    display-none
                    country-select-bar
                  "
                >
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

                    <div
                      id="countryOptions"
                      class="col-flex country-options display-none options-drop"
                    >
                      <country-selector-option
                        v-for="name in names"
                        :key="name.GID_0"
                        :name="name.NAME_0"
                        :id="name.GID_0"
                        :flagCode="name.flagCode"
                        :bbox="name.bbox"
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
                      id="country-search-input"
                      type="text"
                      class="search-input"
                      name="search-country"
                      placeholder="Search Country"
                      @keyup="filterCountries"
                    />
                    <div class="search-icon"></div>
                  </div>
                  <div
                    class="search-icon first-icon"
                    @click="toggleSearchBar(true)"
                  ></div>
                </div>
              </div>

              <!-- Resolution Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon resolution-icon hex5"
                  @click="toggleMenu(1)"
                ></div>
                <div class="description hover">Change Data Resolution</div>
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
                          Choose different level of aggregation of the data
                          layer.
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
                <div class="description hover">Palette Switcher</div>
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
                <div class="description hover">Basemap Switch</div>
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
                      </div>
                      <div
                        class="
                          row-flex
                          space-between
                          basemap-option
                          align-items-center
                        "
                        @click="
                          handleBasemapChange('Light Theme', 'satellite-icon')
                        "
                      >
                        <div>Light Theme</div>
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
                          handleBasemapChange('Dark Theme', 'satellite-icon')
                        "
                      >
                        <div>Dark Theme</div>
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
                <div class="description hover">Administrative Boundaries</div>
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
                              handleBoundryChange('select-boundary-layer', {
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
                              handleBoundryChange('select-boundary-layer', {
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
                          Toggles the display of administrative boundaries.
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
                <div class="description hover">Toggle 3D</div>
                <div
                  class="menu-drop row-flex align-items-center display-none"
                ></div>
              </div>

              <!-- Opacity Select Menu -->
              <div class="menu row-flex">
                <div class="icon opacity-icon" @click="toggleMenu(6)"></div>
                <div class="description hover">Opacity Slider</div>
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

              <!-- Labels Select Menu-->
              <div class="menu row-flex">
                <div
                  class="icon aminus-icon display-none"
                  @click="handleLabelsChange('aminus', 'aplus')"
                ></div>
                <div
                  class="icon aplus-icon"
                  @click="handleLabelsChange('aplus', 'aminus')"
                ></div>
                <div class="description hover">Toggle on/off Map Labels</div>
                <div
                  class="menu-drop row-flex align-items-center display-none"
                ></div>
              </div>
            </div>
          </div>

          <!-- Bottom half of toolbar  -->
          <div class="row-flex">
            <div class="col-flex space-evenly">
              <!-- Raster Calculator -->
              <div class="menu row-flex display-none">
                <div class="icon calculator-icon" @click="toggleMenu(8)"></div>
                <div class="description hover">Calculator</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="raster-menu"
                >
                  Placeholder content
                </div>
              </div>

              <!-- Bivariate Mode -->
              <div class="menu row-flex display-none">
                <div
                  class="icon bivariate-mode-icon"
                  @click="handleBivariateMode()"
                ></div>
                <div class="description hover">Bivariate</div>
                <!-- <div class="menu-drop row-flex align-items-center display-none bivariate menu-with-blue">
                      <div class="row-flex align-items-center" style="height: 40px;margin:0 6px 0 0;">
                        <div class="row-flex" style="font-weight: bold; padding-left: 10px;line-height:40px;margin:0 10px 0 0;height: 40px;width:200px;background-color:#DFDFDF;">Bivariate Mode Enabled</div>
                        <div class="info-nobg-icon"></div>
                      </div>
                    </div> 
                <div class="blue-box blue-box-bivariate display-none"></div>-->
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="bivariate-menu"
                >
                  Placeholder content
                </div>
              </div>

              <!-- Draw Menu -->
              <div class="menu row-flex">
                <div class="icon draw-icon" @click="toggleMenu(10)"></div>
                <!-- <div class="icon draw-icon" onClick="handleDrawMenu()"></div> -->
                <div class="description hover">Custom Regional Analysis</div>
                <!-- <div class="menu-drop row-flex display-none menu-big menu-with-blue" id="draw-menu">
                  
                      <div class="col-flex align-items-center" style="height:auto; width:auto;">
                        <div class="row-flex align-items-center space-evenly" style="border-top-left-radius:5px; height:52px; width: 280px;background-color:#C4C4C4;">
                          <div class="row-flex" style="margin-left: 15px; line-height:52px; font-weight:bold; font-size:16px;">Draw Mode - Region Analysis</div>
                          <div class="info-nobg-icon"></div>
                        </div>
                        <div class="col-flex align-items-center" style="width:280px;background-color:#C4C4C4;border-bottom-left-radius:5px; border-bottom-right-radius:5px;">
                          <div class="row-flex space-between align-items-center" style="height:30px;width:250px;background-color:#DFDFDF">
                            <div style="font-weight:bold; margin:0 10px;" id='drawControls'>Region Polygon 1</div>
                            <div style="margin:0 10px 0 0;"><i>edit</i></div>
                          </div>
                          <div class="row-flex align-items-center" style="margin-top:5px; width:250px;height:90px">
                             <div style="margin:0 10px">Draw a polygon for regional analysis.</div>
                          </div>
                          <div class="row-flex align-items-center space-evenly" style="margin: 10px 0;width:250px;height:30px;background-color:#DFDFDF;border-radius:5px;">
                            <div style="color:#949494;margin:0 10px;">Add polygon to compares</div>
                            <div class="grey-plus-icon"></div>
                          </div>
                        </div>
                      </div>
                      <div class="col-flex">
                        <div class="col-flex" style="width:6px;height:52px;background-color:#C4C4C4"></div>
                      </div>
                    </div>
                    <div class="blue-box blue-box-draw display-none"></div> -->
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="draw-menu"
                >
                  <!-- Placeholder Draw Menu content -->
                  <div id="drawControls"></div>
                </div>
              </div>

              <!-- Download Menu -->
              <div class="menu row-flex display-none">
                <div class="icon download-icon" @click="toggleMenu(11)"></div>
                <div class="description hover">Download Geodata</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="download-menu"
                >
                  Placeholder content
                </div>
              </div>
            </div>

            <div class="col-flex">
              <!-- Upload Menu -->
              <div class="menu row-flex display-none">
                <div class="icon upload-icon" @click="toggleMenu(12)"></div>
                <div class="description hover">Upload Geodata</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="upload-menu"
                >
                  Placeholder content
                </div>
              </div>

              <!-- Dual Mode -->
              <div class="menu row-flex">
                <div
                  class="icon dual-mode-icon"
                  @click="handleDualMode()"
                ></div>
                <div class="description hover">Comparison Slider</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="dual-menu"
                >
                  Placeholder content
                </div>
              </div>

              <!-- Voronoi -->
              <div class="menu row-flex display-none">
                <div
                  class="icon tbd-icon"
                  id="voro"
                  @click="toggleMenu(14)"
                ></div>
                <div class="description hover">Unused Voroni</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="voronoi-menu"
                >
                  Placeholder content
                </div>
              </div>

              <!-- Info Menu -->
              <div class="menu row-flex display-none">
                <div class="icon info-icon" @click="toggleMenu(15)"></div>
                <div class="description hover">Info about this product</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="info-menu"
                >
                  Placeholder content
                </div>
              </div>
            </div>
            <!-- </div>
            </div> -->
            <!--end sidebar!-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import names from "@/gis/static/names";
import CountrySelectorOption from "@/components/CountrySelectorOption";

export default {
  props: ["active_dataset", "active_layer"], //to receive from MapDatasetController via GeospatialData; //currently active_dataset informs handleResolutionChange
  name: "MapToolbar",
  components: {
    CountrySelectorOption,
  },
  data() {
    return {
      names: names, //consider redoing these via props
      currentCountry: "Search Country or Region", //placeholder text for country select searchbar
    };
  },

  computed: {
    sidsByName() {
      let sidsDictionary = {};
      for (let entry of names) {
        sidsDictionary[entry.NAME_0] = entry;
      }

      return sidsDictionary;
    },
  },

  methods: {
    //A) emit update - interpret and emit the desired interaction and necessary data to the parent (GeospatialData.vue)
    handleGisMenuChange(change_type, object = null) {
      //determine type of menuchange based on eventType

      //display loader spinner
      if (!["change-opacity", "toggle-dualmode"].includes(change_type)) {
        console.log(change_type);
        console.log("show spinner for longer GISMenuChange behaviour");
        //repainting opacity expected to be near-instantaneous so not require significant loading time
        let spinner = document.getElementsByClassName("loader-gis")[0];
        let modal = document.getElementsByClassName("loader-gis-modal")[0];
        spinner.classList.remove("display-none");
        modal.classList.remove("display-none");
      }

      //CANDO: extract object packaging and emit to own line outside of typecheck
      if (change_type === "select-country") {
        //value will be country name; returning the names.js object of sids info
        let name = object.text;
        let countryObject = this.sidsByName[name];
        console.log("handleGISMenuChange countryObject", countryObject);
        this.$emit(change_type, countryObject);
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
        let threeD = object.value;
        let threeDObject = { threeD: threeD };
        this.$emit(change_type, threeDObject);
      } else if (change_type === "toggle-labels") {
        let label = object.label;
        let labelObject = { label: label };
        this.$emit(change_type, labelObject);
      } else if (change_type === "toggle-dualmode") {
        console.log("toggle-dualmode emitting");
        this.$emit("toggle-dualmode", object);
      } else if (change_type === "select-boundary-layer") {
        console.log("select-boundary-layer emitting");
        this.$emit("select-boundary-layer", object);
      } else {
        alert(`${change_type} not yet handled by handleGisMenuChange`);
      }
    },

    //B) handle specific toolbar interactions------------------------------------------------------
    handleResolutionChange(index = 1, resolution = "hex5") {
      var resolutionOptions =
        document.getElementsByClassName("resolution-option");

      if (this.active_dataset === "Ocean Data") {
        for (let i = 0; i < resolutionOptions.length; i++) {
          if (i === 2) {
            resolutionOptions[i].classList.add("border-blue");
          } else {
            resolutionOptions[i].classList.remove("border-blue");
          }
        }
      } else {
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
        this.handleGisMenuChange("select-resolution", eventData); //text needs renaming to a better variable name
      }
    },

    handleBoundryChange(change_type, object) {
      // this.$emit("select-boundary-layer", object);
      console.log("handleBoundryChange");
      this.handleGisMenuChange("select-boundary-layer", object);
    },

    handleBasemapChange(text, image) {
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

      let eventData = { name: text, icon: image };
      this.handleGisMenuChange("select-basemap", eventData);
    },

    handleCountryChange(eventData) {
      let text = eventData.name;
      let image = eventData.id;

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

      this.handleGisMenuChange("select-country", eventData); //text needs renaming to a better variable name
    },

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

      this.handleGisMenuChange("toggle-3D", object);
    },

    handleLabelsChange(first, second) {
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

      let object = { label: first === "aminus" ? true : false };

      this.handleGisMenuChange("toggle-labels", object);
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

      this.handleGisMenuChange("select-color", { color: text });
    },

    handleDualMode() {
      console.log("handleDualMode");
      this.handleGisMenuChange("toggle-dualmode");
    },

    handleBivariateMode() {
      console.warn("handleBivariateMode not yet implemented");
      // this.handleGisMenuChange("toggle-bivariate");
    },

    //C) UI manipulation - functions that only change the UI-------------------------------------

    closeAllMenu(index) {
      //closes all open toolbar menus
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

      //hide information controls when done using tools from toolbar
      let drawInfoControl = document
        .getElementById("draw-info-control")
        .classList.add("display-none");
      console.log(drawInfoControl);
    },
    //handles open/closing related behaviour for specified sidebar menu button
    toggleMenu(index) {
      console.log("toggleMenu called for index: ", index);
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

    // TODO: consolidate these toggle functions into a single  toggleXMenu
    toggleBasemapMenu() {
      console.log("toggleBasemapMenu");
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

    toggleCountryMenu(state = null) {
      console.log("toggleBasemapMenu, state: ", state);
      var countryMenu = document.getElementsByClassName("country-options")[0];
      if (
        state == true ||
        (state === null && countryMenu.classList.contains("display-none"))
      ) {
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
      console.log("toggleColorMenu");
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
    //country-select related
    filterCountries() {
      this.toggleCountryMenu(true); //expand country menu to be visible if closed

      // Declare variables
      var input, filter, list, options, country, i, txtValue;
      input = document.getElementById("country-search-input");
      filter = input.value.toUpperCase();
      list = document.getElementById("countryOptions");
      options = list.getElementsByClassName("country-option");

      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < options.length; i++) {
        country = options[i]; //.getElementsByTagName("a")[0];
        txtValue = country.textContent || country.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          // options[i].style.display = "";
          options[i].classList.remove("display-none");
          // resultFound = true;
        } else {
          options[i].classList.add("display-none");
        }
      }
      /*
      let resultFound;
      if (!resultFound) {
        console.log("no result");
        let div = document.createElement("div");
        div.append("No matches found");
        // div.id = "noMatches";
        div.classList.add(
          "no-matches",
          "row-flex",
          "country-option",
          "align-items-center"
        ); //match class formatting for other country-options
        // list.append(div);
        document.getElementsByClassName("country-select-bar")[0].append(div);
      } else {
        // let message = document.getElementById("noMatches");
        let countrySelectBar =
          document.getElementsByClassName("country-select-bar");
        let message = countrySelectBar[0].getElementsByClassName("no-matches");
        message?.remove();
      } */
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
  },

  mounted() {
    //1)initialize invisible close-menu div
    //2)populate countrySelection with options
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
/* 
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
 */
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

.display-block {
  display: block;
}
</style>
