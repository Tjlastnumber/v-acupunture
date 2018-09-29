/**
 * 时间格式化指令
 * https://cn.vuejs.org/v2/guide/custom-directive.html
 */
import Vue from 'vue'

Vue.directive('dateformat',
    (el, binding, vnode) => {
        el.innerHTML = new Date(binding.value).toLocaleDateString()
    }
)

Vue.directive('qsOptions', (el, binding, vnode) => {
    el.innerHTML = ['A', 'B', 'C', 'D', 'E'][binding.value - 1]
})

// export default dateformat