<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">权限管理</h2>
        <button class="btn btn-primary btn-sm">新增权限</button>
      </div>

      <div class="alert alert-info shadow-sm mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>这里管理系统的所有操作权限标识（Code），用于前端按钮显示控制和后端接口鉴权。</span>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>权限标识 (Code)</th>
              <th>权限名称</th>
              <th>所属模块</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="perm in permissions" :key="perm.id" class="hover">
              <td>
                <code class="bg-base-200 px-2 py-1 rounded text-sm">{{ perm.code }}</code>
              </td>
              <td>{{ perm.name }}</td>
              <td>
                <span class="badge badge-neutral">{{ perm.module }}</span>
              </td>
              <td>
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
const permissions = ref([
  { id: 1, code: 'sys:user:list', name: '查看用户列表', module: '用户管理' },
  { id: 2, code: 'sys:user:add', name: '新增用户', module: '用户管理' },
  { id: 3, code: 'sys:user:edit', name: '编辑用户', module: '用户管理' },
  { id: 4, code: 'sys:user:delete', name: '删除用户', module: '用户管理' },
  { id: 5, code: 'sys:role:list', name: '查看角色列表', module: '角色管理' },
  { id: 6, code: 'sys:role:assign', name: '分配权限', module: '角色管理' },
  { id: 7, code: 'sys:menu:view', name: '查看菜单/权限', module: '权限管理' },
])
</script>
