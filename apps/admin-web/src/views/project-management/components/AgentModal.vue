<script setup lang="ts">
import { ref, watch } from 'vue';
import { agentApi, type CreateAgentDto } from '@/api/agents';
import { Message } from '@/components/Message';

const props = defineProps<{
  visible: boolean;
  type: 'add' | 'edit';
  initialData: any;
  projects: any[];
  llms: any[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

const saving = ref(false);
const formState = ref({
  id: '',
  name: '',
  description: '',
  prompt: '',
  llmParamsStr: '',
  isActive: true,
  projectId: '',
  llmId: ''
});

// 监听弹窗显示与初始化数据
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      if (props.type === 'add') {
        formState.value = {
          id: '',
          name: '',
          description: '',
          prompt: '',
          llmParamsStr: '',
          isActive: true,
          projectId: props.projects.length > 0 ? props.projects[0].id : '',
          llmId: ''
        };
      } else if (props.initialData) {
        formState.value = {
          id: props.initialData.id || '',
          name: props.initialData.name || '',
          description: props.initialData.description || '',
          prompt: props.initialData.prompt || '',
          llmParamsStr: props.initialData.llmParamsStr || '',
          isActive: props.initialData.isActive !== false,
          projectId: props.initialData.projectId || '',
          llmId: props.initialData.llmId || ''
        };
      }
    }
  }
);

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
};

// 提交表单
const handleSubmit = async () => {
  if (!formState.value.name.trim()) {
    Message.error('智能体名称不能为空');
    return;
  }
  if (!formState.value.projectId) {
    Message.error('所属项目不能为空');
    return;
  }
  
  let llmParamsObj = undefined;
  if (formState.value.llmParamsStr.trim()) {
    try {
      llmParamsObj = JSON.parse(formState.value.llmParamsStr);
    } catch (e) {
      Message.error('模型参数格式不正确，必须为合法的 JSON');
      return;
    }
  }

  saving.value = true;
  try {
    const payload: CreateAgentDto = {
      name: formState.value.name,
      description: formState.value.description,
      prompt: formState.value.prompt,
      llmParams: llmParamsObj,
      isActive: formState.value.isActive,
      projectId: formState.value.projectId,
      llmId: formState.value.llmId || undefined
    };

    if (props.type === 'add') {
      await agentApi.create(payload);
      Message.success('创建成功');
    } else {
      await agentApi.update(formState.value.id, payload);
      Message.success('更新成功');
    }
    
    emit('success');
    handleClose();
  } catch (error: any) {
    console.error('保存失败', error);
    Message.error('保存失败');
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': visible }">
    <div class="modal-box w-11/12 max-w-3xl">
      <h3 class="font-bold text-xl mb-6 pb-4 border-b border-base-200">
        {{ type === 'add' ? '新建智能体' : '编辑智能体' }}
      </h3>
      
      <div class="space-y-5">
        <!-- 智能体名称 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            智能体名称 <span class="text-error">*</span>
          </label>
          <input 
            v-model="formState.name" 
            type="text" 
            placeholder="请输入智能体名称" 
            class="input input-bordered w-full" 
          />
        </div>

        <!-- 基础配置：所属项目与关联模型 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">
              所属项目 <span class="text-error">*</span>
            </label>
            <select v-model="formState.projectId" class="select select-bordered w-full">
              <option disabled value="">请选择所属项目</option>
              <option v-for="item in projects" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">
              关联模型
            </label>
            <select v-model="formState.llmId" class="select select-bordered w-full">
              <option value="">不关联 / 默认</option>
              <option v-for="item in llms" :key="item.id" :value="item.id">{{ item.name }} ({{ item.provider }})</option>
            </select>
          </div>
        </div>

        <!-- 状态 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            状态
          </label>
          <div class="flex items-center gap-3">
            <input type="checkbox" class="toggle toggle-primary" v-model="formState.isActive" />
            <span class="text-sm text-gray-600">{{ formState.isActive ? '启用中' : '已禁用' }}</span>
          </div>
        </div>

        <!-- 智能体简介 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            智能体简介
          </label>
          <textarea 
            v-model="formState.description" 
            class="textarea textarea-bordered w-full h-20" 
            placeholder="可选，简要描述智能体用途"
          ></textarea>
        </div>

        <!-- 系统提示词 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            系统提示词 (System Prompt)
          </label>
          <textarea 
            v-model="formState.prompt" 
            class="textarea textarea-bordered w-full h-32 leading-relaxed" 
            placeholder="请输入系统提示词，用于定义智能体的角色、行为和约束..."
          ></textarea>
        </div>

        <!-- 模型参数配置 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            模型参数配置 (JSON 格式)
          </label>
          <textarea 
            v-model="formState.llmParamsStr" 
            class="textarea textarea-bordered w-full h-24 font-mono text-sm leading-relaxed" 
            placeholder="{\n  &quot;temperature&quot;: 0.7,\n  &quot;max_tokens&quot;: 2000\n}"
          ></textarea>
          <div class="text-sm text-gray-500 mt-1 flex items-start gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>输入合法的 JSON 字符串以覆盖模型的默认调用参数。</span>
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div class="modal-action mt-8 border-t border-base-200 pt-4">
        <button class="btn w-24" @click="handleClose" :disabled="saving">取消</button>
        <button class="btn btn-primary w-24" :disabled="saving" @click="handleSubmit">
          <span v-if="saving" class="loading loading-spinner loading-sm"></span>
          确定
        </button>
      </div>
    </div>

    <!-- 点击背景关闭 -->
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">关闭</button>
    </form>
  </dialog>
</template>
