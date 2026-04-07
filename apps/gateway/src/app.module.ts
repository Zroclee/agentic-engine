import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { AuthModule } from './common/auth';
import { LoginModule } from './admin/login/login.module';
import { UserModule } from './admin/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, LoginModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
