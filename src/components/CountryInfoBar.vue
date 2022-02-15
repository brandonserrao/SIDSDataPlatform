<template>
  <v-card flat class="overflow background-grey">
    <v-row dense>
      <v-col cols="7" md="4">
<<<<<<< HEAD
      <v-subheader class="d-none d-md-block info-bar_header block-header">{{name}}</v-subheader>
        <v-list dense class="indicators-list background-grey"
        >
          <v-list-item v-if="checkIndicator('key-1')">
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-1'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-1').value}}</v-list-item-subtitle>
=======
        <v-subheader class="d-none d-md-block info-bar_header block-header">{{
          country.Country
        }}</v-subheader>
        <v-list dense class="indicators-list background-grey">
          <v-list-item>
            <v-list-item-content class="one-line">
              <v-list-item-title
                class="one-line_header"
                v-text="'Population:'"
              ></v-list-item-title>
              <v-list-item-subtitle>{{
                country.Population.toLocaleString()
              }}</v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-2')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-2'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-2').value}}</v-list-item-subtitle>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'Region:'"
              ></v-list-item-title>
              <v-list-item-subtitle>{{ country.Region }}</v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-3')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-3'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-3').value}}</v-list-item-subtitle>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'Official Language:'"
              ></v-list-item-title>
              <v-list-item-subtitle>{{
                country["Official Language"]
              }}</v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-wdi2-SP.POP.TOTL')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-wdi2-SP.POP.TOTL'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{nFormatter(getIndicator('key-wdi2-SP.POP.TOTL').value)}}</v-list-item-subtitle>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'Surface Area:'"
              ></v-list-item-title>
              <v-list-item-subtitle
                >{{ country["Surface Area"].toLocaleString() }} km<sup
                  >2</sup
                ></v-list-item-subtitle
              >
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-7')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-7'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-7').value}}</v-list-item-subtitle>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'HDI:'"
              ></v-list-item-title>
              <v-list-item-subtitle>{{
                computeHDI(country["Human Development Index"])
              }}</v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-wdi-AG.SRF.TOTL.K2')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-wdi-AG.SRF.TOTL.K2'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{nFormatter(getIndicator('key-wdi-AG.SRF.TOTL.K2').value)}} km<sup>2</sup></v-list-item-subtitle>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'Income Group:'"
              ></v-list-item-title>
              <v-list-item-subtitle>{{
                country["Income Classification"]
              }}</v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-10')">
            <v-list-item-content class="one-line">
<<<<<<< HEAD
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-10'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-10').value}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-hdr-137506')">
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-hdr-137506'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{computeHDI(getIndicator('key-hdr-137506').value)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-wdi2-SI.POV.GINI')">
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header" v-text="indicatorsMetadata['key-wdi2-SI.POV.GINI'].indicator"></v-list-item-title>
              <v-list-item-subtitle>{{getIndicator('key-wdi2-SI.POV.GINI').value}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-13')">
            <v-list-item-content class="one-line">
              <v-list-item-title class="one-line_header">
                <a :href="getIndicator('key-13').value" target="_blank">
                  {{indicatorsMetadata['key-13'].indicator}}
                </a>
              </v-list-item-title>
=======
              <v-list-item-title
                class="one-line_header"
                v-text="'Country Office:'"
              ></v-list-item-title>
              <v-list-item-subtitle>
                <a :href="country['Country Page']" target="_blank">{{
                  country["Country Office"]
                }}</a>
              </v-list-item-subtitle>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="p-0 d-flex align-center" md="4" cols="5">
<<<<<<< HEAD
        <v-img
          class="bg-printable"
          contain
          :src="require(`@/assets/media/profiles-maps/${id}.png`)"
          height="250"
        />
      </v-col>
      <v-col class="p-0 align-center d-none d-md-block" cols="4">
        <v-img
          class="bg-printable"
          cover
          :src="require(`@/assets/media/country-photos/${id}.jpg`)"
          height="100%"
        ></v-img>
=======
        <v-img contain :src="country.map" height="250" />
      </v-col>
      <v-col class="p-0 align-center d-none d-md-block" cols="4">
        <v-img cover :src="country.photo" height="250"></v-img>
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import format from '@/mixins/format.mixin'
import { mapState } from 'vuex';

export default {
<<<<<<< HEAD
  name: 'CountryInfoBar',
  props: ['profile', 'id', 'name'],
  mixins:[format],
  computed:{
    ...mapState({
      indicatorsMetadata: state => state.profiles.indicatorsMetadata
    })
  },
  methods: {
    computeHDI(hdi){
      let hdiNum=parseFloat(hdi),
      hdiClass = "No data";
      if(hdi>=.8){hdiClass="Very high human development"}
      else if(hdi>=0.7){hdiClass="High human development"}
      else if(hdi>=0.550){hdiClass="Medium human development"}
      else if(hdi>0){hdiClass="Low human development"}
      else { hdiClass="No data"; hdiNum="No data"}
      return `${hdiNum}, ${hdiClass}`
    },
    getIndicator(code) {
      return this.profile.find(indicators => indicators.axis === code);
    },
    checkIndicator(code) {
      return this.getIndicator(code) && this.getIndicator(code).value;
    }
  }
}
=======
  name: "CountryInfoBar",
  props: ["country"],
  methods: {
    computeHDI(hdi) {
      let hdiNum = parseFloat(hdi),
        hdiClass = "No data";
      if (hdi >= 0.8) {
        hdiClass = "Very high human development";
      } else if (hdi >= 0.7) {
        hdiClass = "High human development";
      } else if (hdi >= 0.55) {
        hdiClass = "Medium human development";
      } else if (hdi > 0) {
        hdiClass = "Low human development";
      } else {
        hdiClass = "No data";
        hdiNum = "No data";
      }
      return `${hdiNum}, ${hdiClass}`;
    },
  },
};
>>>>>>> 25118b111cc9414932109a5b50a687c2f6aa6516
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indicators-list .one-line {
  flex-wrap: nowrap;
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.overflow {
  overflow: hidden;
}
.one-line_header {
  flex: 0 1 auto !important;
  margin-right: 8px !important;
  text-overflow: none;
  overflow: visible;
}
.info-bar_header {
  padding-top: 10px;
}
.info-bar_map {
  max-height: 230px;
  max-width: 94%;
  margin: auto;
}
</style>
