<template>
  <v-container
    data-app
    class="v-application v-application--is-ltr"
    id="app"
    fluid
  >
    <root-header class="d-none-print" />
    <v-row no-gutters id="content">
      <v-col class="menu-col d-none-print" cols="0" md="2">
        <nav-menu />
      </v-col>
      <v-col cols="12" md="10">
        <router-view class="root-router" />
      </v-col>
    </v-row>
    <root-footer class="d-none d-md-flex d-none-print" />
  </v-container>
</template>
<script>
import RootHeader from "@/components/RootHeader.vue";
import RootFooter from "@/components/RootFooter.vue";
import NavMenu from "@/components/NavMenu.vue";

export default {
  name: "Root",
  components: {
    RootHeader,
    RootFooter,
    NavMenu,
  },
};
</script>
<style>
@import './assets/styles/RootStyles.css';
@import './assets/styles/buttons.css';
@import './assets/styles/text.css';
@import './assets/styles/forms.css';
@import './assets/styles/print.css';
@import './choro/vizEngine.css';

html {
  scroll-behavior: smooth;
}

#app {
  padding: 0;
  background-color: #f4f5f8;
}
#content {
  min-height: calc(100vh - 100px);
  overflow-x: hidden;
}
.root-router {
  padding: 0 2em 4em;
}
:focus {
  outline: none;
}
body,
.v-application {
  font-family: "Proxima Nova", sans-serif !important;
}

@media all and (max-width: 960px) {
  #content {
    min-height: calc(100vh);
  }
  .root-router {
    padding: 0 0 4em;
  }
  .menu-col {
    width: 0 !important;
  }
}
svg {
  overflow: visible !important;
}
</style>
