import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/auth';
import { RoleQueryDto } from './dto/role-query.dto';
import { RoleIdDto } from './dto/role-id.dto';
import { UpdateRoleStatusDto } from './dto/update-role-status.dto';

@ApiTags('Admin Roles')
@ApiBearerAuth()
@Controller('admin/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '查询角色列表' })
  findAll(@Body() query: RoleQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Post('detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '查询单个角色信息' })
  findOne(@Body() dto: RoleIdDto) {
    return this.rolesService.findOne(dto.id);
  }

  @Post('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '启/禁用角色' })
  updateStatus(@Body() dto: UpdateRoleStatusDto) {
    return this.rolesService.updateStatus(dto);
  }
}
