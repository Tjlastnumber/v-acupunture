import '@babel/polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/vuetify'
import App from './App.vue'

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
