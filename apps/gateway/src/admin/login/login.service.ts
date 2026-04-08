import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/database';
import { RsaService } from '../../common/auth/rsa.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private rsaService: RsaService,
  ) {}

  getPublicKey() {
    const publicKey = this.rsaService.getPublicKey();
    return { publicKey };
  }

  async register(dto: RegisterDto) {
    const { username, password, phone, email } = dto;

    // 检查用户是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        phone,
        email,
      },
    });

    // 返回不包含密码的用户信息
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 签发 JWT
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    // 返回登录成功信息和 Token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return {
      message: '登录成功',
      token,
      user: result,
    };
  }
}
