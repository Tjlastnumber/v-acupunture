/**
 * Vuex 使用
 */
import Vue from 'vue'
import Vuex from 'vuex'
import singleChoice from './moduls/singleChoice.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userinfo: {}
    },
    mutations: {
        login(state, userinfo) {
            state.userinfo = userinfo
        },
        SignOut(state) {
            state.userinfo = undefined
        }
    },
    modules: {
        singleChoice
    }
})