import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ description: '是否启用', example: true })
  @IsBoolean()
  isActive: boolean;
}
