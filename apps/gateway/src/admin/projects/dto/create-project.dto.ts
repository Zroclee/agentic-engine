import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AuthType } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ description: '项目名称' })
  @IsString()
  @IsNotEmpty({ message: '项目名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '项目简介' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '认证方式',
    enum: AuthType,
    default: AuthType.NONE,
  })
  @IsOptional()
  @IsEnum(AuthType)
  authType?: AuthType;

  @ApiPropertyOptional({
    description: '认证配置 JSON 字符串 (如包含 key 或 secret 等)',
  })
  @IsOptional()
  @IsString()
  authConfig?: string;
}
