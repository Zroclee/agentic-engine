import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLlmDto {
  @ApiProperty({ description: '供应商' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: '模型名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '自定义代理地址' })
  @IsString()
  @IsOptional()
  baseUrl?: string;

  @ApiProperty({ description: 'API Key' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
