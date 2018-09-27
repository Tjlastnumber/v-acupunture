import '@babel/polyfill'
import Vue from 'vue'
import api from './api'
import store from './store'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import dateformat from './directive/dateformat.js'

Vue.use(dateformat)
Vue.use(api)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
