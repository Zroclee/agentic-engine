<template>
  <div class="h-screen flex flex-col bg-base-200">
    <!-- Navbar 顶部导航栏 -->
    <Header :showNav="false" :fixed="false" />

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar 左侧侧边栏 (导航菜单) -->
      <aside class="w-64 bg-base-100 shadow-sm overflow-y-auto flex-none">
        <ul class="menu p-4 w-full text-base-content min-h-full">
          <!-- 带有二级菜单的菜单组 -->
          <li>
            <details open>
              <summary>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                用户管理
              </summary>
              <ul>
                <li><router-link to="/admin/user-management/users" active-class="active">用户列表</router-link></li>
                <li><router-link to="/admin/user-management/roles" active-class="active">角色管理</router-link></li>
                <li><router-link to="/admin/user-management/permissions" active-class="active">权限管理</router-link></li>
              </ul>
            </details>
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
import Header from '@/components/layout/Header.vue'
</script>
