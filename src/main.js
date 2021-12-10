import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
