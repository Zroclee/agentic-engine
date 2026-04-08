import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Regist from '../views/Regist.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/user-management',
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        redirect: '/admin/user-management/users',
        children: [
          {
            path: 'users',
            name: 'Users',
            component: () => import('../views/user-management/Users.vue')
          },
          {
            path: 'roles',
            name: 'Roles',
            component: () => import('../views/user-management/Roles.vue')
          },
          {
            path: 'permissions',
            name: 'Permissions',
            component: () => import('../views/user-management/Permissions.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
