import request from './request'

export interface Llm {
  id: string
  provider: string
  name: string
  baseUrl?: string | null
  apiKey?: string // 列表和详情中返回的是脱敏占位符
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user?: {
    username: string
  }
}

export interface LlmQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface CreateLlmDto {
  provider: string
  name: string
  baseUrl?: string
  apiKey: string
}

export interface UpdateLlmDto extends Partial<CreateLlmDto> {}

export const llmApi = {
  // 查询大模型列表
  getList(data: LlmQuery) {
    return request.post<{ list: Llm[]; total: number; page: number; pageSize: number }>('/admin/llms/list', data)
  },

  // 获取单个大模型详情
  getDetail(id: string) {
    return request.get<Llm>(`/admin/llms/${id}`)
  },

  // 创建大模型
  create(data: CreateLlmDto) {
    return request.post<Llm>('/admin/llms', data)
  },

  // 更新大模型
  update(id: string, data: UpdateLlmDto) {
    return request.patch<Llm>(`/admin/llms/${id}`, data)
  },

  // 删除大模型
  remove(id: string) {
    return request.delete<{ success: boolean }>(`/admin/llms/${id}`)
  },

  // 设置模型是否公开 (仅超级管理员)
  setPublic(id: string, isPublic: boolean) {
    return request.patch<{ id: string; isPublic: boolean }>(`/admin/llms/${id}/public`, { isPublic })
  }
}
