import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const main = () =>
    import('../components/main/index.vue')
const login = () =>
    import('../components/login/index.vue')


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/main', component: main },
    { path: '*', component: () => import('../components/404/index.vue') },
]

const router = new VueRouter({
    mode: 'history',
    // base: '/webchat/',
    routes
})


export default router