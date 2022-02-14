import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'flag-icon-css/css/flag-icons.css';

if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: "https://f0106440f0b54e72a1dc96cb8828553a@o1141689.ingest.sentry.io/6200357",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ["data.undp.org", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
