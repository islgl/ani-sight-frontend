import Login from '@/components/user/Login.vue'
import Home from '@/components/Home.vue'
import Register from '@/components/user/Register.vue'
import {createRouter, createWebHistory} from 'vue-router'
import {instance} from '@/utils/request'

const routes = [
    {
        path: '/',
        name: 'root',
        redirect: '/home',
        meta: {
            requireAuth: true
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
    }
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
})

export default router