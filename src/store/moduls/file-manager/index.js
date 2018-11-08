import * as types from './file-manager-types'

const state = {
    files: [],
}

const getters = {
    [types.SELECT_FILE]: (state) => (fileName) => {
        let result = state.files.find(file => file.fileName === fileName)
        return result
    }
}

const mutations = {
    [types.GET_FILE_LIST](state) {
        
    },

    [types.UPLOAD](state, file) {

    },

    [types.DOWNLOAD](state, fileName) {

    },

    [types.DELETE](state, id) {

    }
}

const actions = {
    
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}