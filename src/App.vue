<template>
  <v-container data-app class="v-application v-application--is-ltr" id="app" fluid>
    <root-header/>
    <v-row no-gutters id="content">
      <v-col cols="2">
        <nav-menu/>
      </v-col>
      <v-col cols="10">
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
#app{
  padding: 0;
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
</style>
