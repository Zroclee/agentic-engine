import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/database';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentQueryDto } from './dto/agent-query.dto';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  // 检查是否为超级管理员
  private async isSuperAdmin(userId: string): Promise<boolean> {
    const count = await this.prisma.userRole.count({
      where: {
        userId,
        role: {
          roleCode: 'SUPER_ADMIN',
        },
      },
    });
    return count > 0;
  }

  // 检查项目归属权
  private async checkProjectOwnership(
    projectId: string,
    userId: string,
    isSuper: boolean,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('关联的项目不存在');
    }
    if (!isSuper && project.userId !== userId) {
      throw new ForbiddenException('您无权操作该项目下的智能体');
    }
  }

  async create(createAgentDto: CreateAgentDto, userId: string) {
    const isSuper = await this.isSuperAdmin(userId);
    await this.checkProjectOwnership(createAgentDto.projectId, userId, isSuper);

    // Prisma JSON type expects any valid JSON object.
    // Typescript Record<string, any> is fine if we cast it to Prisma.InputJsonValue or just let Prisma handle it
    return this.prisma.agent.create({
      data: {
        ...createAgentDto,
        llmParams: createAgentDto.llmParams
          ? (createAgentDto.llmParams as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  }

  async findAll(query: AgentQueryDto, userId: string) {
    const { page = 1, pageSize = 10, keyword, projectId } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.AgentWhereInput = {};

    if (keyword) {
      where.name = { contains: keyword, mode: 'insensitive' };
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper) {
      // 只能查询自己项目下的智能体
      where.project = {
        userId,
      };
    }

    const [total, list] = await Promise.all([
      this.prisma.agent.count({ where }),
      this.prisma.agent.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: { id: true, name: true },
          },
          llm: {
            select: { id: true, name: true, provider: true },
          },
        },
      }),
    ]);

    return { list, total, page, pageSize };
  }

  async findOne(id: string, userId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, userId: true },
        },
        llm: {
          select: { id: true, name: true, provider: true },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException('智能体不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && agent.project.userId !== userId) {
      throw new ForbiddenException('您无权访问该智能体');
    }

    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto, userId: string) {
    const agent = await this.findOne(id, userId); // findOne 已经包含了权限校验

    if (
      updateAgentDto.projectId &&
      updateAgentDto.projectId !== agent.projectId
    ) {
      const isSuper = await this.isSuperAdmin(userId);
      await this.checkProjectOwnership(
        updateAgentDto.projectId,
        userId,
        isSuper,
      );
    }

    const updateData: Prisma.AgentUpdateInput = { ...updateAgentDto };

    if (updateAgentDto.llmParams !== undefined) {
      updateData.llmParams = updateAgentDto.llmParams
        ? (updateAgentDto.llmParams as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    }

    return this.prisma.agent.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // 校验权限

    await this.prisma.agent.delete({ where: { id } });
    return { success: true };
  }
}
