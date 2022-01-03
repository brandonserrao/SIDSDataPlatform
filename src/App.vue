<template>
  <v-container data-app class="v-application v-application--is-ltr" id="app" fluid>
    <root-header/>
    <v-row no-gutters id="content">
      <v-col>
        <nav-menu/>
      </v-col>
      <v-col cols="10" xs="12" sm="12">
        <router-view class="root-router"/>
      </v-col>
    </v-row>
    <root-footer/>
  </v-container>
</template>
<script>
import RootHeader from '@/components/RootHeader.vue'
import RootFooter from '@/components/RootFooter.vue'
import NavMenu from '@/components/NavMenu.vue'

export default {
  name: 'Root',
  components: {
    RootHeader,
    RootFooter,
    NavMenu
  }
}
</script>
<style>
@import './assets/styles/RootStyles.css';
@import './assets/styles/buttons.css';
@import './assets/styles/text.css';
@import './assets/styles/forms.css';



#app{
  padding: 0;
  background-color: #F4F5F8;
}
#content{
  min-height: calc(100vh - 100px);
}
.root-router {
  padding: 0 2em 4em;
}
:focus {
  outline: none;
}
body, .v-application {
   font-family: 'Proxima Nova', sans-serif !important;
 }
</style>
