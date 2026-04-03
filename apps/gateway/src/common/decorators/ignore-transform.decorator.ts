import { SetMetadata } from '@nestjs/common';

export const IGNORE_TRANSFORM_KEY = 'ignoreTransform';

/**
 * 忽略全局响应转换拦截器
 * 用于 SSE 流式返回或其他自定义响应结构的接口
 */
export const IgnoreTransform = () => SetMetadata(IGNORE_TRANSFORM_KEY, true);
