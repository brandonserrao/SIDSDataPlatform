<template>
  <div
    class="row-flex country-option align-items-center"
    @click="emitCountryChange()"
  >
    <div class="country-name">{{ name }}</div>
    <div
      class="flag flag-icon"
      :class="classObject"
      style="margin-right: 10px"
    ></div>
  </div>
</template>

<script>
export default {
  name: "CountrySelectorOption",
  props: ["name", "id", "flagCode"],
  computed: {
    classObject() {
      let object = {};
      object[
        !this.flagCode
          ? "display-none" //"flag-icon-xx"
          : "flag-icon-" + this.flagCode.toLowerCase()
      ] = true;
      object[!this.id ? "" : this.id] = true;
      return object;
    },
  },
  methods: {
    emitCountryChange() {
      this.$emit("option-select", { text: this.name, flag: this.id }); //emit the name and css selector that links to flag url
    },
  },
};
</script>

<style>
.row-flex {
  display: flex;
  flex-direction: row;
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

.align-items-center {
  align-items: center;
}
.country-name {
  width: 200px;
}
.flag {
  width: 38px;
  height: 23px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
