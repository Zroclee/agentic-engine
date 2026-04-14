import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '@/common/auth';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { TestAuthDto } from './dto/test-auth.dto';

@ApiTags('Admin Projects')
@ApiBearerAuth()
@Controller('admin/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.create(createProjectDto, userId);
  }

  @Post('list')
  @ApiOperation({ summary: '查询项目列表' })
  findAll(@Body() query: ProjectQueryDto, @CurrentUser('id') userId: string) {
    return this.projectsService.findAll(query, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个项目' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新项目' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Post('test-auth')
  @ApiOperation({ summary: '测试项目认证配置' })
  testAuth(@Body() dto: TestAuthDto) {
    return this.projectsService.testAuth(dto);
  }
}
