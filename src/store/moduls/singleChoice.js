import api from '../../api/singleChoice'
import * as types from './singleChoice-types'

/**
 * 编辑状态
 */
const state = {
    editState: false,
    editImageState: false,
    data: {},
    loading: false,
    query: {}
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
    },

    [types.UPDATE](state, item) {
        let dataItem = state.data.lists.find(e => e.id === item.id)
        Object.keys(dataItem).map(key => {
            dataItem[key] = item[key]
        })
    },

    [types.ADD](state, item) {
        state.data.lists.splice(0, 0, item)
    },

    [types.LOADING](state, status) {
        state.loading = status
    },

    [types.SET_QUERY](state, query) {
        state.query = query
    }
}

const actions = {
    /**
     * 获取分页数据
     */
    [types.GET_PAGES]({ commit }, param) {
        return new Promise((resolve, reject) => {
            commit(types.LOADING, true)
            try {
                // 缓存查询条件
                commit(types.SET_QUERY, param)
                api.getPages({
                    data: param
                }).then(res => {
                    commit(types.SET_SINGLE_CHOICE, res.extend.singlechoice)
                    resolve()
                }).catch(err => {
                    reject(err)
                }).finally(
                    () => commit(types.LOADING, false)
                )
            } catch (err) {
                commit(types.LOADING, false)
                reject(err)
            }
        })
    },

    [types.RELOAD]({ state, dispatch }) {
        return dispatch(types.GET_PAGES, state.query)
    },

    /**
     * 发布考题
     */
    [types.RELEASE]({ commit }, item) {
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
                            reject(res)
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
            try {
                /**
                 * 先删除 store 中的数据, 然后再提交
                 */
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
    },

    [types.UPDATE]({ commit }, item) {
        return new Promise((resolve, reject) => {
            commit(types.LOADING, true)
            try {
                api.update(item.id, item)
                    .then(res => {
                        if (res.code !== 100) {
                            reject(res)
                        } else {
                            commit(types.UPDATE, item)
                            resolve(res)
                        }
                    }).catch(err => {
                        reject(err)
                    }).finally(
                        () => commit(types.LOADING, false)
                    )
            } catch (err) {
                commit(types.LOADING, false)
                reject(err)
            }
        })
    },

    // eslint-disable-next-line
    [types.ADD]({ }, item) {
        return new Promise((resolve, reject) => {
            try {
                api.add(item).then(res => {
                    if (res.code === 100) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            } catch (err) {
                reject(err)
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