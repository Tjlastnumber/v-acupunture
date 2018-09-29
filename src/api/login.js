import axios from './axios-api.js'
import qs from 'qs'

export const login = (data) => {
   return axios({
        url: '/api/login',
        method: 'POST',
        data: qs.stringify(data) 
    })
}

export default {
    login
}