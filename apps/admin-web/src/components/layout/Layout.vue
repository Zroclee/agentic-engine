<template>
  <div class="h-screen flex flex-col bg-base-200">
    <!-- Navbar 顶部导航栏 -->
    <div class="navbar bg-base-100 shadow-sm z-10 flex-none h-16">
      <div class="flex-1 px-4">
        <router-link to="/" class="text-xl font-bold cursor-pointer hover:text-primary transition-colors" title="点击返回系统首页">Admin Engine</router-link>
      </div>
      <div class="flex-none gap-4 px-4">
        <!-- 消息告警 -->
        <button class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="badge badge-xs badge-error indicator-item"></span>
          </div>
        </button>
        <!-- 右侧用户信息 -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a class="justify-between">个人信息</a></li>
            <li><a>系统设置</a></li>
            <li><a class="text-error">退出登录</a></li>
          </ul>
        </div>
      </div>
    </div>

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
// 布局组件逻辑
</script>
