/**
 * 时间格式化指令
 * https://cn.vuejs.org/v2/guide/custom-directive.html
 */

const dateformat = Vue => {
    Vue.directive('dateformat',
        (el, binding, vnode) => {
            el.innerHTML = new Date(binding.value).toLocaleDateString()
        }
    )
}

export default dateformat