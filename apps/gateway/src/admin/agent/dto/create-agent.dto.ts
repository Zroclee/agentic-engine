import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ description: '智能体名称' })
  @IsString()
  @IsNotEmpty({ message: '智能体名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '智能体描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '系统提示词' })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({ description: '大模型参数配置' })
  @IsOptional()
  @IsObject()
  llmParams?: Record<string, any>;

  @ApiPropertyOptional({ description: '是否激活', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '所属项目ID' })
  @IsString()
  @IsNotEmpty({ message: '所属项目ID不能为空' })
  projectId: string;

  @ApiPropertyOptional({ description: '关联的大模型ID' })
  @IsOptional()
  @IsString()
  llmId?: string;
}
