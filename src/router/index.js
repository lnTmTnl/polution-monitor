import { createRouter, createWebHashHistory } from 'vue-router'
import CompanyManage from '@/views/CompanyManage/CompanyManage.vue'
import PersonalCenter from '@/views/PersonalCenter/PersonalCenter.vue'
import UserManage from '@/views/UserManage/UserManage.vue'
import DataManage from '@/views/DataManage/DataManage.vue'
import Login from '@/views/Login/Login.vue'
import LogManage from '@/views/LogManage/LogManage.vue'
import FeedbackManage from '@/views/FeedbackManage/FeedbackManage.vue'
// import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/CompanyManage',
    name: 'CompanyManage',
    component: CompanyManage
  },
  {
    path: '/PersonalCenter',
    name: 'PersonalCenter',
    component: PersonalCenter
  },
  {
    path: '/UserManage',
    name: 'UserManage',
    component: UserManage
  },
  {
    path: '/DataManage',
    name: 'DataManage',
    component: DataManage
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/LogManage',
    name: 'LogManage',
    component: LogManage
  },
  {
    path: '/FeedbackManage',
    name: 'FeedbackManage',
    component: FeedbackManage
  }
  /* {
    path: '/',
    name: 'Home',
    component: Home
  }, */
  // {
  // path: '/about',
  // name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
