import '@babel/polyfill'
import Vue from 'vue'
import store from './store'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import dateformat from './directive/dateformat.js'

Vue.use(dateformat)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
