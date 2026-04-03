import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response.interface';
import { ResponseCode, ResponseMessage } from '../enums';
import { IGNORE_TRANSFORM_KEY } from '../decorators/ignore-transform.decorator';

/**
 * 全局响应转换拦截器
 * 拦截正常响应的数据，包装成统一的返回格式
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T> | T
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | T> {
    // 获取当前方法或类上是否有忽略转换的标记
    const ignoreTransform = this.reflector.getAllAndOverride<boolean>(
      IGNORE_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (ignoreTransform) {
      return next.handle() as Observable<T>;
    }

    return next.handle().pipe(
      map((data: T) => {
        return {
          code: ResponseCode.SUCCESS,
          message: ResponseMessage.SUCCESS,
          data: data ?? (null as unknown as T),
          timestamp: Date.now(),
        };
      }),
    );
  }
}
