import request from './request';

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
