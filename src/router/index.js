import Login from '@/components/user/Login.vue'
import Home from '@/components/Home.vue'
import Register from '@/components/user/Register.vue'
import Forget from '@/components/user/Forget.vue'
import Profile from "@/components/user/Profile.vue";
import History from "@/components/data/History.vue";
import Star from "@/components/data/Star.vue";
import About from "@/components/About.vue";
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
    },
    {
        path: '/forget',
        name: 'forget',
        component: Forget
    },
    {
        path: '/profile',
        name:'profile',
        component: Profile
    },
    {
        path: '/history',
        name:'history',
        component: History,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/star',
        name:'star',
        component: Star,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/about',
        name:'about',
        component: About
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

    // 主页初始化
    if(to.name === 'root'||to.name === 'home') {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user !== null) {
            const uid=user.uid
        }
    }
})

export default router