import Login from '@/components/user/Login.vue'
import Home from '@/components/Home.vue'
import Register from '@/components/user/Register.vue'
import Forget from '@/components/user/Forget.vue'
import {createRouter, createWebHistory} from 'vue-router'
import {instance} from '@/utils/request'
import Setting from "@/components/Setting.vue";
import NotFound from "@/components/NotFound.vue";
import History from "@/components/History.vue";
import {ElMessage} from "element-plus";


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
        path: '/setting',
        name: 'setting',
        component: Setting,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/history',
        name: 'history',
        component: History,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/archive',
        name: 'archive',
        component: () => import('@/components/Archive.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin',
        name: 'admin',
        redirect: '/admin/users',
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin/users',
        name: 'users',
        component: () => import('@/components/admin/User.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin/records',
        name: 'records',
        component: () => import('@/components/admin/Record.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin/images',
        name: 'images',
        component: () => import('@/components/admin/Image.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin/login',
        name: 'admin-login',
        component: () => import('@/components/admin/AdminLogin.vue'),
        meta: {
            requireAuth: false
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
            if (to.path.startsWith('/admin')) {
                next('/admin/login')
            } else {
                next('/login')
            }
        } else {
            instance.get('/users/token-valid', {
                params: {
                    uid: user.uid,
                }
            }).then(res => {
                if (res.status === 'success') {
                    if (to.path.startsWith('/admin') && user.role !== 'Administrator') {
                        ElMessage.warning('抱歉，您无权访问该页面')
                        next('/home');
                    } else {
                        next();
                    }
                } else {
                    console.warn('Token is invalid')
                    if (to.path.startsWith('/admin')) {
                        next('/admin/login')
                    } else {
                        next('/login')
                    }
                }
            }).catch(err => {
                console.error(err)
                if (to.path.startsWith('/admin')) {
                    next('/admin/login')
                } else {
                    next('/login')
                }
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