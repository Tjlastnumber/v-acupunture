import api from '../../api/singleChoice'
import * as types from './singleChoice-types'

/**
 * 编辑状态
 */
const state = {
    editState: false,
    data: {}
}

const getters = {
    getQuestionById: (state) => (id) => {
        return state.data.lists.find(item => item.id === id)
    }
}

const mutations = {
    /**
     * 开始编辑 
     * @param {Boolean} state 
     */
    [types.START_EDIT](state) {
        state.editState = true
    },

    /**
     * 结束编辑
     * @param {Boolean} state 
     */
    [types.END_EDIT](state) {
        state.editState = false
    },

    /**
     * 填充数据
     */
    [types.SET_SINGLE_CHOICE](state, data) {
        state.data = data
    },

    /**
     * 发布考题失败
     */
    [types.RELEASE_ROLLBACK](state, { id }) {
        const dataItem = state.data.lists.find(item => item.id === id)
        dataItem.isrelease = !dataItem.isrelease
    },

    [types.DELETE_ITEM](state, index) {
        state.data.lists.splice(index, 1)
    },
    
    [types.DELETE_ROLLBACK](state, { cache, index }) {
        state.data.lists.splice(index, 0, cache)
    }
}

const actions = {
    /**
     * 获取分页数据
     */
    [types.GET_PAGES]({ commit }, param) {
        return new Promise((resolve, reject) => {
            api.getPages({
                data: param
            }).then(res => {
                commit(types.SET_SINGLE_CHOICE, res.extend.singlechoice)
                resolve()
            }).catch(err => reject(err))
        })
    },

    /**
     * 发布考题
     */
    [types.RELEASE]( { commit }, item) {
        return new Promise((resolve, reject) => {
            try {
                if (item.isrelease) {
                    api.release(item.id).then(res => {
                        if (res.code !== 100) {
                            commit(types.RELEASE_ROLLBACK, { id: item.id })
                            reject(res.msg)
                        } else {
                            resolve(res)
                        }
                    }).catch(err => {
                        commit(types.RELEASE_ROLLBACK, { id: item.id })
                        reject(err)
                    })
                } else {
                    api.rollbackRelease(item.id).then(res => {
                        if (res.code !== 100) {
                            commit(types.RELEASE_ROLLBACK, { id: item.id })
                            reject(err)
                        } else {
                            resolve(res)
                        }
                        resolve(res)
                    }).catch(err => {
                        commit(types.RELEASE_ROLLBACK, { id: item.id })
                        reject(err)
                    })
                }
            } catch (err) {
                commit(types.RELEASE_ROLLBACK, { id: item.id })
                reject(err)
            }
        })
    },

    [types.DELETE_ITEM]({ commit, state }, item) {
        return new Promise((resolve, reject) => {
            const cache = item
            const index = state.data.lists.indexOf(item) 
            /**
             * 先删除 store 中的数据, 然后再提交
             */
            try {
                commit(types.DELETE_ITEM, index)
                api.deleteSingleChoice(item.id)
                    .then(res => {
                        if (res.code !== 100) {
                            commit(types.DELETE_ROLLBACK, { cache, index })
                            reject(res)
                        }
                        resolve(res)
                    })
                    .catch(err => {
                        commit(types.DELETE_ROLLBACK, { cache, index })
                        reject(err)
                    })
            } catch (err) {
                commit(types.DELETE_ROLLBACK, { cache, index })
                resolve(err)
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}