import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginService } from './login.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RsaDecrypt } from '@/common/interceptors/rsa-decrypt.interceptor';
import { JwtAuthGuard } from '@/common/auth';

@ApiTags('Admin Login')
@Controller('admin/auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('public-key')
  @ApiOperation({ summary: '获取RSA公钥' })
  getPublicKey() {
    return this.loginService.getPublicKey();
  }

  @Post('register')
  @ApiOperation({ summary: '管理员注册' })
  @UseInterceptors(RsaDecrypt('password', 'phone', 'email'))
  register(@Body() dto: RegisterDto) {
    return this.loginService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '管理员登录' })
  @UseInterceptors(RsaDecrypt('password'))
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginService.login(dto);

    // 设置 Cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15分钟
    });

    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: '管理员登出' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: '登出成功' };
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getUserInfo(@Req() req: Request) {
    return req.user;
  }
}
