import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/auth';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Admin User')
@ApiBearerAuth()
@Controller('admin/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个用户' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '启/禁用用户' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.userService.updateStatus(id, dto.isActive);
  }
}
