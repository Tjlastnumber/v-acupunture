import api from './axios-api'
import qs from 'qs'

export const getFileList = () => {
    return api({
        url: '/api/getFileList',
        method: 'get'
    })
}

export const upload = ({ file, onUploadProgress, cancelToken }) => {
    return api({
        url: '/api/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: file,
        onUploadProgress,
        cancelToken
    })
}

export const download = ({ filename, onDownloadProgress, cancelToken }) => {
    return api({
        url: '/api/download',
        method: 'post',
        data: qs.stringify({ filename }),
        responseType:'blob',
        onDownloadProgress,
        cancelToken
    })
}