import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RsaService } from '../auth/rsa.service';

export function RsaDecrypt(...fields: string[]): Type<NestInterceptor> {
  @Injectable()
  class MixinRsaDecryptInterceptor implements NestInterceptor {
    constructor(private readonly rsaService: RsaService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Record<string, any>>();
      const body = request.body as Record<string, any>;

      if (body && typeof body === 'object') {
        fields.forEach((field) => {
          if (typeof body[field] === 'string') {
            body[field] = this.rsaService.decrypt(body[field]);
          }
        });
      }

      return next.handle();
    }
  }

  return mixin(MixinRsaDecryptInterceptor);
}
