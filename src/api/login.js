import axios from './axios-api.js'

export const login = (data) => {
   return axios({
        url: '/api/login',
        method: 'POST',
        data
    })
}

export default {
    login
}