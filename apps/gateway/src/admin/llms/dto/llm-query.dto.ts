import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LlmQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '搜索关键词(模型名称或供应商)' })
  @IsString()
  @IsOptional()
  keyword?: string;
}
