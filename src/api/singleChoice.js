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

export default {
    getPages,
    get
}