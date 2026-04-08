<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">角色管理</h2>
        <button class="btn btn-primary btn-sm">新增角色</button>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>角色名称</th>
              <th>描述</th>
              <th>关联用户数</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="hover">
              <th>{{ role.id }}</th>
              <td class="font-semibold">{{ role.name }}</td>
              <td class="text-gray-500">{{ role.description }}</td>
              <td>
                <span class="badge badge-primary badge-outline">{{ role.userCount }} 人</span>
              </td>
              <td class="text-sm text-gray-400">{{ role.createdAt }}</td>
              <td>
                <button class="btn btn-xs btn-warning text-white mr-2">权限分配</button>
                <button class="btn btn-xs btn-info text-white mr-2">编辑</button>
                <button class="btn btn-xs btn-error text-white">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 临时测试数据
const roles = ref([
  { id: 1, name: '超级管理员', description: '系统最高权限，可访问所有功能', userCount: 1, createdAt: '2023-10-01 10:00:00' },
  { id: 2, name: '开发者', description: '开发人员权限，管理 API 和系统配置', userCount: 3, createdAt: '2023-10-05 14:30:00' },
  { id: 3, name: '普通用户', description: '系统基础访问权限', userCount: 156, createdAt: '2023-10-10 09:15:00' },
])
</script>
