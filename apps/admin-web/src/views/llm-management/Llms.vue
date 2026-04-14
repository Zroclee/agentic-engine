<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <!-- Header & Actions -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">大模型管理</h2>
        <button class="btn btn-primary btn-sm" @click="openCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增模型
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-4 mb-4">
        <input
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="搜索模型名称或供应商..."
          class="input input-bordered input-sm w-full max-w-xs"
        />
        <button class="btn btn-sm btn-outline" @click="handleSearch">
          查询
        </button>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>模型名称</th>
              <th>供应商</th>
              <th>Base URL</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id" class="hover">
              <td class="font-medium">{{ row.name }}</td>
              <td>
                <div class="badge badge-neutral">{{ row.provider }}</div>
              </td>
              <td class="truncate max-w-[200px]">{{ row.baseUrl || '-' }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <span
                    class="badge"
                    :class="row.isPublic ? 'badge-success text-white' : 'badge-error text-white'"
                  >
                    {{ row.isPublic ? '公开' : '私有' }}
                  </span>
                  <input
                    v-if="isSuperAdmin"
                    type="checkbox"
                    class="toggle toggle-success toggle-sm"
                    :checked="row.isPublic"
                    @change="handleTogglePublic(row)"
                  />
                </div>
              </td>
              <td>{{ row.user?.username || '-' }}</td>
              <td>{{ new Date(row.createdAt).toLocaleString() }}</td>
              <td class="text-right">
                <button class="btn btn-xs btn-info text-white mr-2" @click="openEditModal(row)">编辑</button>
                <button class="btn btn-xs btn-error text-white" @click="handleDelete(row)">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="tableData.length === 0 && !loading">
              <td colspan="7" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center text-gray-500 py-4">加载中...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end mt-4" v-if="total > 0">
        <div class="join">
          <button 
            class="join-item btn btn-sm" 
            :disabled="page === 1" 
            @click="handlePageChange(page - 1)"
          >«</button>
          
          <button 
            v-for="p in totalPages" 
            :key="p"
            class="join-item btn btn-sm" 
            :class="{ 'btn-active': p === page }"
            @click="handlePageChange(p)"
          >
            {{ p }}
          </button>
          
          <button 
            class="join-item btn btn-sm" 
            :disabled="page === totalPages" 
            @click="handlePageChange(page + 1)"
          >»</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <dialog ref="formModal" class="modal">
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="font-bold text-lg mb-6">{{ isEdit ? '编辑大模型' : '新增大模型' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 供应商 -->
            <div class="form-control w-full">
              <label class="label"><span class="label-text">供应商 *</span></label>
              <input
                type="text"
                v-model="formData.provider"
                class="input input-bordered w-full"
                placeholder="例如: openai, anthropic"
                required
              />
            </div>
            
            <!-- 模型名称 -->
            <div class="form-control w-full">
              <label class="label"><span class="label-text">模型名称 *</span></label>
              <input
                type="text"
                v-model="formData.name"
                class="input input-bordered w-full"
                placeholder="例如: gpt-4, claude-3"
                required
              />
            </div>
          </div>

          <!-- Base URL -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">自定义代理地址 (Base URL)</span>
              <span class="label-text-alt text-base-content/60">选填</span>
            </label>
            <input
              type="url"
              v-model="formData.baseUrl"
              class="input input-bordered w-full"
              placeholder="例如: https://api.openai.com/v1"
            />
          </div>

          <!-- API Key -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">API Key {{ isEdit ? '' : '*' }}</span>
              <span class="label-text-alt text-warning" v-if="isEdit">如需修改请直接输入新Key，留空或保留脱敏符则不修改</span>
            </label>
            <input
              type="text"
              v-model="formData.apiKey"
              class="input input-bordered w-full font-mono text-sm"
              placeholder="sk-..."
              :required="!isEdit"
            />
          </div>

          <div class="modal-action mt-6">
            <button type="button" class="btn" @click="closeModal">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
              确认保存
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { llmApi, type Llm, type CreateLlmDto, type UpdateLlmDto } from '@/api/llm'
import { Message } from '@/components/Message'
import { Confirm } from '@/components/Confirm'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
// 判断是否是超级管理员
const isSuperAdmin = computed(() => {
  return appStore.userInfo?.roles?.some(role => role.roleCode === 'SUPER_ADMIN') || false
})

// 列表数据状态
const loading = ref(false)
const tableData = ref<Llm[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 表单状态
const formModal = ref<HTMLDialogElement | null>(null)
const isEdit = ref(false)
const submitting = ref(false)
const currentEditId = ref('')

const defaultForm = {
  provider: '',
  name: '',
  baseUrl: '',
  apiKey: ''
}
const formData = ref<CreateLlmDto | UpdateLlmDto>({ ...defaultForm })

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const res = await llmApi.getList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error: any) {
    Message.error(error.message || '获取大模型列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchList()
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchList()
}

// 弹窗控制
const openCreateModal = () => {
  isEdit.value = false
  formData.value = { ...defaultForm }
  formModal.value?.showModal()
}

const openEditModal = async (row: Llm) => {
  isEdit.value = true
  currentEditId.value = row.id
  
  try {
    // 获取详情以带出脱敏后的 API Key
    const detail = await llmApi.getDetail(row.id)
    formData.value = {
      provider: detail.provider,
      name: detail.name,
      baseUrl: detail.baseUrl || '',
      apiKey: detail.apiKey || ''
    }
    formModal.value?.showModal()
  } catch (error: any) {
    Message.error(error.message || '获取详情失败')
  }
}

const closeModal = () => {
  formModal.value?.close()
  formData.value = { ...defaultForm }
}

// 提交表单
const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = { ...formData.value }
    // 处理空字符串
    if (!payload.baseUrl) delete payload.baseUrl
    
    if (isEdit.value) {
      // 如果没有修改 API Key (还是脱敏占位符)，则不传给后端
      if (payload.apiKey && payload.apiKey.startsWith('sk-****')) {
        delete payload.apiKey
      }
      await llmApi.update(currentEditId.value, payload as UpdateLlmDto)
      Message.success('更新成功')
    } else {
      await llmApi.create(payload as CreateLlmDto)
      Message.success('创建成功')
    }
    closeModal()
    fetchList()
  } catch (error: any) {
    Message.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
  } finally {
    submitting.value = false
  }
}

// 删除
const handleDelete = async (row: Llm) => {
  const confirmed = await Confirm({
    title: '确认删除',
    content: `确定要删除模型「${row.name}」吗？此操作不可恢复。`,
    type: 'error'
  })
  
  if (confirmed) {
    try {
      await llmApi.remove(row.id)
      Message.success('删除成功')
      if (tableData.value.length === 1 && page.value > 1) {
        page.value--
      }
      fetchList()
    } catch (error: any) {
      Message.error(error.message || '删除失败')
    }
  }
}

// 切换公开状态
const handleTogglePublic = async (row: Llm) => {
  const newStatus = !row.isPublic
  try {
    await llmApi.setPublic(row.id, newStatus)
    row.isPublic = newStatus
    Message.success(`已设为${newStatus ? '公开' : '私有'}`)
  } catch (error: any) {
    Message.error(error.message || '设置失败')
    // 失败后刷新列表恢复原状态
    fetchList()
  }
}

onMounted(() => {
  fetchList()
})
</script>
