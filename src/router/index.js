import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Login from '@/pages/Login.vue'
import HelloWorld from '@/pages/HelloWorld.vue'
import index from '@/pages/index.vue'
import SingleChoiceQuestion from '@/pages/SingleChoiceQuestion/index.vue'
import EditQuestion from '@/pages/SingleChoiceQuestion/Edit.vue'
import EditImageQuestion from '@/pages/SingleChoiceQuestion/EditImage.vue'
import FileManager from '@/pages/FileManager/index.vue'
// 引用 vue-router
Vue.use(Router)

export const singleChoiceChildren = [{
    path: '/editText/:id',
    name: 'EditText',
    component: EditQuestion,
}, {
    path: '/editImage/:id',
    name: 'EditImageQuestion',
    component: EditImageQuestion
}]


export const contentRouter = [{
    path: '/',
    name: 'HelloPage',
    component: HelloWorld,
    meta: {
        title: 'Hello Page',
        icon: 'home'
    }
}, {
    path: '/singleChoice',
    name: 'SingleChoiceQuestion',
    component: SingleChoiceQuestion,
    children: singleChoiceChildren,
    meta: {
        root: '/singleChoice',
        title: '单选题管理',
        icon: 'bubble_chart'
    }
}, {
    path: '/fileManager',
    name: 'FileManager',
    component: FileManager,
    meta: {
        root: '/fileManager',
        title: '文件管理',
        icon: 'folder'
    }
}]

export const loginRouter = [{
    path: '/login',
    name: 'Login',
    component: Login
}, {
    path: '/',
    component: index,
    children: contentRouter,
    meta: {
        auth: true
    }
}]

const router = new Router({
    mode: 'history',
    routes: loginRouter
})

/**
 * 路由守护
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.auth)) {
        if (store.state.userinfo) next()
        else next({ path: '/login' })
    } else {
        next()
    }
    next()
})

export default router