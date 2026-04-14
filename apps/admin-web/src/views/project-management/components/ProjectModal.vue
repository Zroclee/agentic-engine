<script setup lang="ts">
import { ref, watch } from 'vue';
import { createProject, updateProject, testProjectAuth } from '@/api/projects';

const props = defineProps<{
  visible: boolean;
  type: 'add' | 'edit';
  initialData: any;
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
  authType: 'NONE' as 'NONE' | 'API_KEY' | 'DYNAMIC_TOKEN',
  authConfigStr: ''
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
          authType: 'NONE',
          authConfigStr: ''
        };
      } else if (props.initialData) {
        formState.value = {
          id: props.initialData.id || '',
          name: props.initialData.name || '',
          description: props.initialData.description || '',
          authType: props.initialData.authType || 'NONE',
          authConfigStr: props.initialData.authConfigStr || ''
        };
      }
    }
  }
);

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
};

// 测试认证配置
const handleTestAuth = async () => {
  if (formState.value.authType === 'NONE') return;
  if (!formState.value.authConfigStr) {
    alert('请先填写认证配置');
    return;
  }
  
  const payload: any = {
    authType: formState.value.authType,
    authConfig: formState.value.authConfigStr
  };

  if (formState.value.authType === 'API_KEY') {
    const testUrl = prompt('请输入用于测试的 API 完整地址:');
    if (!testUrl) return;
    payload.testUrl = testUrl;
  }

  try {
    const res = await testProjectAuth(payload);
    if (res?.success) {
      alert(`测试成功: ${res.message}`);
    } else {
      alert(`测试失败: ${res?.message || '未知错误'}`);
    }
  } catch (error: any) {
    console.error('测试异常', error);
    alert(`测试发生异常: ${error?.response?.data?.message || error.message}`);
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formState.value.name.trim()) {
    alert('项目名称不能为空');
    return;
  }
  
  saving.value = true;
  try {
    const payload = {
      name: formState.value.name,
      description: formState.value.description,
      authType: formState.value.authType,
      authConfig: formState.value.authConfigStr ? formState.value.authConfigStr : undefined
    };
    
    if (props.type === 'add') {
      await createProject(payload);
    } else {
      await updateProject(formState.value.id, payload);
    }
    
    emit('success');
    handleClose();
  } catch (error) {
    console.error('保存失败', error);
    alert('保存失败');
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': visible }">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="font-bold text-xl mb-6 pb-4 border-b border-base-200">
        {{ type === 'add' ? '新建项目' : '编辑项目' }}
      </h3>
      
      <div class="space-y-5">
        <!-- 项目名称 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            项目名称 <span class="text-error">*</span>
          </label>
          <input 
            v-model="formState.name" 
            type="text" 
            placeholder="请输入项目名称" 
            class="input input-bordered w-full" 
          />
        </div>

        <!-- 项目简介 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            项目简介
          </label>
          <textarea 
            v-model="formState.description" 
            class="textarea textarea-bordered w-full h-24" 
            placeholder="请输入项目简介"
          ></textarea>
        </div>

        <!-- 认证方式 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">
            认证方式
          </label>
          <select v-model="formState.authType" class="select select-bordered w-full">
            <option value="NONE">无认证 (公开接口)</option>
            <option value="API_KEY">API Key (静态密钥)</option>
            <option value="DYNAMIC_TOKEN">动态 Token (通过鉴权接口获取)</option>
          </select>
        </div>

        <!-- 认证配置 -->
        <div class="flex flex-col gap-2" v-if="formState.authType !== 'NONE'">
          <div class="flex justify-between items-center">
            <label class="font-medium text-gray-700">
              认证配置 (JSON 格式) <span class="text-error">*</span>
            </label>
            <button class="btn btn-sm btn-outline btn-primary" @click="handleTestAuth">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              测试配置
            </button>
          </div>
          <textarea 
            v-model="formState.authConfigStr" 
            class="textarea textarea-bordered w-full font-mono h-40 leading-relaxed" 
            :placeholder="formState.authType === 'API_KEY' ? '{\n  \'key\': \'sk-xxx\',\n  \'position\': \'header\',\n  \'keyName\': \'Authorization\'\n}' : '{\n  \'secret\': \'xxx\',\n  \'tokenUrl\': \'https://...\',\n  \'tokenPath\': \'data.token\'\n}'"
          ></textarea>
          <div class="text-sm text-gray-500 mt-1 flex items-start gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span class="break-words leading-relaxed">
              此配置会以 <strong>AES-256-GCM</strong> 强加密算法存入数据库，平台后端在调用时仅在内存中瞬时解密，不会在任何前端页面暴露您的明文凭证。
            </span>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="modal-action mt-8 border-t border-base-200 pt-4">
        <button class="btn w-24" @click="handleClose" :disabled="saving">取消</button>
        <button class="btn btn-primary w-24" @click="handleSubmit" :disabled="saving">
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
