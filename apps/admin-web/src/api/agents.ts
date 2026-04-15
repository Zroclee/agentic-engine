import request from '@/api/request';

export interface AgentItem {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  llmParams: any | null;
  isActive: boolean;
  projectId: string;
  llmId: string | null;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    userId?: string;
  };
  llm?: {
    id: string;
    name: string;
    provider: string;
  };
}

export interface AgentListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  projectId?: string;
}

export interface AgentListResponse {
  list: AgentItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateAgentDto {
  name: string;
  description?: string;
  prompt?: string;
  llmParams?: any;
  isActive?: boolean;
  projectId: string;
  llmId?: string;
}

export type UpdateAgentDto = Partial<CreateAgentDto>;

export const agentApi = {
  /**
   * 获取智能体列表
   */
  getList(data: AgentListParams) {
    return request.post<AgentListResponse>('/admin/agent/list', data);
  },

  /**
   * 获取智能体详情
   */
  getDetail(id: string) {
    return request.get<AgentItem>(`/admin/agent/${id}`);
  },

  /**
   * 创建智能体
   */
  create(data: CreateAgentDto) {
    return request.post<AgentItem>('/admin/agent', data);
  },

  /**
   * 更新智能体
   */
  update(id: string, data: UpdateAgentDto) {
    return request.patch<AgentItem>(`/admin/agent/${id}`, data);
  },

  /**
   * 删除智能体
   */
  remove(id: string) {
    return request.delete<{ success: boolean }>(`/admin/agent/${id}`);
  }
};
