import '@babel/polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import dateformat from './directive/dateformat.js'

// 引用他 vuex
Vue.use(Vuex)
Vue.use(dateformat)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
