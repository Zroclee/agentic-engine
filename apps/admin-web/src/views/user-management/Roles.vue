<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">角色管理</h2>
        <button class="btn btn-primary btn-sm">新增角色</button>
      </div>

      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4">
        <input 
          v-model="queryParams.roleName" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="搜索角色名称..." 
          class="input input-bordered input-sm w-full max-w-xs" 
        />
        <button @click="handleSearch" class="btn btn-sm btn-outline">查询</button>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th class="min-w-[60px]">ID</th>
              <th class="min-w-[120px]">角色名称</th>
              <th class="min-w-[120px]">角色标识</th>
              <th class="min-w-[180px]">描述</th>
              <th class="min-w-[100px]">状态</th>
              <th class="min-w-[100px]">关联用户数</th>
              <th class="min-w-[160px]">创建时间</th>
              <th class="min-w-[200px]">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="hover">
              <th>{{ role.id }}</th>
              <td class="font-semibold">{{ role.roleName }}</td>
              <td>
                <span class="badge badge-ghost">{{ role.roleCode }}</span>
              </td>
              <td class="text-gray-500">{{ role.description || '-' }}</td>
              <td>
                <div class="badge" :class="role.status === 1 ? 'badge-success text-white' : 'badge-error text-white'">
                  {{ role.status === 1 ? '启用' : '禁用' }}
                </div>
              </td>
              <td>
                <span class="badge badge-primary badge-outline">{{ role.userCount }} 人</span>
              </td>
              <td class="text-sm text-gray-400">{{ new Date(role.createdAt).toLocaleString() }}</td>
              <td>
                <button class="btn btn-xs btn-warning text-white mr-2">权限分配</button>
                <button class="btn btn-xs btn-info text-white mr-2">编辑</button>
                <button class="btn btn-xs btn-error text-white">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="roles.length === 0 && !loading">
              <td colspan="8" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
            <tr v-if="loading">
              <td colspan="8" class="text-center text-gray-500 py-4">加载中...</td>
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
import { getRoleList, type RoleInfo, type RoleQueryParams } from '@/api/user'

const loading = ref(false)
const roles = ref<RoleInfo[]>([])
const total = ref(0)

const queryParams = reactive<RoleQueryParams>({
  page: 1,
  pageSize: 10,
  roleName: ''
})

const totalPages = computed(() => {
  return Math.ceil(total.value / (queryParams.pageSize || 10))
})

const fetchRoles = async () => {
  try {
    loading.value = true
    const res = await getRoleList(queryParams)
    roles.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchRoles()
}

const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchRoles()
}

onMounted(() => {
  fetchRoles()
})
</script>
