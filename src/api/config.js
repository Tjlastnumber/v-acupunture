
export default {
    method: 'post',
    baseUrl: 'http://192.168.4.9:8080', //'https://easy-mock.com/mock/5bab3f8c070cd35e02f8b898/example',
    // 请求头信息
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'
    },
    // 参数
    data: {},
    // 设置超时时间
    timeout: 10000,
    // 携带凭证
    withCredentials: false,
    // 返回数据类型
    // responseType: 'json'
}