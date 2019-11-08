import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// --- ui ---
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// --- datetime util ---
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

Vue.config.productionTip = false
Vue.use(Buefy);
dayjs.locale('ja')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
