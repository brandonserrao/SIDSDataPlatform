<template>
  <div class="navigation-container">

    <v-navigation-drawer
      class="d-none d-xs-flex d-sm-flex"
      v-model="drawer"
      absolute
    >
      <v-list class="main-menu" dense>
          <v-list-item
            v-for="route in routes"
            :key="route.link"
            :to="route.link"
          >
            <v-list-item-content>
              <v-list-item-title
                v-text="route.name">
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-list
      class="d-none d-md-flex d-lg-flex d-xl-flex"
      class="main-menu" dense>
        <v-list-item
          v-for="route in routes"
          :key="route.link"
          :to="route.link"
        >
          <v-list-item-content>
            <v-list-item-title
              v-text="route.name">
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </div>
</template>

<script>

export default {
  name: 'NavMenu',
  computed: {
    routes () { return this.$router.options.routes.filter( route => route.path!=='*' )}
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-menu {
  height: 100%;
  padding-top: 25vh;
  text-transform: uppercase;
  text-align: right;
}
.mdl-tabs__tab-bar {
  flex-direction: column;
  height: 100%;
    border-right: 1px solid rgba(10, 11, 49, 0.2);
    border-bottom: none;

}
.mdl-tabs__tab{
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  justify-content: right;
  align-items: center;
  font-size: 14px;
  letter-spacing: 1px;
  text-align: right;

}
.mdl-tabs__tab.is-active {
    border-right: 3px solid #ED462F;
    color: #E21549;
}
.mdl-tabs__tab.is-active:hover {
    color: #E21549;
}
.mdl-tabs__tab:hover {
    background: rgba(158, 158, 158, 0.34);
    color: black;
}
.navigation-container {
  position: relative;
}
</style>
