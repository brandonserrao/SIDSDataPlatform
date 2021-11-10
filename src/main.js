import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import 'material-design-lite/material.css'
import 'material-design-lite/material.js'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
