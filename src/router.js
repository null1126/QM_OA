import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/user/Rights.vue'
import Itions from './components/user/Itions.vue'
import Clock from './components/clock/Clock.vue'
import Chenk from './components/clock/Chenk.vue'
import Wages from './components/wage/Wages.vue'
import Leave from './components/leave/Leaves.vue'
import Proje from './components/proje/Proje.vue'
import Kings from './components/clock/King.vue'
import Leavs from './components/leave/Leavs.vue'
import Delavs from './components/leave/Delavs.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/itions', component: Itions },
        { path: '/clock', component: Clock },
        { path: '/chenks', component: Chenk },
        { path: '/king', component: Kings },
        { path: '/wages', component: Wages },
        { path: '/leave', component: Leave },
        { path: '/leavs', component: Leavs },
        { path: '/delavs', component: Delavs },
        { path: '/proje', component: Proje }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router