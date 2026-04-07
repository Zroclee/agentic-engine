import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Login')
@Controller('admin/auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @ApiOperation({ summary: '管理员注册' })
  register(@Body() dto: RegisterDto) {
    return this.loginService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '管理员登录' })
  login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }
}
