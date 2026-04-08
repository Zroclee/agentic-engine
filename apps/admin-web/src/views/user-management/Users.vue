<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">用户管理</h2>
        <button class="btn btn-primary btn-sm">新增用户</button>
      </div>

      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4">
        <input type="text" placeholder="搜索用户名或邮箱..." class="input input-bordered input-sm w-full max-w-xs" />
        <button class="btn btn-sm btn-outline">查询</button>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="hover">
              <th>{{ user.id }}</th>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge badge-ghost">{{ user.role }}</span>
              </td>
              <td>
                <div class="badge" :class="user.status === 'Active' ? 'badge-success text-white' : 'badge-error text-white'">
                  {{ user.status === 'Active' ? '启用' : '禁用' }}
                </div>
              </td>
              <td>
                <button class="btn btn-xs btn-info text-white mr-2">编辑</button>
                <button class="btn btn-xs btn-error text-white">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页占位 -->
      <div class="flex justify-end mt-4">
        <div class="join">
          <button class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm btn-active">1</button>
          <button class="join-item btn btn-sm">2</button>
          <button class="join-item btn btn-sm">3</button>
          <button class="join-item btn btn-sm">»</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 临时测试数据
const users = ref([
  { id: 1, name: 'Admin', email: 'admin@agentic.com', role: '超级管理员', status: 'Active' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: '普通用户', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: '普通用户', status: 'Inactive' },
  { id: 4, name: 'Developer', email: 'dev@agentic.com', role: '开发者', status: 'Active' },
])
</script>
