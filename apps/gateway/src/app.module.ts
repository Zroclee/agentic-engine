import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { AuthModule } from './common/auth';
import { LoginModule } from './admin/login/login.module';

@Module({
  imports: [DatabaseModule, AuthModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
