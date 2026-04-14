import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/**
 * 获取当前登录用户的装饰器
 *
 * 可以通过 @CurrentUser() user 获取整个 user 对象
 * 也可以通过 @CurrentUser('id') userId 获取指定的属性
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = request.user as Record<string, any> | undefined;

    if (!user) return null;
    return data ? (user[data] as unknown) : user;
  },
);
