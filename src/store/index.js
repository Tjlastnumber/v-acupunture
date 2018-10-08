/**
 * Vuex 使用
 */
import Vue from 'vue'
import Vuex from 'vuex'
import singleChoice from './moduls/singleChoice'
import apiConfig from '../api/config'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        resourcePath: apiConfig.baseUrl + '/resources/',
        userinfo: undefined,
        snackbar: {
            show: false,
            timeout: 3000,
            color: 'success',
            message: ''
        }
    },
    mutations: {
        login(state, userinfo) {
            state.userinfo = userinfo
        },
        SignOut(state) {
            state.userinfo = undefined
        },
        successNotifation(state, msg) {
            state.snackbar.message = msg
            state.snackbar.show = true
        },
        errorNotifation(state, msg) {
            state.snackbar.message = msg
            state.snackbar.color = 'error'
            state.snackbar.show = true
        }
    },
    modules: {
        singleChoice
    }
})