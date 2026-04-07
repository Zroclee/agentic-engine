import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { DatabaseModule } from '../../common/database';

@Module({
  imports: [DatabaseModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
