import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseModule } from '../database';
import { RsaService } from './rsa.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true, // 全局注册 JwtModule，这样其他模块就不需要导入 JwtModule
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'your-secret-key',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [JwtStrategy, RsaService],
  exports: [JwtStrategy, PassportModule, JwtModule, RsaService],
})
export class AuthModule {}
