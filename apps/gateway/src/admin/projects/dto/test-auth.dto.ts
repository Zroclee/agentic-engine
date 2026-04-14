import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AuthType } from '@prisma/client';

export class TestAuthDto {
  @ApiProperty({ description: '认证方式', enum: AuthType })
  @IsEnum(AuthType)
  @IsNotEmpty()
  authType: AuthType;

  @ApiPropertyOptional({ description: '认证配置 JSON 字符串' })
  @IsOptional()
  @IsString()
  authConfig?: string;

  @ApiPropertyOptional({
    description: '测试的目标接口地址 (API_KEY 模式可能需要)',
  })
  @IsOptional()
  @IsString()
  testUrl?: string;
}
