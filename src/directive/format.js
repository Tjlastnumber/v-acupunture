/**
 * 时间格式化指令
 * https://cn.vuejs.org/v2/guide/custom-directive.html
 */
import Vue from 'vue'

const format = Vue => {
    Vue.directive('dateformat', (el, binding) => {
        el.innerHTML = new Date(binding.value).toLocaleDateString()
    })

    Vue.directive('qsOptions', (el, binding) => {
        el.innerHTML = ['A', 'B', 'C', 'D', 'E'][binding.value - 1]
    })
}

Vue.use(format)
