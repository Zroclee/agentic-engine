import request from '@/api/request';

export interface PublicKeyResponse {
  publicKey: string;
}

export interface LoginParams {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  // 根据实际后端返回字段调整
}

export interface UserInfoResponse {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取RSA公钥
 */
export function getPublicKey() {
  return request.get<any, PublicKeyResponse>('/admin/auth/public-key');
}

/**
 * 管理员登录
 */
export function login(data: LoginParams) {
  return request.post<any, LoginResponse>('/admin/auth/login', data);
}

/**
 * 获取当前登录用户信息
 */
export function getUserInfo() {
  return request.get<any, UserInfoResponse>('/admin/auth/info');
}

/**
 * 管理员登出
 */
export function logout() {
  return request.post<any, { message: string }>('/admin/auth/logout');
}
