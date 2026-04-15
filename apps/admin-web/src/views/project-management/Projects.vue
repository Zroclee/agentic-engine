<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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

const totalPages = computed(() => {
  return Math.ceil(total.value / (queryParams.value.pageSize || 10));
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
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <!-- Header & Actions -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">项目管理</h2>
        <button class="btn btn-primary btn-sm" @click="handleAdd">新建项目</button>
      </div>
      
      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4">
        <input 
          v-model="queryParams.keyword" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="搜索项目名称..." 
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
              <th>项目名称</th>
              <th>认证方式</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in projectList" :key="item.id" class="hover">
              <td>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm opacity-50 truncate max-w-xs" v-if="item.description">{{ item.description }}</div>
              </td>
              <td>
                <div class="badge" 
                  :class="{
                    'badge-neutral': item.authType === 'NONE',
                    'badge-primary text-white': item.authType === 'API_KEY',
                    'badge-secondary text-white': item.authType === 'DYNAMIC_TOKEN'
                  }">
                  {{ translateAuthType(item.authType) }}
                </div>
              </td>
              <td>{{ item.user?.username || '-' }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td class="text-right">
                <button class="btn btn-xs btn-info text-white mr-2" @click="handleEdit(item.id)">编辑</button>
                <button class="btn btn-xs btn-error text-white" @click="handleDelete(item.id, item.name)">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="projectList.length === 0 && !loading">
              <td colspan="5" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
            <tr v-if="loading">
              <td colspan="5" class="text-center text-gray-500 py-4">加载中...</td>
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
            @click="handlePageChange(queryParams.page - 1)"
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
            @click="handlePageChange(queryParams.page + 1)"
          >»</button>
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
