import { ResponseCode, ResponseMessage } from '../enums';

/**
 * 统一响应体接口
 */
export interface IResponse<T = any> {
  /**
   * 业务状态码
   */
  code: ResponseCode | number;

  /**
   * 响应数据
   */
  data: T;

  /**
   * 响应消息提示
   */
  message: ResponseMessage | string;

  /**
   * 响应时间戳
   */
  timestamp: number;
}
