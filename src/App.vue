<template>
  <div>
    <root-header/>
    <div id="content">
      <div class="mdl-grid mdl-grid--no-spacing">
        <div class="mdl-cell mdl-cell--2-col">
          <nav-menu/>
        </div>
        <div>
          <router-view class="root-router"/>
        </div>
      </div>
    </div>
    <root-footer/>
  </div>
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
#content{
  min-height: 100vh
}
</style>
