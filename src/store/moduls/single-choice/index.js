import { toFormData } from '../../../utils/util'
import api from '../../../api/single-choice'
import * as types from './single-choice-types'

/**
 * 编辑状态
 */
const state = {
    editState: false,
    editImageState: false,
    data: {},
    editData: {},
    loading: false,
    query: {}
}

const getters = {
    [types.GET_QUESTION_BY_ID]: (state) => (id) => {
        if (!state.data.lists) return {}
        let result = state.data.lists.find(item => item.id === id)
        return result || {}
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

    /**
     * 删除考题
     */
    [types.DELETE_ITEM](state, index) {
        state.data.lists.splice(index, 1)
    },

    /**
     * 删除回滚
     */
    [types.DELETE_ROLLBACK](state, { cache, index }) {
        state.data.lists.splice(index, 0, cache)
    },

    /**
     * 修改考题
     */
    [types.UPDATE](state, item) {
        let dataItem = state.data.lists.find(e => e.id === item.id)
        Object.keys(dataItem).map(key => {
            dataItem[key] = item[key]
        })
    },

    /**
     * 添加考题
     */
    [types.ADD](state, item) {
        state.data.lists.splice(0, 0, item)
    },

    /**
     * 更新加载状态
     */
    [types.LOADING](state, status) {
        state.loading = status
    },

    /**
     * 缓存查询条件
     */
    [types.SET_QUERY](state, query) {
        state.query = query
    },

    [types.EDIT_DATA](state, item) {
        state.editData = item
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
                    if (res.code === 100) {
                        commit(types.SET_SINGLE_CHOICE, res.extend.singlechoice)
                        resolve()
                    } else {
                        reject(res)
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

    /**
     * 重新加载
     */
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

    /**
     * 删除考题
     */
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

    /**
     * 更新考题
     */
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

    /**
     * 添加考题
     */
    // eslint-disable-next-line
    [types.ADD]({ commit }, item) {
        return new Promise((resolve, reject) => {
            try {
                commit(types.LOADING, true)
                api.add(item).then(res => {
                    if (res.code === 100) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => {
                    reject(err)
                }).finally(
                    ()=> commit(types.LOADING, false)
                )
            } catch (err) {
                ()=> commit(types.LOADING, false)
                reject(err)
            }
        })
    },

    [types.ADDIMAGE]({ commit }, item) {
        return new Promise((resolve, reject) => {
            try {
                commit(types.LOADING, true) 

                const formData = toFormData(item)

                api.addImage(formData).then(res => {
                    if (res.code === 100) {
                        resolve(res)
                    } else {
                        reject(res)
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

    [types.UPDATE_IMAGE]({ commit }, { id, data }) {
        return new Promise((resolve, reject) => {
            try {
                commit(types.LOADING, true) 

                const formData = toFormData(data)

                api.updateImage(id, formData).then(res => {
                    if (res.code === 100) {
                        resolve(res)
                    } else {
                        reject(res)
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

    [types.EDIT_DATA]({ commit }, item) {
        return new Promise(() => {
            commit(types.EDIT_DATA, item)
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