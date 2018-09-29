/**
 * Vuex 使用
 */
import Vue from 'vue'
import Vuex from 'vuex'
import singleChoice from './moduls/singleChoice'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userinfo: undefined 
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