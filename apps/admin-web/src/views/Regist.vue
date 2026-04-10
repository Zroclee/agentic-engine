<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
import { getPublicKey, register } from '@/api/auth';

const router = useRouter();

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: ''
});

const loading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  // 1. 表单校验
  if (!form.value.username) {
    errorMessage.value = '请输入用户名';
    return;
  }
  if (!form.value.password) {
    errorMessage.value = '请输入密码';
    return;
  }
  if (form.value.password.length < 6) {
    errorMessage.value = '密码长度不能少于 6 位';
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // 2. 获取公钥
    let publicKey = '';
    try {
      const pubKeyRes = await getPublicKey();
      publicKey = pubKeyRes?.publicKey;
      if (!publicKey) {
        throw new Error('获取公钥失败');
      }
    } catch (err: any) {
      throw new Error('网络异常: ' + (err.message || '获取公钥失败'));
    }

    // 3. RSA 加密敏感字段 (password, phone, email)
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    
    const encryptedPassword = encrypt.encrypt(form.value.password);
    if (!encryptedPassword) {
      throw new Error('密码加密失败');
    }

    let encryptedPhone = undefined;
    if (form.value.phone) {
      encryptedPhone = encrypt.encrypt(form.value.phone);
      if (!encryptedPhone) throw new Error('手机号加密失败');
    }

    let encryptedEmail = undefined;
    if (form.value.email) {
      encryptedEmail = encrypt.encrypt(form.value.email);
      if (!encryptedEmail) throw new Error('邮箱加密失败');
    }

    // 4. 发送注册请求
    await register({
      username: form.value.username,
      password: encryptedPassword,
      phone: encryptedPhone || undefined,
      email: encryptedEmail || undefined
    });

    // 5. 注册成功，跳转登录页
    alert('注册成功，请登录');
    router.push('/login');
    
  } catch (error: any) {
    console.error('Register failed:', error);
    errorMessage.value = error.message || '注册失败，请检查网络或稍后再试';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200 py-10">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Register</h2>
        
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="alert alert-error shadow-lg mb-4 p-2 text-sm text-white">
          <span>{{ errorMessage }}</span>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Username <span class="text-error">*</span></span>
          </label>
          <input 
            v-model="form.username"
            type="text" 
            placeholder="Choose a username" 
            class="input input-bordered w-full" 
          />
        </div>
        
        <div class="form-control w-full mt-2">
          <label class="label">
            <span class="label-text">Password <span class="text-error">*</span></span>
          </label>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="Min 6 characters" 
            class="input input-bordered w-full" 
          />
        </div>
        
        <div class="form-control w-full mt-2">
          <label class="label">
            <span class="label-text">Confirm Password <span class="text-error">*</span></span>
          </label>
          <input 
            v-model="form.confirmPassword"
            type="password" 
            placeholder="Confirm your password" 
            class="input input-bordered w-full" 
          />
        </div>

        <div class="form-control w-full mt-2">
          <label class="label">
            <span class="label-text">Phone (Optional)</span>
          </label>
          <input 
            v-model="form.phone"
            type="tel" 
            placeholder="Your phone number" 
            class="input input-bordered w-full" 
          />
        </div>

        <div class="form-control w-full mt-2">
          <label class="label">
            <span class="label-text">Email (Optional)</span>
          </label>
          <input 
            v-model="form.email"
            type="email" 
            placeholder="Your email address" 
            class="input input-bordered w-full" 
            @keyup.enter="handleRegister"
          />
        </div>

        <div class="card-actions justify-end mt-6">
          <button 
            class="btn btn-primary w-full"
            :class="{ 'loading': loading }"
            :disabled="loading"
            @click="handleRegister"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            Sign Up
          </button>
        </div>
        
        <div class="mt-4 text-center">
          <router-link to="/login" class="link link-primary">Already have an account? Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
