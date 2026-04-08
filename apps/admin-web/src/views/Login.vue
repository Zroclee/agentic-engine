<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
import { getPublicKey } from '../api/auth';
import { useAppStore } from '../store/app';

const router = useRouter();
const appStore = useAppStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // 1. 获取公钥
    const pubKeyRes = await getPublicKey();
    const publicKey = pubKeyRes?.publicKey;
    
    if (!publicKey) {
      throw new Error('获取公钥失败');
    }

    // 2. 加密密码
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPassword = encrypt.encrypt(password.value);
    
    if (!encryptedPassword) {
      throw new Error('密码加密失败');
    }

    // 3. 发送登录请求并同步用户信息
    const loginRes = await appStore.login({
      username: username.value,
      password: encryptedPassword
    });

    // 4. 登录成功处理
    if (loginRes) {
      // 登录成功后，网关已在响应头中设置了 HttpOnly 的 Cookie，
      // 后续请求只需配置 withCredentials 即可携带
      router.push('/');
    } else {
      throw new Error('登录失败');
    }
    
  } catch (error: any) {
    console.error('Login failed:', error);
    errorMessage.value = error.message || '登录失败，请检查网络或联系管理员';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Login</h2>
        
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="alert alert-error shadow-lg mb-4 p-2 text-sm text-white">
          <span>{{ errorMessage }}</span>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input 
            v-model="username"
            type="text" 
            placeholder="Type your username" 
            class="input input-bordered w-full" 
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input 
            v-model="password"
            type="password" 
            placeholder="Type your password" 
            class="input input-bordered w-full" 
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="card-actions justify-end mt-6">
          <button 
            class="btn btn-primary w-full" 
            :class="{ 'loading': loading }" 
            :disabled="loading"
            @click="handleLogin"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            Sign In
          </button>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/regist" class="link link-primary">Don't have an account? Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
