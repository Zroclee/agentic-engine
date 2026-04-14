import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, AuthType } from '@prisma/client';
import { PrismaService } from '../../common/database';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { TestAuthDto } from './dto/test-auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class ProjectsService {
  private readonly algorithm = 'aes-256-gcm';
  // 在实际生产中，请确保将此密钥存储在环境变量中
  private readonly secretKey =
    process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';

  constructor(private prisma: PrismaService) {}

  // 加密方法
  private encrypt(text: string): string {
    if (!text) return text;
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.secretKey, 'utf8'),
        iv,
      );
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (e) {
      console.error('Encryption failed', e);
      throw new BadRequestException('加密配置失败');
    }
  }

  // 解密方法
  private decrypt(hash: string): string {
    if (!hash) return hash;
    try {
      const parts = hash.split(':');
      if (parts.length !== 3) return hash;
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedText = Buffer.from(parts[2], 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.secretKey, 'utf8'),
        iv,
      );
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedText).toString('utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error('Decryption failed', e);
      throw new BadRequestException('解密配置失败');
    }
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { name, description, authType, authConfig } = createProjectDto;

    const encryptedConfig = authConfig ? this.encrypt(authConfig) : null;

    return this.prisma.project.create({
      data: {
        name,
        description,
        authType: authType || AuthType.NONE,
        authConfig: encryptedConfig,
        userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        authType: true,
        createdAt: true,
      },
    });
  }

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

  async findAll(query: ProjectQueryDto, userId: string) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProjectWhereInput = {};
    if (keyword) {
      where.name = { contains: keyword, mode: 'insensitive' };
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper) {
      where.userId = userId;
    }

    const [total, list] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          authType: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              username: true,
            },
          },
          // 列表不返回 authConfig
        },
      }),
    ]);

    return { list, total, page, pageSize };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
      },
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && project.userId !== userId) {
      throw new NotFoundException('项目不存在或无权限访问');
    }

    // 脱敏处理，不返回真实配置
    let maskedConfig: string | null = null;
    if (project.authConfig) {
      maskedConfig =
        '{"isConfigured": true, "message": "Sensitive data masked"}';
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      authType: project.authType,
      authConfig: maskedConfig,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      user: project.user,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && project.userId !== userId) {
      throw new NotFoundException('项目不存在或无权限访问');
    }

    const { name, description, authType, authConfig } = updateProjectDto;

    // 如果有新传 authConfig，就重新加密覆盖，否则保留原有
    let encryptedConfig = project.authConfig;
    if (authConfig !== undefined) {
      encryptedConfig = authConfig ? this.encrypt(authConfig) : null;
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        authType,
        authConfig: encryptedConfig,
      },
      select: {
        id: true,
        name: true,
        authType: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    const isSuper = await this.isSuperAdmin(userId);
    if (!isSuper && project.userId !== userId) {
      throw new NotFoundException('项目不存在或无权限访问');
    }

    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async testAuth(dto: TestAuthDto) {
    const { authType, authConfig, testUrl } = dto;
    if (authType === AuthType.NONE) {
      return { success: true, message: '无认证模式无需测试' };
    }

    if (!authConfig) {
      throw new BadRequestException('必须提供认证配置(authConfig)');
    }

    try {
      const config = JSON.parse(authConfig) as Record<string, any>;

      if (authType === AuthType.DYNAMIC_TOKEN) {
        // DYNAMIC_TOKEN 模式：使用 secret 调用 tokenUrl 换取 token
        const secret = config['secret'] as string | undefined;
        const tokenUrl = config['tokenUrl'] as string | undefined;
        // tokenPath 保留供后续使用
        // const tokenPath = config['tokenPath'] as string | undefined;

        if (!secret || !tokenUrl) {
          throw new BadRequestException(
            'DYNAMIC_TOKEN 必须配置 secret 和 tokenUrl',
          );
        }

        // 使用 fetch 调用鉴权接口
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 可能需要根据实际情况传 header
          },
          body: JSON.stringify({ secret }),
        });

        if (!response.ok) {
          throw new Error(
            `请求失败: ${response.status} ${response.statusText}`,
          );
        }

        const data = (await response.json()) as Record<string, any>;
        return {
          success: true,
          message: '认证接口测试成功',
          data: data, // 实际场景中可以只返回部分信息，或直接显示通过
        };
      }

      if (authType === AuthType.API_KEY) {
        if (!testUrl) {
          throw new BadRequestException(
            'API_KEY 模式需要提供 testUrl 以供验证',
          );
        }

        const key = config['key'] as string | undefined;
        const position = config['position'] as string | undefined;
        const keyName = config['keyName'] as string | undefined;

        const headers: Record<string, string> = {};

        if (position === 'header' && key) {
          headers[keyName || 'Authorization'] = key;
        }

        // 简单发送请求测试
        const response = await fetch(testUrl, { headers });
        return {
          success: response.ok,
          status: response.status,
          message: response.ok ? '接口测试通过' : '接口测试未通过',
        };
      }
    } catch (error: unknown) {
      console.error('Test Auth Error:', error);
      const msg = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`认证测试失败: ${msg}`);
    }
  }
}
