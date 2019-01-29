import * as types from './file-manager-types'
import * as api from '../../../api/file-manager'
import axios from 'axios'

const state = {
    files: [],
    cancelSource: []
}

const getters = {
    [types.SELECT_FILE]: (state) => (fileName) => {
        let result = state.files.find(file => file.fileName === fileName)
        return result
    }
}

const mutations = {
    [types.SET_FILE_LIST](state, files) {
        files.map(el => {
            el['progress'] = 0
            el['downloading'] = false
            el['cancelSource'] = axios.CancelToken.source()
        })
        state.files = files
    },

    [types.UPLOAD](state, file) {
        state.files.splice(0, 0, file)
    },

    [types.CHANGE_PROGRESS](state, { id, progressEvent }) {
        let file = state.files.find(file => file.id === id)
        console.log(progressEvent)
        let progress = Math.round(progressEvent.loaded * 100 / file.fileSize)
        if (file) {
            file.progress = progress
        }
    },

    [types.SHOW_PROGRESS](state, { id, show }) {
        let file = state.files.find(file => file.id === id)
        if (file) {
            file.downloading = show
        }
    },

    [types.SET_CANCEL_TOKEN](state, file) {
        let cache = state.files.find(f => f.id === file.id)
        cache.cancelSource = axios.CancelToken.source()
    },

    [types.REQUEST_CANCEL](state, { file, message }) {
        let cache = state.files.find(f => f.id === file.id)
        cache.cancelSource.cancel(message)
    },

    [types.UPDATE_ROLLBACK](state, file) {
        const index = state.files.indexOf(file)
        state.files.splice(index, 1)
    },

    [types.DELETE](state, file) {
        const index = state.files.indexOf(file)
        if (index !== -1) {
            state.files.splice(index, 1)
        }
    },

    [types.DELETE_ROLLBACK](state, { cache, index }) {
        if (index !== -1) {
            state.files.splice(index, 0, cache)
        }
    }
}

const actions = {
    [types.GET_FILE_LIST]({ commit }) {
        return new Promise((resolve, reject) => {
            api.getFileList().then(res => {
                if (res.code === 100) {
                    commit(types.SET_FILE_LIST, res.extend.list)
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch(err => reject(err))
        })
    },

    [types.UPLOAD]({ commit, dispatch }, { file }) {
        return new Promise((resolve, reject) => {
            let formData = new FormData()
            formData.append('file', file)
            file = {
                id: new Date().toISOString(),
                fileName: file.name,
                filePath: '',
                updateTime: new Date().toString(),
                fileSize: file.size,
                progress: 0,
                downloading: false,
                cancelSource: axios.CancelToken.source()
            }
            const cancelToken = file.cancelSource.token
            commit(types.UPLOAD, file)
            commit(types.SHOW_PROGRESS, { id: file.id, show: true })
            const onUploadProgress = progressEvent => {
                commit(types.CHANGE_PROGRESS, { id: file.id, progressEvent })
            }
            api.upload({ file: formData, onUploadProgress, cancelToken })
                .then(res => {
                    if (res.code === 100) {
                        dispatch(types.GET_FILE_LIST)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
                .catch(err => {
                    commit(types.UPDATE_ROLLBACK, file)
                    reject(err)
                })
                .finally(() => {
                    setTimeout(() => {
                        commit(types.SHOW_PROGRESS, { id: file.id, show: false })
                    }, 300)
                })
        })
    },

    [types.DOWNLOAD]({ commit }, { file }) {
        return new Promise((resolve, reject) => {
            const cancelToken = file.cancelSource.token
            let { fileName, id } = file
            commit(types.SHOW_PROGRESS, { id, show: true })
            const onDownloadProgress = (progressEvent) => {
                commit(types.CHANGE_PROGRESS, { id, progressEvent })
            }
            api.download({ filename: fileName, onDownloadProgress, cancelToken })
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit(types.SET_CANCEL_TOKEN, file)
                    reject(err)
                })
                .finally(() => {
                    setTimeout(() => {
                        commit(types.SHOW_PROGRESS, { id, show: false })
                    }, 300)
                })
        })
    },

    [types.REQUEST_CANCEL]({ commit }, { file, message }) {
        commit(types.REQUEST_CANCEL, { file, message })
    },

    [types.DELETE]({ state, commit }, file) {
        return new Promise((resolve, reject) => {
            const cache = file
            const index = state.files.indexOf(file)
            try {
                commit(types.DELETE, file)
                api.deleteFile(file.id).then(res => {
                    if (res.code === 100) {
                        resolve(res)
                    } else {
                        commit(types.DELETE_ROLLBACK, { cache, index })
                        reject(res)
                    }
                }).catch(err => {
                    commit(types.DELETE_ROLLBACK, { cache, index })
                    reject(err)
                })
            } catch (err) {
                commit(types.DELETE_ROLLBACK, { cache, index })
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