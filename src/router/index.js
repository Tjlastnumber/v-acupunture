import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login.vue'
import helloWorld from '@/pages/HelloWorld.vue'
import SingleChoiceQuesiton from '@/pages/SingleChoiceQuestion/index.vue'
import index from '@/pages/index.vue'

// 引用 vue-router
Vue.use(Router)

export const contentRouter = [{
    path: '',
    name: 'HelloPage',
    component: helloWorld
}, {
    path: '/singleChoice',
    name: 'SingleChoiceQuesiton',
    component: SingleChoiceQuesiton 
}]

export const loginRouter = [{
    path: '/',
    name: 'Login',
    component: login
}, {
    path: '/index',
    component: index,
    children: contentRouter
}]

export default new Router({
    routes: loginRouter
})