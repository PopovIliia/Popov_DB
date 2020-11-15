import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import dayjs from 'dayjs'
import store from './store'

import axios from 'axios'
//установить для axios стандартный url
axios.defaults.baseURL='http://localhost:80'

Vue.config.productionTip = false;

Vue.filter('formatDate', function(value) {
  if (value) {
  return dayjs(String(value)).format('DD/MM/YYYY')
  }
})
//Глобальный объект axios
Vue.prototype.$axios = axios

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
