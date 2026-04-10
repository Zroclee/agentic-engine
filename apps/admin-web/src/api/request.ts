import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { Message } from '@/components/Message';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  // 本地环境 baseURL 为 /api，生产环境可根据实际情况通过环境变量配置
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许携带 cookie
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如：注入 token
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    // 可根据后端约定的数据结构直接返回 data 部分
    const res = response.data;
    
    // 后端统一返回 200 HTTP 状态码，通过 code 区分业务状态
    if (res.code !== undefined && res.code !== 200) {
      // 统一处理 401 未授权等特定业务错误码
      if (res.code === 401) {
        Message.error(res.message || '未授权，请先登录');
        console.error('401 未授权:', res.message);

        // 跳转登录页等逻辑，例如：
        // window.location.href = '/login';
      } else {
        // 其他错误可以统一弹窗提示，或者直接透传给业务层
        console.error('业务异常:', res.message);
      }
      
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 返回实际的数据部分
    return res.data !== undefined ? res.data : res;
  },
  (error: AxiosError<any>) => {
    // 由于后端无论如何都会返回 200，只有网络错误或跨域等情况才会走到这里
    console.error('API Error:', error.message);
    
    return Promise.reject(error);
  }
);

export default request;
