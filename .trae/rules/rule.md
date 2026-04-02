# Agentic Engine 项目规则与开发规范 (Trae IDE Rules)

本文档旨在为 AI 大模型及开发人员提供本项目 (Agentic Engine) 的架构认知与编码行为准则。在进行代码生成、重构和问题诊断时，**必须**严格遵循以下规则。

## 一、 项目背景与架构认知

1. **Monorepo 架构**：本项目采用 `pnpm` workspace 构建 Monorepo 架构。
2. **构建与任务编排系统**：项目基于 **Turborepo** (`turbo`) 管理任务。AI 助手在执行任何全局性质或多包并发任务时（如编译、检查、启动开发服务器），**必须优先使用 `turbo` 指令**（例如 `npx turbo run build` 或 `pnpm run build` 如果其代理了 turbo），并充分利用缓存机制。
3. **目录划分**：
   - `apps/*` 存放可独立运行的应用程序（如 `gateway`, `chat-web`, `admin-web`）。
   - `packages/*` 存放供应用复用的公共模块（如 `@agentic-engine/core` 核心库, `ui-kit` UI 组件库）。
3. **技术栈要求**：
   - **后端 (`apps/gateway`)**：必须使用 NestJS 框架，遵循 NestJS 的模块化（Module、Controller、Service）架构，使用 TypeScript。
   - **前端 (`apps/chat-web`, `apps/admin-web`)**：必须使用 Vue 3 (Composition API) + Vite + TypeScript。
   - **前端样式**：**所有 Web 项目必须统一使用 Tailwind CSS 结合 DaisyUI 进行样式开发。** 严禁使用内联样式（Inline Styles）或传统的冗长 CSS/SCSS 编写方式，除非是极其特殊的自定义动画或复杂样式。
   - **核心库 (`packages/core`)**：必须提供高纯度、无副作用的 TypeScript 核心逻辑（类型、Agent 构建），通过 `tsup` 编译为 CJS 与 ESM 双格式。

## 二、 编码规范与风格

1. **TypeScript 优先**：项目中所有新增代码（包含配置、脚本等条件允许时）必须使用 TypeScript 编写。要求开启 `strict` 模式，尽量避免使用 `any`，应通过泛型、接口（Interface）、类型别名（Type Alias）明确数据结构。
2. **命名规范**：
   - **文件与目录**：使用 kebab-case（如 `user-profile.component.vue`, `auth.service.ts`）。
   - **类名与接口**：使用 PascalCase（如 `AgentBuilder`, `UserData`）。
   - **变量与函数**：使用 camelCase（如 `getUserData`, `isInitialized`）。
   - **常量**：使用 UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）。
3. **前端组件规范**：
   - Vue 组件统一使用 `<script setup lang="ts">` 语法。
   - 提取可复用逻辑为 Composables (`useXxx`)。
   - UI 结构与样式应充分利用 DaisyUI 的语义化 class (如 `btn`, `card`, `input`) 以及 Tailwind 的原子类。
4. **后端 API 规范**：
   - RESTful 风格设计路由。
   - 必须在 Controller 层处理 HTTP 异常，并使用 NestJS 内置的过滤器或拦截器统一响应结构。

## 三、 代码质量与检查

1. **Lint 与格式化**：
   - 严格遵守 ESLint 和 Prettier 规则。每次提交前需确保 `pnpm run lint` 和 `pnpm run format` 执行无误。
   - AI 在生成代码时，请勿产生未使用变量、未处理 Promise 或缺少返回类型的函数。
2. **代码注释与文档**：
   - 关键的业务逻辑、复杂的算法、对外暴露的 API（特别是 `packages/core` 中的导出模块）必须包含 TSDoc/JSDoc 格式的注释。
   - 尽量保持代码的自解释性，注释应解释 "为什么" 这么做，而不是 "是什么"。

## 四、 安全规范 (Security)

1. **依赖安全**：引入新的 npm 包前，必须确保其维护活跃且无已知高危漏洞。优先使用主流且稳定的依赖。
2. **凭据与机密信息**：
   - 绝对禁止在代码中硬编码任何敏感信息（如 API Key、数据库密码、JWT Secret）。
   - 所有敏感配置必须通过环境变量（如 `.env`）读取。在使用 `.env` 文件时，必须确保其被 `.gitignore` 忽略。
3. **数据校验与防范**：
   - **后端**：使用 `class-validator` 和 `class-transformer` 对所有输入数据（DTO）进行严格校验，防止 SQL 注入或 XSS 攻击。不要信任客户端传入的任何数据。
   - **前端**：在渲染用户生成内容时，妥善处理以防范 XSS 漏洞。
4. **鉴权与授权**：接口必须进行适当的权限控制（如 JWT 验证），越权访问（水平/垂直越权）应在 Service 层或 Guard 层拦截。

## 五、 模块化与依赖管理

1. **绝对路径与别名**：在引用项目内部文件时，优先使用配置好的路径别名（如 `@/components`，`@agentic-engine/core`），避免深层嵌套的相对路径（如 `../../../../utils`）。
2. **内部库引用**：跨 package/app 引用时，必须通过 `package.json` 的 `workspace:*` 协议进行依赖声明，切勿直接引入另一个应用的相对路径源码。
3. **职责单一原则**：
   - Gateway 不应包含复杂的 UI 逻辑。
   - Web 端不应包含核心的 AI 编排逻辑，AI 构建相关的抽象模型应放置于 `packages/core` 中。

## 六、 构建与部署准备

1. **Turbo 编排优先**：
   - 所有的构建（`build`）、代码格式检查（`lint`）、启动开发环境（`dev`）等任务都已在 `turbo.json` 中定义依赖关系。
   - 当需要同时启动多个服务（例如前端应用和后端网关）进行联调时，严禁手动开启多个终端进入各自目录启动，**必须直接使用 `turbo run dev`** （或者相关的 `pnpm dev` 如果已封装）。
2. **Docker 友好**：
   - AI 在编写服务端代码时，应考虑无状态化（Stateless）设计，避免强依赖本地文件系统（日志、上传文件应外置或使用云存储）。
   - 注意应用的平滑退出（Graceful Shutdown），在收到 SIGTERM 信号时能正确关闭数据库连接等资源。

---
*AI 助手在每次回答和生成代码时，需自行对照上述规则进行核对。如果用户的请求与本规则冲突，应主动向用户指出冲突并确认是否需破例执行。*
