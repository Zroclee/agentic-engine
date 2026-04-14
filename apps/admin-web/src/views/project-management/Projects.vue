<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  getProjectList, 
  getProjectDetail,
  deleteProject, 
  type ProjectItem, 
  type ProjectListParams 
} from '@/api/projects';
import ProjectModal from './components/ProjectModal.vue';
import { Message } from '@/components/Message';
import { Confirm } from '@/components/Confirm';

// 状态管理
const loading = ref(false);
const projectList = ref<ProjectItem[]>([]);
const total = ref(0);
const queryParams = ref<ProjectListParams>({
  page: 1,
  pageSize: 10,
  keyword: ''
});

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true;
  try {
    // 拦截器已经直接返回了 res.data，所以这里的 res 就是 { list, total, page, pageSize }
    const res = await getProjectList(queryParams.value);
    projectList.value = res.list || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error('获取项目列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.value.page = 1;
  fetchProjects();
};

// 分页
const handlePageChange = (page: number) => {
  queryParams.value.page = page;
  fetchProjects();
};

// 翻译认证方式
const translateAuthType = (type: string) => {
  const map: Record<string, string> = {
    'NONE': '无认证',
    'API_KEY': 'API Key',
    'DYNAMIC_TOKEN': '动态 Token'
  };
  return map[type] || type;
};

// 格式化时间
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 弹窗状态管理
const modalVisible = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const initialData = ref<any>(null);

// 打开新建弹窗
const handleAdd = () => {
  modalType.value = 'add';
  initialData.value = null;
  modalVisible.value = true;
};

// 打开编辑弹窗
const handleEdit = async (id: string) => {
  try {
    const data = await getProjectDetail(id);
    modalType.value = 'edit';
    initialData.value = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      authType: data.authType,
      authConfigStr: data.authConfig ? JSON.stringify(JSON.parse(data.authConfig), null, 2) : ''
    };
    modalVisible.value = true;
  } catch (error) {
    console.error('获取详情失败', error);
  }
};

// 删除项目
const handleDelete = async (id: string, name: string) => {
  const isConfirm = await Confirm({
    title: '确认删除',
    content: `确定要删除项目 "${name}" 吗？此操作不可恢复。`,
    type: 'error',
    confirmText: '删除',
  });
  
  if (!isConfirm) return;
  
  try {
    await deleteProject(id);
    Message.success('删除成功');
    fetchProjects();
  } catch (error) {
    console.error('删除失败', error);
    Message.error('删除失败');
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">项目管理</h2>
      <button class="btn btn-primary" @click="handleAdd">新建项目</button>
    </div>
    
    <!-- 搜索区域 -->
    <div class="flex mb-4 gap-2">
      <input 
        v-model="queryParams.keyword" 
        type="text" 
        placeholder="搜索项目名称" 
        class="input input-bordered w-full max-w-xs" 
        @keyup.enter="handleSearch"
      />
      <button class="btn btn-square btn-ghost" @click="handleSearch">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </div>

    <!-- 表格区域 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="bg-base-200">
              <tr>
                <th>项目名称</th>
                <th>认证方式</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th class="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-8">
                  <span class="loading loading-spinner loading-md text-primary"></span>
                </td>
              </tr>
              <tr v-else-if="projectList.length === 0">
                <td colspan="5" class="text-center text-gray-500 py-8">暂无数据</td>
              </tr>
              <tr v-else v-for="item in projectList" :key="item.id" class="hover">
                <td>
                  <div class="font-bold">{{ item.name }}</div>
                  <div class="text-sm opacity-50 truncate max-w-xs" v-if="item.description">{{ item.description }}</div>
                </td>
                <td>
                  <div class="badge" 
                    :class="{
                      'badge-neutral': item.authType === 'NONE',
                      'badge-primary badge-outline': item.authType === 'API_KEY',
                      'badge-secondary badge-outline': item.authType === 'DYNAMIC_TOKEN'
                    }">
                    {{ translateAuthType(item.authType) }}
                  </div>
                </td>
                <td>{{ item.user?.username || '-' }}</td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td class="text-right">
                  <button class="btn btn-sm btn-ghost text-info" @click="handleEdit(item.id)">编辑</button>
                  <button class="btn btn-sm btn-ghost text-error" @click="handleDelete(item.id, item.name)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="flex justify-between items-center p-4 border-t border-base-200" v-if="total > 0">
          <span class="text-sm text-gray-500">共 {{ total }} 条记录</span>
          <div class="join">
            <button 
              class="join-item btn btn-sm" 
              :disabled="queryParams.page <= 1"
              @click="handlePageChange(queryParams.page - 1)"
            >«</button>
            <button class="join-item btn btn-sm">第 {{ queryParams.page }} 页</button>
            <button 
              class="join-item btn btn-sm" 
              :disabled="queryParams.page * queryParams.pageSize >= total"
              @click="handlePageChange(queryParams.page + 1)"
            >»</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑弹窗组件 -->
    <ProjectModal 
      v-model:visible="modalVisible" 
      :type="modalType" 
      :initial-data="initialData" 
      @success="fetchProjects"
    />
  </div>
</template>
