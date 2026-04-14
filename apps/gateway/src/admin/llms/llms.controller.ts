import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LlmsService } from './llms.service';
import { JwtAuthGuard } from '@/common/auth';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';
import { LlmQueryDto } from './dto/llm-query.dto';

@ApiTags('Admin LLMs')
@ApiBearerAuth()
@Controller('admin/llms')
@UseGuards(JwtAuthGuard)
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) {}

  @Post()
  @ApiOperation({ summary: '创建大模型' })
  create(
    @Body() createLlmDto: CreateLlmDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.llmsService.create(createLlmDto, userId);
  }

  @Post('list')
  @ApiOperation({ summary: '查询大模型列表' })
  findAll(@Body() query: LlmQueryDto, @CurrentUser('id') userId: string) {
    return this.llmsService.findAll(query, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个大模型' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.llmsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新大模型' })
  update(
    @Param('id') id: string,
    @Body() updateLlmDto: UpdateLlmDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.llmsService.update(id, updateLlmDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除大模型' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.llmsService.remove(id, userId);
  }

  @Patch(':id/public')
  @ApiOperation({ summary: '设置大模型是否公开 (仅超级管理员)' })
  @ApiBody({ schema: { properties: { isPublic: { type: 'boolean' } } } })
  setPublic(
    @Param('id') id: string,
    @Body('isPublic', ParseBoolPipe) isPublic: boolean,
    @CurrentUser('id') userId: string,
  ) {
    return this.llmsService.setPublic(id, isPublic, userId);
  }
}
