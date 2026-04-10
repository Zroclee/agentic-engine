import request from './request';

// 用户信息接口定义
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Array<{
    roleCode: string;
    roleName: string;
  }>;
}

// 分页查询参数接口
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// 分页响应数据接口
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 分页查询用户列表
 * @param params 查询参数 (包含 page, pageSize, keyword 等)
 */
export function getUserList(params: UserQueryParams) {
  return request.post<any, PaginatedResponse<UserInfo>>('/admin/user', params);
}

// 角色信息接口定义
export interface RoleInfo {
  id: number;
  roleCode: string;
  roleName: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

// 角色分页查询参数接口
export interface RoleQueryParams {
  page?: number;
  pageSize?: number;
  roleName?: string;
}

/**
 * 分页查询角色列表
 * @param params 查询参数 (包含 page, pageSize, roleName 等)
 */
export function getRoleList(params: RoleQueryParams) {
  return request.post<any, PaginatedResponse<RoleInfo>>('/admin/roles/list', params);
}


