import { defineStore } from 'pinia';
import { getUserInfo, login as apiLogin, logout as apiLogout, type UserInfoResponse, type LoginParams } from '../api/auth';

export const useAppStore = defineStore('app', {
  state: () => ({
    userInfo: null as UserInfoResponse | null,
    isInitialized: false,
  }),

  actions: {
    async login(params: LoginParams) {
      try {
        const res = await apiLogin(params);
        // 登录成功后，主动拉取一次用户信息以同步状态
        await this.fetchUserInfo();
        return res;
      } catch (error: any) {
        console.error('登录失败', error);
        throw new Error(error.message || '登录失败');
      }
    },

    async logout() {
      try {
        await apiLogout();
        this.clearUserInfo();
      } catch (error: any) {
        console.error('登出失败', error);
        throw new Error(error.message || '登出失败');
      }
    },

    async fetchUserInfo() {
      try {
        const res = await getUserInfo();
        // 根据 axios 返回结果结构判断，如果 axios 拦截器直接返回了 data 数据部分：
        this.userInfo = res;
        this.isInitialized = true;
        return res;
      } catch (error: any) {
        console.error('获取用户信息失败', error);
        this.userInfo = null;
        this.isInitialized = true;
        throw new Error(error.message || '获取用户信息失败');
      }
    },

    clearUserInfo() {
      this.userInfo = null;
      this.isInitialized = false;
    },
  },
});
