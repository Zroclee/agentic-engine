import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Regist from '@/views/Regist.vue'
import { useAppStore } from '@/store/app'

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
      },
      {
        path: 'llm-management',
        name: 'LlmManagement',
        redirect: '/admin/llm-management/llms',
        children: [
          {
            path: 'llms',
            name: 'Llms',
            component: () => import('../views/llm-management/Llms.vue')
          }
        ]
      },
      {
        path: 'project-management',
        name: 'ProjectManagement',
        redirect: '/admin/project-management/projects',
        children: [
          {
            path: 'projects',
            name: 'Projects',
            component: () => import('../views/project-management/Projects.vue')
          },
          {
            path: 'agents',
            name: 'Agents',
            component: () => import('../views/project-management/Agents.vue')
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

// 白名单列表
const whiteList = ['/login', '/regist', '/']

router.beforeEach(async (to, _from) => {
  const appStore = useAppStore()

  // 1. 判断是否在白名单内
  if (whiteList.includes(to.path)) {
    return true
  }

  // 2. 如果已经存在用户信息，直接放行
  if (appStore.userInfo) {
    return true
  }

  // 3. 不存在用户信息，尝试获取
  try {
    await appStore.fetchUserInfo()
    // 获取成功
    return true
  } catch (error) {
    // 获取失败（如未登录或 token 失效），重定向到首页 (或登录页)
    // 根据需求“获取不成功则前往首页”
    return '/'
  }
})

export default router
