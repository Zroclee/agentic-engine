import request from '@/api/request';

export interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  authType: 'NONE' | 'API_KEY' | 'DYNAMIC_TOKEN';
  createdAt: string;
  updatedAt: string;
  user?: { username: string };
  authConfig?: string; // 仅在详情中可能返回脱敏后的内容
}

export interface ProjectListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface ProjectListResponse {
  list: ProjectItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  authType?: 'NONE' | 'API_KEY' | 'DYNAMIC_TOKEN';
  authConfig?: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface TestAuthDto {
  authType: 'NONE' | 'API_KEY' | 'DYNAMIC_TOKEN';
  authConfig?: string;
  testUrl?: string;
}

/**
 * 获取项目列表
 */
export function getProjectList(data: ProjectListParams) {
  return request.post<ProjectListResponse>('/admin/projects/list', data);
}

/**
 * 获取项目详情
 */
export function getProjectDetail(id: string) {
  return request.get<ProjectItem>(`/admin/projects/${id}`);
}

/**
 * 创建项目
 */
export function createProject(data: CreateProjectDto) {
  return request.post<ProjectItem>('/admin/projects', data);
}

/**
 * 更新项目
 */
export function updateProject(id: string, data: UpdateProjectDto) {
  return request.patch<ProjectItem>(`/admin/projects/${id}`, data);
}

/**
 * 删除项目
 */
export function deleteProject(id: string) {
  return request.delete<{ success: boolean }>(`/admin/projects/${id}`);
}

/**
 * 测试认证配置
 */
export function testProjectAuth(data: TestAuthDto) {
  return request.post<{ success: boolean; message: string; status?: number; data?: any }>(
    '/admin/projects/test-auth',
    data
  );
}
