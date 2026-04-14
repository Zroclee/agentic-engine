<template>
  <div class="h-screen flex flex-col bg-base-200">
    <!-- Navbar 顶部导航栏 -->
    <Header :showNav="false" :fixed="false" />

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar 左侧侧边栏 (导航菜单) -->
      <aside class="w-64 bg-base-100 shadow-sm overflow-y-auto flex-none">
        <ul class="menu p-4 w-full text-base-content min-h-full">
          <!-- 动态渲染菜单 -->
          <li v-for="menu in menuList" :key="menu.title">
            <!-- 带有二级菜单的菜单组 -->
            <details v-if="menu.children && menu.children.length > 0" :open="isGroupActive(menu)">
              <summary :class="{ 'bg-base-200 font-medium': isGroupActive(menu) }">
                <span v-if="menu.icon" v-html="menu.icon" class="inline-flex items-center justify-center"></span>
                {{ menu.title }}
              </summary>
              <ul>
                <li v-for="child in menu.children" :key="child.path">
                  <router-link :to="child.path!" active-class="menu-active">{{ child.title }}</router-link>
                </li>
              </ul>
            </details>
            
            <!-- 一级菜单 -->
            <router-link v-else :to="menu.path!" active-class="menu-active">
              <span v-if="menu.icon" v-html="menu.icon" class="inline-flex items-center justify-center"></span>
              {{ menu.title }}
            </router-link>
          </li>
        </ul>
      </aside>

      <!-- Content 主内容区 -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'

const route = useRoute()

interface Menu {
  title: string
  path?: string
  icon?: string
  children?: Menu[]
}

const isGroupActive = (menu: Menu) => {
  if (menu.children) {
    return menu.children.some(child => child.path && route.path.startsWith(child.path))
  }
  return false
}

const menuList = ref<Menu[]>([
  {
    title: '用户管理',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
    children: [
      { title: '用户列表', path: '/admin/user-management/users' },
      { title: '角色管理', path: '/admin/user-management/roles' },
      { title: '权限管理', path: '/admin/user-management/permissions' }
    ]
  },
  {
    title: '项目管理',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
    children: [
      { title: '项目列表', path: '/admin/project-management/projects' },
      { title: '智能体管理', path: '/admin/project-management/agents' }
    ]
  }
])
</script>
