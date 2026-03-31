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

复制 `.env.example` 到 `.env`，填写数据库、Redis、模型 API Key 等。

### 启动服务

```bash
# 开发模式（同时启动前端、后端、AI服务）
pnpm dev

# 或分别启动
pnpm dev:web      # 前端 (http://localhost:5173)
pnpm dev:server   # Node后端 (http://localhost:3000)
pnpm dev:ai       # Python AI服务 (http://localhost:8000)
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
```

---

## 四、Logo 关键词（用于 AI 生成 Logo）

> 您可以将以下关键词组合输入到 Midjourney、DALL·E、Leonardo.ai 等工具中：

**核心关键词**（中英文均可）：

- `智能引擎` `smart engine`
- `齿轮` `gear`
- `AI` `机器人` `robot head`
- `闪电` `lightning`（代表速度、AI驱动）
- `中枢/中台` `hub` `platform`
- `对话气泡` `chat bubble`
- `动态组件` `dynamic blocks`
- `蓝色+银色` `blue and silver`（科技感）
- `抽象几何` `abstract geometry`
- `极简主义` `minimalist`

**推荐提示词示例（英文）**：

> `A logo for "AgenticEngine", a smart business platform with AI-driven interface. Combining a gear, a chat bubble, and a lightning bolt. Modern, minimal, tech style. Blue and silver colors. Vector flat design.`

**中文提示词示例**：

> `为“智擎中台”设计Logo，智能引擎主题，融合齿轮、闪电、对话气泡元素，科技蓝+银白色，极简扁平风格，适合SaaS产品。`
