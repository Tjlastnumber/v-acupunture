/**
 * 时间格式化指令
 * https://cn.vuejs.org/v2/guide/custom-directive.html
 */
import Vue from 'vue'

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const dateformat = Vue.directive('dateformat', (el, binding) => {
    const date = new Date(binding.value)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (binding.arg) {
        const arg = binding.arg.toLocaleLowerCase()
        switch (arg) {
            case 'year':
                el.innerHTML = year
                break;
            case 'month':
                el.innerHTML = [year, month].map(formatNumber).join('/')
                break;
            case 'date':
                el.innerHTML = [year, month, day].map(formatNumber).join('/')
                break;
            case 'full':
                el.innerHTML = [year, month, day].map(formatNumber).join('/') +
                    [hour, minute, second].map(formatNumber).join(':')
                break;
            default:
                el.innerHTML = new Date(binding.value).toLocaleDateString()
                break;
        }
    } else {
        el.innerHTML = new Date(binding.value).toLocaleDateString()
    }
})

const qsOptions = Vue.directive('qsOptions', (el, binding) => {
    el.innerHTML = ['A', 'B', 'C', 'D', 'E'][binding.value - 1]
})

const directive = () => {
    dateformat
    qsOptions
}

Vue.use(directive)
