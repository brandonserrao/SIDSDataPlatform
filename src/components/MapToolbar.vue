<!--BRANDON: MY RE-IMPLEMENTATION OF THE OLD RIGHTHAND SIDEBAR TO NEW VUE VERSION-->
<template>
  <div class="sidebarWrapper">
    <!-- Keep this div outside the row   -->
    <div class="close-menu display-none"></div>

    <div class="row container">
      <div class="col-lg-9" style="width: 100%; height: 100vh"></div>

      <div class="col-lg-3">
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
                      <div class="country-name">Search Country or Region</div>
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
                          class="
                            row-flex
                            resolution-option
                            border-blue
                            align-items-center
                          "
                          @click="handleResolutionChange(0, 'hex1')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            1 km
                          </div>
                          <div class="resolution-sub-icon hex1"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
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
                      <div
                        class="row-flex align-items-center"
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
                          @click="handleResolutionChange(6, 'adminRegion1')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            Level 1
                          </div>
                          <div class="resolution-sub-icon adminRegion1"></div>
                        </div>
                        <div
                          class="row-flex resolution-option align-items-center"
                          @click="handleResolutionChange(7, 'adminRegion2')"
                        >
                          <div style="font-weight: bold; margin-left: 4px">
                            Level 2
                          </div>
                          <div class="resolution-sub-icon adminRegion2"></div>
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
                      <div>Viridis</div>
                      <div
                        class="menu-icon color-icon-1"
                        style="margin-right: 30px"
                      ></div>
                    </div>

                    <div
                      class="col-flex color-options display-none options-drop"
                    >
                      <div
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
                      <div
                        class="
                          row-flex
                          space-between
                          basemap-option
                          align-items-center
                        "
                        @click="
                          handleBasemapChange('Satellite', 'satellite-icon')
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
                        @click="handleBasemapChange('A', 'satellite-icon')"
                      >
                        <div>A</div>
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
                        @click="handleBasemapChange('B', 'satellite-icon')"
                      >
                        <div>B</div>
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
                        @click="handleBasemapChange('C', 'satellite-icon')"
                      >
                        <div>C</div>
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
                            @change="handleBoundryChange()"
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
                            @change="handleBoundryChange()"
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
                      min="-50"
                      max="50"
                      @input="
                        handleGisMenuChange({ opacity: $event.target.value })
                      "
                    />
                    <!-- <input type="range" class="opacity-slider" id="opacity" name="opacity" min="-50" max="50" oninput="handleGisMenuChange({'opacity':this.value})"> -->
                  </div>
                </div>
              </div>

              <!-- Labels Select Menu -->
              <div class="menu row-flex">
                <div
                  class="icon aminus-icon"
                  @click="handleLabelsChange('aminus', 'aplus')"
                ></div>
                <div
                  class="icon aplus-icon display-none"
                  @click="handleLabelsChange('aplus', 'aminus')"
                ></div>
                <div class="description hover">A- A+</div>
                <div
                  class="menu-drop row-flex align-items-center display-none"
                ></div>
              </div>
            </div>
          </div>

          <div style="font-weight: 600; color: white; font-size: 18px">
            Analysis
          </div>

          <div class="row-flex">
            <div class="col-flex space-evenly">
              <!-- Raster Calculator -->
              <div class="menu row-flex">
                <div
                  class="icon calculator-icon"
                  @click="handleCalcMenu()"
                ></div>
                <div class="description hover">Calculator</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="calc-menu"
                >
                  <div
                    class="col-flex align-items-center"
                    style="height: auto; width: auto"
                  >
                    <div
                      class="row-flex align-items-center space-between"
                      style="
                        border-top-left-radius: 5px;
                        height: 52px;
                        width: 360px;
                        background-color: #c4c4c4;
                      "
                    >
                      <div class="row-flex align-items-center">
                        <div
                          style="
                            margin: 0 15px;
                            font-weight: bold;
                            font-size: 16px;
                          "
                        >
                          Raster Calculator
                        </div>
                        <div class="calculator-nobg-icon"></div>
                      </div>

                      <div
                        class="info-nobg-icon info-hover-icon-calc"
                        @click="displayInfo('calc')"
                      ></div>
                      <div
                        class="info-icon-blue info-blue-icon-calc display-none"
                        @click="hideInfo('calc')"
                      ></div>
                    </div>
                    <div
                      class="col-flex align-items-center"
                      style="
                        width: 360px;
                        background-color: #c4c4c4;
                        border-bottom-left-radius: 5px;
                        border-bottom-right-radius: 5px;
                      "
                    >
                      <div
                        class="row-flex align-items-center"
                        style="
                          height: 42px;
                          width: 340px;
                          background-color: #dfdfdf;
                          border: 1px solid black;
                        "
                      >
                        <div style="font-weight: bold; margin: 0 8px 0 8px">
                          <i>f(<span id="layer-variables"></span>)=</i>
                        </div>
                        <input
                          type="text"
                          class="calc-input calc-function"
                          style="
                            font-weight: bold;
                            padding: 0 0 0 8px;
                            background-color: #efefef;
                            width: 160px;
                            height: 24px;
                            border-radius: 4px;
                            border: 0;
                            outline: none;
                          "
                        />
                        <div
                          class="color-black"
                          id="input-N"
                          style="margin: 0 8px; cursor: pointer"
                          @click="toggleInputBlueColor(this)"
                        >
                          N
                        </div>
                        <div
                          class="row-flex space-evenly"
                          style="
                            color: green;
                            background-color: #efefef;
                            width: 50px;
                            border-radius: 5px;
                            cursor: pointer;
                          "
                          @click="calculatorRun()"
                        >
                          Run
                        </div>
                      </div>

                      <div
                        class="col-flex"
                        style="
                          height: 54px;
                          width: 340px;
                          background-color: #dfdfdf;
                          border: 1px solid black;
                        "
                      >
                        <div
                          class="row-flex align-items-center"
                          style="margin: 8px 0 6px 30px"
                        >
                          <div
                            class="calc-button"
                            @click="calcButtonPress('-')"
                          >
                            -
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('+')"
                          >
                            +
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('*')"
                          >
                            *
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('%')"
                          >
                            %
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('^')"
                          >
                            ^
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('(')"
                          >
                            (
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress(')')"
                          >
                            )
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('0')"
                            style="margin-left: 7px"
                          >
                            0
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('1')"
                          >
                            1
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('2')"
                          >
                            2
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('3')"
                          >
                            3
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('4')"
                          >
                            4
                          </div>
                        </div>
                        <div
                          class="row-flex align-items-center"
                          style="margin-left: 30px"
                        >
                          <div
                            class="calc-button"
                            @click="calcButtonPress('==')"
                          >
                            ==
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('>=')"
                          >
                            >=
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('<=')"
                          >
                            &lt;=
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('>')"
                          >
                            &gt;
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('<')"
                          >
                            &lt;
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('ln')"
                          >
                            ln
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('.')"
                          >
                            .
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('5')"
                            style="margin-left: 7px"
                          >
                            5
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('6')"
                          >
                            6
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('7')"
                          >
                            7
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('8')"
                          >
                            8
                          </div>
                          <div
                            class="calc-button"
                            @click="calcButtonPress('9')"
                          >
                            9
                          </div>
                        </div>
                      </div>

                      <div class="col-flex" id="layers"></div>

                      <div
                        class="row-flex space-between align-items-center"
                        @click="addLayer()"
                        style="
                          cursor: pointer;
                          position: relative;
                          height: 30px;
                          width: 340px;
                          margin: 6px 0;
                        "
                      >
                        <div
                          class="row-flex"
                          style="
                            line-height: 30px;
                            padding: 0 0 0 10px;
                            width: 100%;
                            height: 100%;
                            border: 0;
                            outline: none;
                            background-color: #dfdfdf;
                            border-radius: 5px;
                          "
                        >
                          Add Layer as Variable
                        </div>
                        <div
                          class="grey-plus-icon"
                          style="position: absolute; right: 0"
                        ></div>
                      </div>
                    </div>
                    <div
                      class="
                        col-flex
                        info-box info-box-calc
                        align-items-center
                        display-none
                      "
                      style="width: 360px"
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
                        Calculator
                      </div>
                      <div
                        class="row-flex align-items-center"
                        style="width: 84%; margin-bottom: 10px"
                      >
                        <div
                          style="margin-top: 12px; font-size: 12px; width: 80%"
                        >
                          Ut fermentum semper mattis. In vel est ac nibh
                          convallis tincidunt. Vestibulum dui arcu, imperdiet
                          non bibendum vestibulum, imperdiet eu est.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-flex">
                    <div class="col-flex grey-rect"></div>
                  </div>
                </div>
                <div class="blue-box blue-box-calc display-none"></div>
              </div>

              <!-- Bivariate Mode -->
              <div class="menu row-flex">
                <div
                  class="icon bivariate-mode-icon"
                  @click="handleBivariateMode()"
                ></div>
                <div class="description hover">Bivariate</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    align-items-center
                    display-none
                    bivariate
                    menu-with-blue
                  "
                >
                  <div
                    class="row-flex align-items-center"
                    style="height: 80%; margin: 0 6px 0 0"
                  >
                    <div
                      class="row-flex align-items-center"
                      style="
                        font-weight: bold;
                        padding-left: 10px;
                        margin: 0 10px 0 0;
                        height: 100%;
                        width: 200px;
                        background-color: #dfdfdf;
                      "
                    >
                      Bivariate Mode Enabled
                    </div>

                    <div
                      class="info-nobg-icon info-hover-icon-bivariate"
                      @click="displayInfo('bivariate')"
                    ></div>
                    <div
                      class="
                        info-icon-blue info-blue-icon-bivariate
                        display-none
                      "
                      @click="hideInfo('bivariate')"
                    ></div>
                  </div>
                  <div
                    class="
                      col-flex
                      info-box info-box-bivariate
                      align-items-center
                      display-none
                    "
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
                      Bivariate Mode
                    </div>
                    <div
                      class="row-flex align-items-center"
                      style="width: 84%; margin-bottom: 10px"
                    >
                      <div
                        style="margin-top: 12px; font-size: 12px; width: 80%"
                      >
                        Ut fermentum semper mattis. In vel est ac nibh convallis
                        tincidunt. Vestibulum dui arcu, imperdiet non bibendum
                        vestibulum, imperdiet eu est.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="blue-box blue-box-bivariate display-none"></div>
              </div>

              <!-- Draw Menu -->
              <div class="menu row-flex">
                <div class="icon draw-icon" @click="handleDrawMenu()"></div>
                <div class="description hover">Draw</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    display-none
                    menu-big menu-with-blue
                  "
                  id="draw-menu"
                >
                  <div
                    class="col-flex align-items-center"
                    style="height: auto; width: auto; position: relative"
                  >
                    <div
                      class="row-flex align-items-center space-evenly"
                      style="
                        border-top-left-radius: 5px;
                        height: 52px;
                        width: 280px;
                        background-color: #c4c4c4;
                      "
                    >
                      <div
                        class="row-flex"
                        style="
                          margin-left: 15px;
                          line-height: 52px;
                          font-weight: bold;
                          font-size: 16px;
                        "
                      >
                        Draw Mode - Region Analysis
                      </div>

                      <div
                        class="info-nobg-icon info-hover-icon-draw"
                        @click="displayInfo('draw')"
                      ></div>
                      <div
                        class="info-icon-blue info-blue-icon-draw display-none"
                        @click="hideInfo('draw')"
                      ></div>
                    </div>
                    <div
                      class="col-flex align-items-center"
                      style="
                        width: 280px;
                        background-color: #c4c4c4;
                        border-bottom-left-radius: 5px;
                        border-bottom-right-radius: 5px;
                      "
                    >
                      <div
                        class="row-flex space-between align-items-center"
                        style="
                          height: 30px;
                          width: 250px;
                          background-color: #dfdfdf;
                        "
                      >
                        <div style="font-weight: bold; margin: 0 10px">
                          Region Polygon 1
                        </div>
                        <div style="margin: 0 10px 0 0"><i>edit</i></div>
                      </div>
                      <div
                        class="row-flex align-items-center"
                        style="margin-top: 5px; width: 250px; height: 90px"
                      >
                        <div style="margin: 0 10px">
                          Draw a polygon for regional analysis.
                        </div>
                      </div>
                      <div
                        class="row-flex align-items-center space-evenly"
                        style="
                          margin: 10px 0;
                          width: 250px;
                          height: 30px;
                          background-color: #dfdfdf;
                          border-radius: 5px;
                        "
                      >
                        <div style="color: #949494; margin: 0 10px">
                          Add polygon to compares
                        </div>
                        <div class="grey-plus-icon"></div>
                      </div>
                    </div>

                    <div
                      class="
                        col-flex
                        info-box info-box-draw
                        align-items-center
                        display-none
                      "
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
                        Draw Mode
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
                <div class="blue-box blue-box-draw display-none"></div>
              </div>

              <!-- Download Menu -->
              <div class="menu row-flex">
                <div class="icon download-icon" @click="toggleMenu(11)"></div>
                <div class="description hover">Download</div>
                <div class="menu-drop row-flex display-none menu-big">
                  <div
                    class="col-flex align-items-center"
                    style="height: auto; width: auto"
                  >
                    <div
                      class="row-flex align-items-center"
                      style="
                        border-top-left-radius: 5px;
                        height: 52px;
                        width: 100%;
                        background-color: #c4c4c4;
                      "
                    >
                      <div
                        class="row-flex align-items-center space-evenly"
                        style="width: 95%"
                      >
                        <div class="row-flex align-items-center">
                          <div
                            class="row-flex"
                            style="
                              margin-left: 15px;
                              line-height: 52px;
                              font-weight: bold;
                              font-size: 16px;
                            "
                          >
                            Data Download
                          </div>
                          <div class="download-nobg-icon"></div>
                        </div>
                      </div>

                      <div
                        class="info-nobg-icon info-hover-icon-download"
                        @click="displayInfo('download')"
                      ></div>
                      <div
                        class="
                          info-icon-blue info-blue-icon-download
                          display-none
                        "
                        @click="hideInfo('download')"
                      ></div>
                    </div>
                    <div
                      class="row-flex space-evenly"
                      style="background-color: #c4c4c4"
                    >
                      <div
                        class="col-flex align-items-center"
                        style="
                          width: 100%;
                          background-color: #dfdfdf;
                          margin: 0 10px 10px 10px;
                        "
                      >
                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 4px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>Region:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              type="radio"
                              id="Visible-Area"
                              name="region"
                              value="Visible-Area"
                              class="radio-button region"
                            />

                            <div
                              class="row-flex align-items-center"
                              style="margin: 0 10px 0 5px"
                            >
                              Visible Area
                            </div>

                            <input
                              class="radio-button region"
                              type="radio"
                              name="region"
                              value="CountryOrRegion"
                            />
                            <div class="row-flex" style="position: relative">
                              <select
                                name="countryorregion"
                                class="countryorregion"
                                id="cuntryorregion"
                              >
                                <option value="Country Or Region">
                                  Country Or Region
                                </option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                              </select>
                              <div class="down-arrow-c"></div>
                            </div>

                            <input
                              class="radio-button region"
                              type="radio"
                              id="Polygon"
                              name="region"
                              value="Polygon"
                            />

                            <div class="row-flex">Polygon</div>
                            <div class="row-flex" style="position: relative">
                              <select
                                name="polygon"
                                class="polygon"
                                id="polygon"
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </select>
                              <div class="down-arrow-p"></div>
                            </div>
                          </div>
                        </div>

                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 8px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>Temporal Resolution:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              class="radio-button temporal-resolution"
                              type="radio"
                              id="chosen-year"
                              name="temporal-resolution"
                              value="chosen-year"
                            />

                            <div style="width: 120px; margin: 0 5px">
                              Chosen Year
                            </div>

                            <input
                              class="radio-button temporal-resolution"
                              type="radio"
                              id="year-range"
                              name="temporal-resolution"
                              value="year-range"
                            />

                            <div class="row-flex" style="margin: 0 10px">
                              Year Range
                            </div>

                            <input
                              type="text"
                              id="year-range-from"
                              name="year-range-from"
                              class="year-range-input"
                            />
                            <div style="margin: 0 10px">to</div>
                            <input
                              type="text"
                              id="year-range-to"
                              name="year-range-to"
                              class="year-range-input"
                            />
                          </div>
                        </div>

                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 8px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>Spatial Resolution:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="1km"
                              name="spatial-resolution"
                              value="1km"
                            />

                            <div style="margin: 0 10px 0 5px">1km</div>
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="2km"
                              name="spatial-resolution"
                              value="2km"
                            />

                            <div style="margin: 0 10px 0 5px">2km</div>
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="5km"
                              name="spatial-resolution"
                              value="5km"
                            />

                            <div style="margin: 0 10px 0 5px">5km</div>
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="10km"
                              name="spatial-resolution"
                              value="10km"
                            />

                            <div style="margin: 0 10px 0 5px">10km</div>
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="admin1"
                              name="spatial-resolution"
                              value="admin1"
                            />

                            <div style="margin: 0 10px 0 5px">Admin1</div>
                            <input
                              class="radio-button spatial-resolution"
                              type="radio"
                              id="admin2"
                              name="spatial-resolution"
                              value="admin2"
                            />

                            <div style="margin: 0 10px 0 5px">Admin2</div>
                          </div>
                        </div>

                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 8px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>Grid Type:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              class="radio-button grid-type"
                              type="radio"
                              id="hex"
                              name="grid-type"
                              value="hex"
                            />

                            <div style="margin: 0 10px 0 5px">Hex</div>
                            <input
                              class="radio-button grid-type"
                              type="radio"
                              id="square"
                              name="grid-type"
                              value="square"
                            />

                            <div style="margin: 0 10px 0 5px">Square</div>
                          </div>
                        </div>

                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 8px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>File Type:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              class="radio-button file-type"
                              type="radio"
                              id="geojson"
                              name="file-type"
                              value="geojson"
                            />

                            <div style="margin: 0 10px 0 5px">Geojson</div>
                            <input
                              class="radio-button file-type"
                              type="radio"
                              id="csv"
                              name="file-type"
                              value="csv"
                            />

                            <div style="margin: 0 10px 0 5px">CSV</div>
                            <input
                              class="radio-button file-type"
                              type="radio"
                              id="geotif"
                              name="file-type"
                              value="geotif"
                            />

                            <div style="margin: 0 10px 0 5px">Geotif</div>
                          </div>
                        </div>

                        <div
                          class="row-flex align-items-center"
                          style="width: auto; margin-top: 8px"
                        >
                          <div
                            style="
                              width: 170px;
                              margin: 0 8px;
                              text-align: right;
                            "
                          >
                            <b>Data Layers:</b>
                          </div>
                          <div
                            class="row-flex align-items-center"
                            style="width: 520px"
                          >
                            <input
                              class="radio-button data-layers"
                              type="radio"
                              id="selected-layer"
                              name="data-layers"
                              value="selected-layer"
                            />

                            <div style="margin: 0 10px 0 5px">
                              Selected Layer
                            </div>
                            <input
                              class="radio-button data-layers"
                              type="radio"
                              id="all-layers"
                              name="data-layers"
                              value="all-layers"
                            />

                            <div style="margin: 0 10px 0 5px">
                              All layers in selected datset
                            </div>
                          </div>
                        </div>

                        <div
                          @click="handleDownload()"
                          class="row-flex space-evenly"
                          style="
                            cursor: pointer;
                            margin: 10px 0;
                            background: #c4c4c4;
                            font-size: 20px;
                            line-height: 35px;
                            width: 130px;
                            height: 35px;
                          "
                        >
                          Download
                        </div>
                        <div class="row-flex" style="margin: 0 10px">
                          For bulk download or access to the full database,
                          please submit a data request here. All data is
                          licensed for redistribution. More information can be
                          found at the data info page.
                        </div>
                      </div>
                    </div>

                    <div
                      class="
                        col-flex
                        info-box info-box-download
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
                        Download
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
            </div>

            <div class="col-flex">
              <!-- Upload Menu -->
              <div class="menu row-flex">
                <div class="icon upload-icon" @click="toggleMenu(12)"></div>
                <div class="description hover">Upload</div>
                <div class="menu-drop row-flex display-none menu-big">
                  <div
                    class="col-flex align-items-center"
                    style="
                      height: auto;
                      width: auto;
                      background-color: #c4c4c4;
                      border-radius: 5px;
                      border-top-right-radius: 0px;
                    "
                  >
                    <div
                      class="col-flex"
                      style="
                        margin: 12px 12px;
                        background-color: #dfdfdf;
                        border-radius: 10px;
                      "
                    >
                      <div
                        class="row-flex align-items-center"
                        style="margin: 16px 13px 14px 19px"
                      >
                        <div style="width: 340px">
                          <b>Upload spatial data</b> for overlay and analysis.
                          Accepted file types include csv, tif, or geojson.
                        </div>
                        <div class="icon upload-icon"></div>
                      </div>
                      <input type="file" id="myfile" name="myfile" />
                    </div>
                  </div>
                  <div class="col-flex">
                    <div class="col-flex grey-rect"></div>
                  </div>
                </div>
              </div>

              <!-- Dual Mode -->
              <div class="menu row-flex">
                <div
                  class="icon dual-mode-icon"
                  @click="handleDualMode()"
                ></div>
                <div class="description hover">Dual Mode</div>
                <div
                  class="
                    menu-drop
                    row-flex
                    align-items-center
                    display-none
                    dual-mode
                    menu-with-blue
                  "
                >
                  <div
                    class="row-flex align-items-center"
                    style="height: 80%; margin: 0 6px 0 0"
                  >
                    <div
                      class="row-flex align-items-center"
                      style="
                        font-weight: bold;
                        padding-left: 10px;
                        margin: 0 10px 0 0;
                        height: 100%;
                        width: 160px;
                        background-color: #dfdfdf;
                      "
                    >
                      Dual Mode Enabled
                    </div>

                    <div
                      class="info-nobg-icon info-hover-icon-dualMode"
                      @click="displayInfo('dualMode')"
                    ></div>
                    <div
                      class="
                        info-icon-blue info-blue-icon-dualMode
                        display-none
                      "
                      @click="hideInfo('dualMode')"
                    ></div>
                  </div>

                  <div
                    class="
                      col-flex
                      info-box info-box-dualMode
                      align-items-center
                      display-none
                    "
                  >
                    <div
                      class="row-flex"
                      style="
                        margin-top: 18px;
                        min-height: 1.6px;
                        width: 80%;
                        background-color: black;
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
                      Dual Mode
                    </div>
                    <div
                      class="row-flex align-items-center"
                      style="margin-bottom: 10px; width: 84%"
                    >
                      <div
                        style="margin-top: 12px; font-size: 12px; width: 80%"
                      >
                        Ut fermentum semper mattis. In vel est ac nibh convallis
                        tincidunt. Vestibulum dui arcu, imperdiet non bibendum
                        vestibulum, imperdiet eu est.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="blue-box blue-box-dual display-none"></div>
              </div>

              <!-- TBD -->
              <div class="menu row-flex">
                <div class="icon tbd-icon" @click="toggleMenu(14)"></div>
                <div class="description hover">TBD</div>
                <div class="menu-drop row-flex align-items-center display-none">
                  <div
                    class="row-flex space-evenly align-items-center"
                    style="
                      width: 60px;
                      background-color: #dfdfdf;
                      height: 80%;
                      font-weight: 700;
                      margin-right: 6px;
                    "
                  >
                    TBD
                  </div>
                </div>
              </div>

              <!-- Info Menu -->
              <div class="menu row-flex">
                <div class="icon info-icon" @click="toggleMenu(15)"></div>
                <div class="description hover">Info</div>
                <div class="menu-drop row-flex display-none menu-big">
                  <div
                    class="col-flex align-items-center"
                    style="
                      margin-top: -16px;
                      height: auto;
                      width: auto;
                      background-color: #c4c4c4;
                      border-top-left-radius: 5px;
                      border-bottom-left-radius: 5px;
                      border-bottom-right-radius: 5px;
                      border-top-right-radius: 5px;
                    "
                  >
                    <div
                      class="row-flex"
                      style="
                        margin: 10px;
                        height: 90px;
                        width: 160px;
                        background-color: #dfdfdf;
                        border-radius: 8px;
                      "
                    >
                      <div style="margin: 10px">Info here....</div>
                    </div>
                  </div>
                  <div class="col-flex">
                    <div class="col-flex grey-rect"></div>
                  </div>
                </div>
              </div>
            </div>
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
    };
  },
  methods: {
    handleGisMenuChange(object) {
      console.log(object);
    },
    //my version: handleBoundariesChange
    handleBoundryChange() {
      var object = {};

      object["boundry-region-1"] =
        document.getElementById("admin-region-1").checked;
      object["boundry-region-2"] =
        document.getElementById("admin-region-2").checked;

      this.handleGisMenuChange(object);
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
      this.handleGisMenuChange(object);
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

      var value;
      var object = {};

      if (first === "aminus") {
        value = "A+";
      } else {
        value = "A-";
      }

      object["Label"] = value;
      this.handleGisMenuChange(object);
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
      this.handleGisMenuChange(object);
    },

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
      this.handleGisMenuChange({ basemap: text });
    },

    handleCountryChange(text, image) {
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

      this.handleGisMenuChange({ Country: text });
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
      this.handleGisMenuChange({ Color: text });
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

    handleResolutionChange(index, val) {
      var resolutionOptions =
        document.getElementsByClassName("resolution-option");

      for (let i = 0; i < resolutionOptions.length; i++) {
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

      this.handleGisMenuChange(object);
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

.adminRegion1 {
  background: url("../assets/gis/sidebar/admin1.png");
}

.adminRegion2 {
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
  background: url("../assets/gis/sidebar/Rectangle.png");
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

.fiji {
  background: url("../assets/gis/sidebar/fiji.png");
}

.bermuda {
  background: url("../assets/gis/sidebar/bermuda.png");
}

.haiti {
  background: url("../assets/gis/sidebar/haiti.png");
}

.grenada {
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
  height: 96%;
  width: 96%;
  z-index: 1000;
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
