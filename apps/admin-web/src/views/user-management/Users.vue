<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">用户管理</h2>
        <button class="btn btn-primary btn-sm">新增用户</button>
      </div>

      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4">
        <input 
          v-model="queryParams.keyword" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="搜索用户名或邮箱..." 
          class="input input-bordered input-sm w-full max-w-xs" 
        />
        <button @click="handleSearch" class="btn btn-sm btn-outline">查询</button>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th class="min-w-[60px]">序号</th>
              <th class="min-w-[120px]">用户名</th>
              <th class="min-w-[120px]">手机号</th>
              <th class="min-w-[180px]">邮箱</th>
              <th class="min-w-[160px]">角色</th>
              <th class="min-w-[80px]">状态</th>
              <th class="min-w-[120px]">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id" class="hover">
              <th>{{ (queryParams.page! - 1) * queryParams.pageSize! + index + 1 }}</th>
              <td>{{ user.username }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>
                <span v-if="user.roles && user.roles.length > 0" class="badge badge-ghost">
                  {{ user.roles.map(r => r.roleName).join(', ') }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <div class="badge" :class="user.isActive ? 'badge-success text-white' : 'badge-error text-white'">
                  {{ user.isActive ? '启用' : '禁用' }}
                </div>
              </td>
              <td>
                <button class="btn btn-xs btn-info text-white mr-2">编辑</button>
                <button class="btn btn-xs btn-error text-white">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="users.length === 0 && !loading">
              <td colspan="7" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center text-gray-500 py-4">加载中...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页占位 -->
      <div class="flex justify-end mt-4" v-if="total > 0">
        <div class="join">
          <button 
            class="join-item btn btn-sm" 
            :disabled="queryParams.page === 1"
            @click="handlePageChange(queryParams.page! - 1)"
          >«</button>
          
          <button 
            v-for="p in totalPages" 
            :key="p"
            class="join-item btn btn-sm" 
            :class="{ 'btn-active': p === queryParams.page }"
            @click="handlePageChange(p)"
          >
            {{ p }}
          </button>
          
          <button 
            class="join-item btn btn-sm"
            :disabled="queryParams.page === totalPages"
            @click="handlePageChange(queryParams.page! + 1)"
          >»</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getUserList, type UserInfo, type UserQueryParams } from '@/api/user'

const loading = ref(false)
const users = ref<UserInfo[]>([])
const total = ref(0)

const queryParams = reactive<UserQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: ''
})

const totalPages = computed(() => {
  return Math.ceil(total.value / (queryParams.pageSize || 10))
})

const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await getUserList(queryParams)
    users.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchUsers()
}

const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>
