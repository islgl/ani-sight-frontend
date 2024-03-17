import Login from '@/components/user/Login.vue'
import Home from '@/components/Home.vue'
import Register from '@/components/user/Register.vue'
import Forget from '@/components/user/Forget.vue'
import {createRouter, createWebHistory} from 'vue-router'
import {instance} from '@/utils/request'
import Setting from "@/components/Setting.vue";
import NotFound from "@/components/NotFound.vue";


const routes = [
    {
        path: '/',
        name: 'root',
        redirect: '/home',
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/home',
        component: Home,
        name: 'home',
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/forget',
        name: 'forget',
        component: Forget
    },
    {
        path: '/setting',
        name: 'setting',
        component: Setting,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/404',
        name: 'notfound',
        component: NotFound,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/:catchAll(.*)', // 使用通配符路由捕获所有路径
        redirect: '/404' // 重定向到 404 页面
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user === null) {
            next('/login')
        } else {
            instance.get('/users/token-valid', {
                params: {
                    uid: user.uid,
                }
            }).then(res => {
                if (res.status === 'success') {
                    console.log('Token is valid')
                    next()
                } else {
                    console.warn('Token is invalid')
                    next('/login')
                }
            }).catch(err => {
                console.error(err)
                next('/login')
            })
        }
    } else {
        next()
    }

    // 主页初始化
    if (to.name === 'root' || to.name === 'home') {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user !== null) {
            const uid = user.uid
        }
    }
})

export default router