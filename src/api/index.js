import singleChoice from './singleChoice.js'
import login from './login.js'

const install = Vue => {
    if (install.installed) return
    install.installed = true

    // 将 api 附加到 Vue 原型链上
    Object.defineProperties(Vue.prototype, {
        $api: {
            get() {
                return {
                    singleChoice: singleChoice,
                    login: login.login
                } 
            }
        }
    })
}

export default install