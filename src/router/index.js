import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import login from '@/pages/login.vue'
import helloWorld from '@/pages/HelloWorld.vue'
import index from '@/pages/index.vue'
import SingleChoiceQuestion from '@/pages/SingleChoiceQuestion/index.vue'
import EditQuestion from '@/pages/SingleChoiceQuestion/edit.vue'
import EditImageQuestion from '@/pages/SingleChoiceQuestion/editImage.vue'
// 引用 vue-router
Vue.use(Router)

export const contentRouter = [{
    path: '',
    name: 'HelloPage',
    component: helloWorld
}, {
    path: '/singleChoice',
    name: 'SingleChoiceQuestion',
    component: SingleChoiceQuestion,
    children: [{
        path: '/:id',
        name: 'EditText',
        component: EditQuestion 
    }, {
        path: '/editImage/:id',
        name: 'EditImageQuestion',
        component: EditImageQuestion
    }]
}]

export const loginRouter = [{
    path: '/login',
    name: 'Login',
    component: login
}, {
    path: '/',
    component: index,
    children: contentRouter,
    meta: {
        auth: true
    }
}]

const router = new Router({
    routes: loginRouter
})

/**
 * 路由守护
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.auth)) {
        if (store.state.userinfo) next()
        else next({
            path: '/login'
        })
    } else {
        next()
    }
})

export default router