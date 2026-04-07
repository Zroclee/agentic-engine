import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { LoginModule } from './admin/login/login.module';

@Module({
  imports: [DatabaseModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
