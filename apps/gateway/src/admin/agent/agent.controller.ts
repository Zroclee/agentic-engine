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
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '@/common/auth';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentQueryDto } from './dto/agent-query.dto';

@ApiTags('Admin Agents')
@ApiBearerAuth()
@Controller('admin/agent')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @ApiOperation({ summary: '创建智能体' })
  create(
    @Body() createAgentDto: CreateAgentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.agentService.create(createAgentDto, userId);
  }

  @Post('list')
  @ApiOperation({ summary: '查询智能体列表' })
  findAll(@Body() query: AgentQueryDto, @CurrentUser('id') userId: string) {
    return this.agentService.findAll(query, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个智能体' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.agentService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新智能体' })
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.agentService.update(id, updateAgentDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除智能体' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.agentService.remove(id, userId);
  }
}
