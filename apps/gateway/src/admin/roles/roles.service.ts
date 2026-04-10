import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/database';
import { RoleQueryDto } from './dto/role-query.dto';
import { UpdateRoleStatusDto } from './dto/update-role-status.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: RoleQueryDto) {
    const { page = 1, pageSize = 10, roleName } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.RoleWhereInput = {};
    if (roleName) {
      where.roleName = { contains: roleName, mode: 'insensitive' };
    }

    const [total, list] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const mappedList = list.map((role) => ({
      id: role.id,
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      userCount: role._count.users,
    }));

    return {
      list: mappedList,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return {
      id: role.id,
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      userCount: role._count.users,
    };
  }

  async updateStatus(dto: UpdateRoleStatusDto) {
    const { id, status } = dto;
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    const newStatus = status !== undefined ? status : role.status === 1 ? 0 : 1;

    return this.prisma.role.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        roleCode: true,
        roleName: true,
        status: true,
      },
    });
  }
}
