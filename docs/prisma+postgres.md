# Prisma + PostgreSQL 安装与使用指南

本文档记录了在 NestJS 项目中使用 Prisma 结合 PostgreSQL 数据库的完整流程，包含环境搭建、初始化配置及常用命令。

---

## 1. 数据库环境搭建 (Docker PostgreSQL)

推荐使用 Docker 快速启动一个本地 PostgreSQL 数据库。

### 1.1 启动 PostgreSQL 容器

在终端中执行以下命令（以端口映射 `5432:5432` 启动，并设置账号密码）：

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=admin \
  -p 5432:5432 \
  postgres:latest
```

### 1.2 常用 Docker 命令

- **查看运行中的容器**：`docker ps`
- **查看所有容器**：`docker ps -a`
- **停止容器**：`docker stop my-postgres`
- **启动已停止的容器**：`docker start my-postgres`
- **删除容器**：`docker rm -f my-postgres`
- **查看容器环境变量配置**：`docker inspect my-postgres | grep POSTGRES`

---

## 2. Prisma 安装与初始化

在 NestJS 项目（如 `apps/gateway`）中集成 Prisma。

### 2.1 安装依赖

```bash
# 安装 Prisma CLI（开发依赖）和 NestJS 所需依赖
pnpm add -D prisma dotenv

# 安装 Prisma Client（生产依赖）
pnpm add @prisma/client
```

### 2.2 初始化 Prisma

在项目根目录（如 `apps/gateway`）执行初始化命令，并指定数据库提供商为 PostgreSQL：

```bash
npx prisma init --datasource-provider postgresql
```

此命令会自动生成以下文件：
- `prisma/schema.prisma`: Prisma 的数据模型配置文件。
- `prisma.config.ts`: Prisma 配置文件（支持读取 `.env`）。
- `.env`: 环境变量文件，用于存储数据库连接字符串。

---

## 3. 配置数据库连接

### 3.1 修改 `.env` 文件

将生成的 `.env` 文件中的 `DATABASE_URL` 修改为您本地 Docker 数据库的连接字符串。格式如下：

```env
# postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=<SCHEMA>
DATABASE_URL="postgresql://admin:123456@localhost:5432/admin?schema=public"
```

### 3.2 优化 `schema.prisma`

确保 `prisma/schema.prisma` 中的 `generator` 块配置正确：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 示例模型
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 4. NestJS 集成 Prisma

在 NestJS 中，我们需要创建一个 `PrismaService` 来管理数据库连接生命周期，并将其封装在 `DatabaseModule` 中。

### 4.1 创建 `PrismaService`

在 `src/common/database/prisma.service.ts` 中编写：

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 4.2 创建 `DatabaseModule`

在 `src/common/database/database.module.ts` 中编写：

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

### 4.3 注册到 `AppModule`

在 `src/app.module.ts` 中引入 `DatabaseModule`：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';

@Module({
  imports: [DatabaseModule], // 注册数据库模块
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 5. Prisma 常用命令

在日常开发中，主要使用以下命令来管理数据库结构和客户端：

### 5.1 同步模型到数据库 (原型阶段)

**适用于开发阶段快速迭代**。将 `schema.prisma` 中的结构直接推送到数据库（不生成迁移文件）：

```bash
npx prisma db push
```

### 5.2 生成迁移文件 (生产阶段)

**适用于生产环境和团队协作**。根据模型变更生成 SQL 迁移脚本，并应用到数据库：

```bash
npx prisma migrate dev --name <migration-name>
# 例如：npx prisma migrate dev --name init
```

### 5.3 生成/更新 Prisma Client

每当修改了 `schema.prisma`（或执行了 `db push` / `migrate`），都需要重新生成客户端代码，以更新 TypeScript 类型定义：

```bash
npx prisma generate
```
*注：`migrate dev` 和 `db push` 成功后通常会自动触发此命令。如果代码中报错提示找不到模型，手动执行此命令即可。*

### 5.4 可视化管理数据 (Prisma Studio)

Prisma 提供了一个内置的网页版数据库管理工具：

```bash
npx prisma studio
```
执行后会在浏览器打开一个页面（默认 `http://localhost:5555`），可以直接查看、添加、修改和删除数据库中的数据。

### 5.5 从现有数据库生成模型 (Introspection)

如果数据库中已经存在表结构，可以通过反向工程生成 Prisma 模型：

```bash
npx prisma db pull
```
然后不要忘记执行 `npx prisma generate` 更新客户端。
