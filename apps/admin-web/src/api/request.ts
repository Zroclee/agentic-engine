import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

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
    
    // 示例：如果后端约定 code 为 0 表示成功，非 0 表示报错
    if (res.code !== undefined && res.code !== 200) {
      // 假设 200 是成功，可以根据实际情况调整
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 返回实际的数据部分
    return res.data !== undefined ? res.data : res;
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('API Error:', error.message);
    
    // 此处可统一处理 HTTP 错误状态码，如 401, 403, 500 等
    // if (error.response?.status === 401) {
    //   // 跳转登录页等逻辑
    // }
    
    return Promise.reject(error);
  }
);

export default request;
