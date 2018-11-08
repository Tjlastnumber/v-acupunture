import axios from './axios-api'
import qs from 'qs'

export const getFileList = ({ params, data }) => {
    return axios({
        url: '/api/getFileList',
        method: 'get',
        params: params,
    })
}