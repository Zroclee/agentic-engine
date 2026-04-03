/**
 * 业务自定义状态码枚举
 */
export enum ResponseCode {
  SUCCESS = 200, // 成功
  BAD_REQUEST = 400, // 请求参数错误
  UNAUTHORIZED = 401, // 未授权或 token 失效
  FORBIDDEN = 403, // 无权限访问
  NOT_FOUND = 404, // 资源不存在
  INTERNAL_SERVER_ERROR = 500, // 服务器内部错误

  // 可根据具体业务需求扩充自定义状态码
  // 例如：
  // USER_NOT_EXIST = 10001,
  // PASSWORD_ERROR = 10002,
}

/**
 * 响应消息枚举
 */
export enum ResponseMessage {
  SUCCESS = '操作成功',
  BAD_REQUEST = '请求参数错误',
  UNAUTHORIZED = '未授权，请先登录',
  FORBIDDEN = '拒绝访问，权限不足',
  NOT_FOUND = '请求的资源不存在',
  INTERNAL_SERVER_ERROR = '服务器内部错误，请稍后再试',
}

/**
 * 响应状态码类型
 */
export type ResponseCodeType = ResponseCode | number;

/**
 * 响应消息类型
 */
export type ResponseMessageType = ResponseMessage | string;
