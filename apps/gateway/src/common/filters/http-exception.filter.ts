import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { IResponse } from '../interfaces/response.interface';
import { ResponseCode, ResponseMessage } from '../enums';

/**
 * 全局 HTTP 异常过滤器
 * 捕获所有抛出的 HttpException 及其他未捕获异常，
 * 将其格式化为统一的 JSON 结构返回
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = ResponseMessage.INTERNAL_SERVER_ERROR;
    let code: number = ResponseCode.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as IResponse;

      // 如果 HttpException 的 response 包含 message (通常是 class-validator 抛出的错误)
      if (exceptionResponse && typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || exception.message;
        code = exceptionResponse.code || status;
      } else {
        message = exception.message;
        code = status;
      }
    } else if (exception instanceof Error) {
      // 记录未知的系统级错误
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.message}`,
        exception.stack,
      );

      // 对于生产环境或者系统内部错误，不要把详细的堆栈/数据库报错信息返回给前端
      message =
        process.env.NODE_ENV === 'production'
          ? ResponseMessage.INTERNAL_SERVER_ERROR
          : '服务器内部错误，请检查后端日志';
    }

    // 格式化错误信息为字符串
    const finalMessage = Array.isArray(message)
      ? String(message[0])
      : String(message);

    const errorResponse: IResponse<null> = {
      code,
      message: finalMessage,
      data: null,
      timestamp: Date.now(),
    };

    response.status(status).json(errorResponse);
  }
}
