import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login.vue'
import helloWorld from '../page/index.vue'

// 引用 vue-router
Vue.use(Router)

export const LoginRouter = [{
    path: '/',
    name: 'Login',
    component: login
}, {
    path: '/helloWorld',
    name: 'HelloWorld',
    component: helloWorld 
}]

export default new Router({
    routes: LoginRouter
})