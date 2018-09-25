import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login.vue'
import helloWorld from '../page/HelloWorld.vue'
import index from '../page/index.vue'

// 引用 vue-router
Vue.use(Router)

export const contentRouter = [{
    path: '/',
    name: 'HelloWorld',
    component: helloWorld 
}]

export const loginRouter = [{
    path: '/',
    name: 'Login',
    component: login
}, {
    path: '/index',
    name: 'index',
    component: index,
    children: contentRouter
}]


export default new Router({
    routes: loginRouter
})