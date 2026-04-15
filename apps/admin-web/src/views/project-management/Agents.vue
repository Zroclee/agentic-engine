<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { 
  agentApi, 
  type AgentItem, 
  type AgentListParams 
} from '@/api/agents';
import { getProjectList, type ProjectItem } from '@/api/projects';
import { llmApi, type Llm } from '@/api/llm';
import AgentModal from './components/AgentModal.vue';
import { Message } from '@/components/Message';
import { Confirm } from '@/components/Confirm';

// 状态管理
const loading = ref(false);
const agentList = ref<AgentItem[]>([]);
const total = ref(0);
const queryParams = ref<AgentListParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  projectId: ''
});

// 下拉列表数据
const projects = ref<ProjectItem[]>([]);
const llms = ref<Llm[]>([]);

const totalPages = computed(() => {
  return Math.ceil(total.value / (queryParams.value.pageSize || 10));
});

// 获取所有关联数据（用于下拉选择）
const fetchOptions = async () => {
  try {
    const [projectRes, llmRes] = await Promise.all([
      getProjectList({ page: 1, pageSize: 1000 }),
      llmApi.getList({ page: 1, pageSize: 1000 })
    ]);
    projects.value = projectRes.list || [];
    llms.value = llmRes.list || [];
  } catch (error) {
    console.error('获取关联选项失败', error);
  }
};

// 获取智能体列表
const fetchAgents = async () => {
  loading.value = true;
  try {
    const res = await agentApi.getList(queryParams.value);
    agentList.value = res.list || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error('获取智能体列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.value.page = 1;
  fetchAgents();
};

// 分页
const handlePageChange = (page: number) => {
  queryParams.value.page = page;
  fetchAgents();
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
    const data = await agentApi.getDetail(id);
    modalType.value = 'edit';
    initialData.value = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      prompt: data.prompt || '',
      llmParamsStr: data.llmParams ? JSON.stringify(data.llmParams, null, 2) : '',
      isActive: data.isActive,
      projectId: data.projectId,
      llmId: data.llmId || ''
    };
    modalVisible.value = true;
  } catch (error) {
    console.error('获取详情失败', error);
  }
};

// 删除智能体
const handleDelete = async (id: string, name: string) => {
  const isConfirm = await Confirm({
    title: '确认删除',
    content: `确定要删除智能体 "${name}" 吗？此操作不可恢复。`,
    type: 'error',
    confirmText: '删除',
  });
  
  if (!isConfirm) return;
  
  try {
    await agentApi.remove(id);
    Message.success('删除成功');
    fetchAgents();
  } catch (error) {
    console.error('删除失败', error);
    Message.error('删除失败');
  }
};

onMounted(() => {
  fetchOptions();
  fetchAgents();
});
</script>

<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <!-- Header & Actions -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">智能体管理</h2>
        <button class="btn btn-primary btn-sm" @click="handleAdd">新建智能体</button>
      </div>
      
      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4 items-center">
        <input 
          v-model="queryParams.keyword" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="搜索智能体名称..." 
          class="input input-bordered input-sm w-full max-w-xs" 
        />
        
        <select v-model="queryParams.projectId" @change="handleSearch" class="select select-bordered select-sm w-full max-w-xs">
          <option value="">全部项目</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        
        <button @click="handleSearch" class="btn btn-sm btn-outline">查询</button>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>智能体名称</th>
              <th>所属项目</th>
              <th>关联模型</th>
              <th>状态</th>
              <th>创建时间</th>
              <th class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in agentList" :key="item.id" class="hover">
              <td>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm opacity-50 truncate max-w-xs" v-if="item.description">{{ item.description }}</div>
              </td>
              <td>
                <div class="badge badge-outline" v-if="item.project">{{ item.project.name }}</div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <div v-if="item.llm">
                  <div class="badge badge-ghost">{{ item.llm.name }}</div>
                  <div class="text-xs opacity-50 mt-1">{{ item.llm.provider }}</div>
                </div>
                <span v-else class="text-gray-400">默认/不关联</span>
              </td>
              <td>
                <div class="badge" :class="item.isActive ? 'badge-success text-white' : 'badge-neutral'">
                  {{ item.isActive ? '启用' : '禁用' }}
                </div>
              </td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td class="text-right">
                <button class="btn btn-xs btn-info text-white mr-2" @click="handleEdit(item.id)">编辑</button>
                <button class="btn btn-xs btn-error text-white" @click="handleDelete(item.id, item.name)">删除</button>
              </td>
            </tr>
            <!-- 无数据展示 -->
            <tr v-if="agentList.length === 0 && !loading">
              <td colspan="6" class="text-center text-gray-500 py-4">暂无数据</td>
            </tr>
            <tr v-if="loading">
              <td colspan="6" class="text-center text-gray-500 py-4">加载中...</td>
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
    <AgentModal 
      v-model:visible="modalVisible" 
      :type="modalType" 
      :initial-data="initialData" 
      :projects="projects"
      :llms="llms"
      @success="fetchAgents"
    />
  </div>
</template>
