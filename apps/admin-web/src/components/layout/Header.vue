<template>
  <div :class="['navbar bg-base-100 shadow-sm w-full transition-all', fixed ? 'fixed top-0 z-50' : 'z-10 flex-none h-16']">
    <div class="flex-1 px-4">
      <router-link to="/" class="text-xl md:text-2xl font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity" title="点击返回系统首页">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        AgenticEngine
      </router-link>
    </div>
    
    <!-- 中间导航 -->
    <div v-if="showNav" class="absolute left-1/2 -translate-x-1/2 hidden md:block">
      <ul class="menu menu-horizontal px-1 items-center">
        <li><router-link to="/admin" class="font-medium hover:text-primary">后管系统</router-link></li>
        <li><a href="#" class="font-medium hover:text-primary">AI聊天</a></li>
      </ul>
    </div>
    
    <div class="flex-none gap-2 px-4">
      <div class="flex items-center">
        <!-- 消息告警，只有在登录后显示 -->
        <button v-if="appStore.userInfo" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="badge badge-xs badge-error indicator-item"></span>
          </div>
        </button>

        <ul class="menu menu-horizontal px-1 items-center">
          <li v-if="!appStore.userInfo">
            <router-link to="/login" class="btn btn-primary btn-sm ml-4">登录</router-link>
          </li>
          <li v-else class="ml-2">
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-8 md:w-10 rounded-full">
                  <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><a class="justify-between">个人信息</a></li>
                <li><a>系统设置</a></li>
                <li><a class="text-error" @click="handleLogout">退出登录</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

withDefaults(defineProps<{
  showNav?: boolean
  fixed?: boolean
}>(), {
  showNav: false,
  fixed: false
})

const router = useRouter()
const appStore = useAppStore()

const handleLogout = async () => {
  try {
    await appStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败', error)
    router.push('/login')
  }
}
</script>
