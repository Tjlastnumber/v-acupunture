import '@babel/polyfill'
import Vue from 'vue'
import api from './api'
import store from './store'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import './directive/directive'
import './store/types'

Vue.use(api)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
