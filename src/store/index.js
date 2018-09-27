/**
 * Vuex 使用
 */

import Vue from 'vue'
import Vuex from 'vuex'
import singleChoice from './moduls/singleChoice.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        singleChoice
    }
})