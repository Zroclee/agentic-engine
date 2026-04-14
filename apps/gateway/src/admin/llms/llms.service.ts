import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/database';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';
import { LlmQueryDto } from './dto/llm-query.dto';
import { CryptoUtil } from '@/common/utils/crypto.util';

@Injectable()
export class LlmsService {
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

  async create(createLlmDto: CreateLlmDto, userId: string) {
    const { provider, name, baseUrl, apiKey } = createLlmDto;

    const encryptedApiKey = CryptoUtil.encrypt(apiKey);

    return this.prisma.llm.create({
      data: {
        provider,
        name,
        baseUrl,
        apiKey: encryptedApiKey,
        userId,
      },
      select: {
        id: true,
        provider: true,
        name: true,
        baseUrl: true,
        isPublic: true,
        createdAt: true,
      },
    });
  }

  async findAll(query: LlmQueryDto, userId: string) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.LlmWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { provider: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper) {
      // 非超管只能看到公开模型或自己创建的模型
      where.OR = [
        ...(where.OR ? [{ AND: [{ OR: where.OR }] }] : []),
        { isPublic: true },
        { userId: userId },
      ];
      // 如果之前有 OR 查询，需要合并处理，上述写法在 Prisma 中可能有些复杂，简单点：
      if (keyword) {
        where.AND = [
          {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { provider: { contains: keyword, mode: 'insensitive' } },
            ],
          },
          { OR: [{ isPublic: true }, { userId: userId }] },
        ];
        delete where.OR;
      } else {
        where.OR = [{ isPublic: true }, { userId: userId }];
      }
    }

    const [total, list] = await Promise.all([
      this.prisma.llm.count({ where }),
      this.prisma.llm.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          provider: true,
          name: true,
          baseUrl: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              username: true,
            },
          },
          // 列表不返回 apiKey
        },
      }),
    ]);

    return { list, total, page, pageSize };
  }

  async findOne(id: string, userId: string) {
    const llm = await this.prisma.llm.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
      },
    });

    if (!llm) {
      throw new NotFoundException('大模型不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && llm.userId !== userId && !llm.isPublic) {
      throw new NotFoundException('大模型不存在或无权限访问');
    }

    // 脱敏处理 API Key
    const maskedApiKey =
      'sk-****' + (llm.apiKey.length > 8 ? llm.apiKey.slice(-4) : '****');

    return {
      id: llm.id,
      provider: llm.provider,
      name: llm.name,
      baseUrl: llm.baseUrl,
      isPublic: llm.isPublic,
      apiKey: maskedApiKey, // 返回脱敏的 Key，不返回真实密文和明文
      createdAt: llm.createdAt,
      updatedAt: llm.updatedAt,
      user: llm.user,
    };
  }

  async update(id: string, updateLlmDto: UpdateLlmDto, userId: string) {
    const llm = await this.prisma.llm.findUnique({ where: { id } });
    if (!llm) {
      throw new NotFoundException('大模型不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && llm.userId !== userId) {
      throw new NotFoundException('大模型不存在或无权限访问');
    }

    const { provider, name, baseUrl, apiKey } = updateLlmDto;

    // 只有当传了新的真实 apiKey（而不是脱敏占位符）才进行加密更新
    let encryptedApiKey = llm.apiKey;
    if (apiKey && !apiKey.startsWith('sk-****')) {
      encryptedApiKey = CryptoUtil.encrypt(apiKey);
    }

    return this.prisma.llm.update({
      where: { id },
      data: {
        provider,
        name,
        baseUrl,
        apiKey: encryptedApiKey,
      },
      select: {
        id: true,
        provider: true,
        name: true,
        baseUrl: true,
        isPublic: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const llm = await this.prisma.llm.findUnique({ where: { id } });
    if (!llm) {
      throw new NotFoundException('大模型不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && llm.userId !== userId) {
      throw new NotFoundException('大模型不存在或无权限访问');
    }

    await this.prisma.llm.delete({ where: { id } });
    return { success: true };
  }

  async setPublic(id: string, isPublic: boolean, userId: string) {
    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper) {
      throw new ForbiddenException('仅超级管理员可设置公开模型');
    }

    const llm = await this.prisma.llm.findUnique({ where: { id } });
    if (!llm) {
      throw new NotFoundException('大模型不存在');
    }

    return this.prisma.llm.update({
      where: { id },
      data: {
        isPublic,
      },
      select: {
        id: true,
        isPublic: true,
      },
    });
  }
}
