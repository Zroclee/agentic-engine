import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, _info: any) {
    // 如果存在内部错误，或者没有解析出 user（比如未携带 token，或者 token 被策略直接判定无效返回 false）
    if (err || !user) {
      throw err || new UnauthorizedException('登录已过期请重新登录');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
