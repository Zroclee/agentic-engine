# 智擎中台 · AgenticEngine

> **AI驱动万物 · Agentic as a Service**

智擎中台是一个面向企业级业务场景的**智能体中台**，基于 **Agentic as a Service (AaaS)** 理念，帮助客户零代码/低代码地将现有业务系统快速AI化。通过配置模型、提示词、工具（业务接口）和动态组件，即可生成一个**左侧对话、右侧业务组件实时联动**的智能应用，并在对话过程中**实时对比组件数据与AI分析结果**，支持即时调整方向，最终输出结构化业务报告。

## ✨ 核心特性

- **AaaS 架构**：遵循黄仁勋提出的 Agentic as a Service 范式，让智能体成为可配置的服务。
- **AI驱动页面**：对话流与业务组件双向绑定，AI根据上下文自动调用工具、更新组件数据。
- **配置化接入**：无需编码，通过可视化界面配置模型、提示词、工具（HTTP API）和远程组件。
- **实时对比**：右侧组件内用户调整数据，AI即时分析差异并给出建议，辅助决策。
- **动态组件**：支持 Vue 3、React 或原生 Web Components 远程加载，安全隔离。
- **多模型支持**：可接入 OpenAI、Azure、本地 Llama 等任意大模型。
- **报告生成**：基于对话历史和组件数据，自动生成 Markdown/PDF 业务报告。

## 🧱 架构概览

```
┌─────────────────────────────────────────────────────┐
│                   前端工作台 (Vue 3)                  │
│  左侧聊天区  │  右侧动态组件容器（远程组件加载）        │
└─────────────────────────────────────────────────────┘
                           │ WebSocket + REST
┌─────────────────────────────────────────────────────┐
│           后端服务 (NestJS) + AI服务 (Python)         │
│   配置管理 │ 工具执行器 │ 会话管理 │ 模型调用 │ 报告生成 │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│          客户业务系统（现有 API / 数据库）             │
└─────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- pnpm

### 克隆与安装

```bash
git clone https://github.com/your-org/agentic-engine.git
cd agentic-engine
pnpm install
```

### 配置环境变量

复制 `.env.example` 到 `.env`（或在 `apps/gateway` 等目录下创建 `.env`），填写相关的环境变量。近期网关服务（gateway）新增了登录鉴权和 Prisma 数据库模块，需确保以下关键变量已配置：

```env
# 数据库配置 (PostgreSQL 连接字符串，供 Prisma 使用)
DATABASE_URL="postgresql://user:password@localhost:5432/agentic_engine?schema=public"

# JWT 鉴权密钥 (用于签发和验证登录 Token)
JWT_SECRET="your-super-secret-jwt-key"

# 服务端口 (可选，默认 3000)
PORT=3000

# Redis、模型 API Key 等其他配置...
```

### 数据库初始化

网关服务 (gateway) 已接入 Prisma ORM。在首次启动服务前，请确保 PostgreSQL 数据库已启动，并执行以下命令同步数据库结构、生成 Client 以及初始化默认账号数据：

```bash
cd apps/gateway
npx prisma generate
npx prisma migrate dev  # 执行数据库迁移并自动运行 seed 脚本
# 如果需要重置数据库和重新填充数据，可运行：
# npx prisma migrate reset --force
cd ../..
```

**默认初始账号信息**
- 用户名：`admin`
- 密码：`123456`

### 启动服务

项目基于 Turborepo 进行任务编排，您可以通过以下命令快速启动：

```bash
# 开发模式（自动编排并启动所有前端、后端相关服务）
pnpm dev

# 或分别单独启动各个子应用
pnpm web         # 启动前端应用
pnpm gateway     # 启动后端网关服务 (http://localhost:3000)
# pnpm dev:ai    # Python AI服务 (http://localhost:8000)
```

### 使用 Docker Compose（推荐）

```bash
docker-compose up -d
```

访问 `http://localhost:5173` 开始体验。

## 📖 文档

- [用户手册](./docs/user-guide.md)
- [API 文档](http://localhost:3000/api)（启动后自动生成 Swagger）
- [组件开发指南](./docs/component-dev.md)
- [部署指南](./docs/deployment.md)

## 🧩 示例场景

- **智能客服中台**：接入工单系统 API，右侧展示客户信息及历史工单，AI 辅助生成解决方案。
- **销售助手**：对接 CRM，右侧显示客户画像与商机看板，AI 分析销售漏斗并推荐下一步动作。
- **数据分析报告**：连接数据库，右侧展示数据筛选器，AI 自动生成分析报告。

## 🛠️ 技术栈

| 领域 | 技术 |
|------|------|
| 前端 | Vue 3, TypeScript, Vite, Pinia, Web Components |
| 后端 | NestJS, Prisma, Redis, WebSocket |
| AI | FastAPI, LangChain, LlamaIndex, Celery |
| 数据库 | PostgreSQL |
| 基础设施 | Docker, Kubernetes, Turborepo |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。请先阅读 [贡献指南](./CONTRIBUTING.md)。

## 📄 许可证

MIT © [智擎团队]

## 🌟 致谢

灵感来源于黄仁勋先生提出的 **Agentic as a Service** 以及 AI 驱动万物的愿景。