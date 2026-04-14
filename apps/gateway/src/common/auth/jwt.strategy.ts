import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token as string | null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: { sub: string; username: string; exp?: number }) {
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('登录已过期请重新登录');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('无效的令牌');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, roles, ...result } = user;
    return {
      ...result,
      roles: roles.map((r) => ({ roleCode: r.role.roleCode })),
    };
  }
}
