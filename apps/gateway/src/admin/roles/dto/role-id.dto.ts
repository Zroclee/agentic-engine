import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class RoleIdDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  @IsInt()
  id: number;
}
