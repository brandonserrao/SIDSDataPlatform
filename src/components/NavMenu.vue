<template>
  <div class="mdl-tabs__tab-bar">
      <router-link
      v-slot="{ href, navigate, isActive }"
      class="mdl-tabs__tab h5 mdl-js-ripple-effect"
      v-for="route in routes" :key="route.path"
      :to="route.path"
      custom
      >
        <a :class="[isActive && 'is-active']" :href="href" @click="navigate">{{ route.name }}</a>
    </router-link>
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
</style>
