/**
 * 单选题服务请求
 */
import axios from './axios-api.js'

export const getPages = config => {
    return axios({
        url: '/api/singleChoiceDisplay',
        method: 'post',
        params: config.params,
        data: config.data
    })
}

export const get = params => {
    return axios({
        url: '/',
        method: 'get',
        params
    })
}

export const deleteSingleChoice = id => {
    return axios({
        url: '/api/deleteSingleChoice/' + id,
        method: 'get'
    })
}

export const release = id => {
    return axios({
        url: '/api/release/' + id,
        method: 'get'
    })
}

export const rollbackRelease = id => {
    return axios({
        url: '/api/rollback/' + id,
        method: 'get'
    })
}

export const add = (data) => {
    return axios({
        url: '/api/addSingleChioceText',
        method: 'post',
        data
    })
}

export const update = (id, data) => {
    return axios({
        url: '/api/updateSingleChioceText/' + id,
        method: 'post',
        data
    })
}

export const addImage = (data) => {
    return axios({
        url: 'api/addSingleChoiceImage',
        method: 'post',
        data
    })
}

export const updateImage = (id, data) => {
    return axios({
        url: 'api/updateSingleChioceImage/' + id,
        method: 'post',
        data
    })
}

export default {
    getPages,
    get,
    deleteSingleChoice,
    release,
    rollbackRelease,
    add,
    addImage,
    update,
    updateImage
}