import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateRoleStatusDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  @IsInt()
  id: number;

  @ApiPropertyOptional({
    description: '角色状态：0-禁用，1-启用。如果不传则默认切换当前状态。',
    enum: [0, 1],
  })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  status?: number;
}
