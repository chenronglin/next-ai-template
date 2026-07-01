# Next.js AI SaaS Starter PRD

## 1. 产品定位

构造一个面向 AI 编程助手，尤其是 Codex，友好的 **Next.js SaaS 项目模板**。目标不是做一个复杂业务系统，而是提供一个“开箱即用、结构清晰、约束明确、便于二次开发”的 SaaS 基座。

模板应覆盖 SaaS 项目的最小公共能力：营销首页、登录注册、受保护后台、我的账户、基础 CRUD 示例、AI 调用示例、统一数据校验、统一数据库访问、统一认证与会话管理。

技术基准采用 Next.js 最新 App Router 路线。Next.js 官方文档当前强调 App Router、Server/Client Components、Route Handlers、Server Functions、项目结构约定，并在 Next.js 16 中将 Middleware 文件约定改名为 Proxy。

## 2. 技术栈约束

### 2.1 固定技术栈

项目必须使用：

| 模块      | 选型                 | 说明                                                 |
| ------- | ------------------ | -------------------------------------------------- |
| 前端/全栈框架 | Next.js App Router | 使用 `src/app`，不使用 Pages Router                      |
| 运行与包管理  | Bun                | 使用 `bun install`、`bun run`、`bunx`                  |
| 数据库     | SQLite             | 本地优先，适合模板、MVP、小型单机部署                               |
| ORM/迁移  | Prisma             | Prisma 作为唯一业务数据库访问层                                |
| 认证      | Better Auth        | 支持邮箱密码登录注册，后续可扩展 OAuth                             |
| AI SDK  | Vercel AI SDK      | 用于统一接入 OpenAI、Anthropic、Google、Vercel AI Gateway 等 |
| UI      | shadcn/ui          | 基于 Tailwind CSS、Radix、可拷贝组件模式                      |
| 校验      | Zod                | 表单、Server Actions、Route Handlers、AI 输入输出统一校验       |

Next.js 官方安装文档支持用 Bun 创建项目；Bun 官方也提供 Next.js 项目创建与运行说明。Vercel 也已经支持为 Next.js 等框架配置 Bun Runtime。

### 2.2 关键修订：SQLite 驱动边界

原始需求中的“SQLite 使用 Bun 自带数据库驱动程序”和“Prisma 作为 ORM”需要调整为：

> SQLite 是数据库；Prisma 是唯一业务 ORM；Prisma SQLite 使用官方推荐的 SQLite adapter；Bun 内置 `bun:sqlite` 只允许用于可选的底层实验脚本，不进入正式业务代码。

理由：Prisma 官方 SQLite 快速开始安装的是 `@prisma/adapter-better-sqlite3`，并非 `bun:sqlite`；而 Bun 的 `bun:sqlite` 是 Bun 自己提供的 SQLite API。为了让 Codex 稳定编程，必须避免生成两套数据访问模式。

### 2.3 部署边界

该模板默认定位为：

1. 本地开发；
2. 小型 VPS / Docker / 单机持久化部署；
3. 后续可迁移到 PostgreSQL、Turso/libSQL 或 Prisma Postgres。

不建议把“本地 SQLite 文件 + 写入型 SaaS”直接部署到 Vercel Serverless Functions，因为 SQLite 需要持久化本地文件系统，而 Vercel 官方说明 serverless 环境没有可用于 SQLite 写入的中央持久化文件系统。Vercel Functions 的文件系统是只读为主，仅 `/tmp` 可写且是临时空间。

## 3. 产品目标

### 3.1 核心目标

模板交付后，开发者可以在 10 分钟内完成：

1. 启动项目；
2. 注册账户；
3. 登录后台；
4. 修改“我的资料”；
5. 创建一个示例资源；
6. 调用一次 AI Chat 或 AI 文本生成；
7. 查看 Prisma Studio；
8. 让 Codex 根据已有架构继续新增业务模块。

### 3.2 非目标

MVP 不做以下内容：

1. 不内置复杂多租户权限系统；
2. 不内置支付；
3. 不内置复杂后台管理系统；
4. 不内置多模型计费系统；
5. 不内置企业级审计日志；
6. 不同时支持 Drizzle、Auth.js、tRPC 等替代方案。

## 4. 信息架构与页面设计

### 4.1 路由分组

建议使用以下 App Router 结构：

```txt
src/app/
  (marketing)/
    page.tsx
    pricing/page.tsx
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
    forgot-password/page.tsx
  (app)/
    dashboard/page.tsx
    me/page.tsx
    settings/page.tsx
    ai/page.tsx
    examples/notes/page.tsx
  api/
    auth/[...all]/route.ts
    ai/chat/route.ts
```

Next.js 官方建议基于文件系统约定组织项目，Route Handlers 只在 `app` 目录内可用，适合作为自定义请求处理入口。

### 4.2 首页 `/`

首页面向模板使用者和未来 SaaS 用户，包含：

1. 顶部导航：Logo、Features、Pricing、Docs、Sign in、Get started；
2. Hero 区：一句话说明“AI-ready SaaS starter built with Next.js + Bun + Prisma + Better Auth”；
3. 技术栈卡片：Next.js、Bun、SQLite、Prisma、Better Auth、AI SDK、shadcn、Zod；
4. 功能区：认证、受保护后台、AI 调用、CRUD 示例、Codex-friendly 结构；
5. CTA：注册 / 查看后台 Demo；
6. 页脚：GitHub、Docs、License、版本信息。

### 4.3 注册页 `/sign-up`

注册页包含：

1. 邮箱输入；
2. 密码输入；
3. 确认密码；
4. 用户名或显示名称；
5. 服务条款勾选；
6. 注册按钮；
7. 跳转登录链接。

校验规则统一使用 Zod：邮箱格式、密码长度、确认密码一致、terms 必选。Zod 官方定位是 TypeScript-first schema validation，可从 schema 同时获得运行时校验与类型推断。

### 4.4 登录页 `/sign-in`

登录页包含：

1. 邮箱；
2. 密码；
3. 记住我；
4. 登录按钮；
5. 忘记密码；
6. 跳转注册；
7. 预留 OAuth 登录按钮区域。

Better Auth 支持内置邮箱密码认证，Next.js 集成文档也说明 Better Auth 可与 Next.js 16 兼容，并使用 Proxy 保护路由。

### 4.5 后台首页 `/dashboard`

登录后默认进入后台首页，包含：

1. 欢迎语；
2. 当前用户信息摘要；
3. 项目模板状态卡片；
4. 最近创建的 Note / Todo 示例资源；
5. AI 调用入口；
6. 快速链接：我的、设置、数据库示例、AI 示例。

页面默认是 Server Component；只有需要交互的按钮、弹窗、表单、AI streaming UI 才使用 Client Component。Next.js 官方说明 layouts 和 pages 默认是 Server Components，只有需要交互或浏览器 API 时才使用 Client Components。

### 4.6 我的页面 `/me`

“我的”页面是 SaaS 模板必须有的基础页面，包含：

1. 头像；
2. 显示名称；
3. 邮箱；
4. 账户创建时间；
5. 修改个人资料；
6. 修改密码入口；
7. 当前登录会话；
8. 退出登录。

该页面用于验证：认证、会话、受保护路由、表单提交、Zod 校验、Prisma 更新的完整链路。

### 4.7 设置页 `/settings`

设置页包含：

1. 主题设置：系统 / 浅色 / 深色；
2. 默认 AI 模型设置；
3. 默认语言；
4. 通知偏好；
5. 危险区：删除账户，MVP 可只做 UI 占位。

### 4.8 AI 示例页 `/ai`

AI 示例页用于展示 Vercel AI SDK 的标准集成能力：

1. Prompt 输入框；
2. 模型选择；
3. Streaming 输出区域；
4. 生成历史；
5. 错误提示；
6. 清空会话；
7. 保存对话。

Vercel AI SDK 官方文档提供 Next.js App Router 入门方式，并支持 `generateText` 与 `streamText` 等文本生成和流式生成能力。Vercel 官方也说明 AI SDK 是统一的 TypeScript AI 工具包，支持流式、结构化输出、工具调用和多框架集成。

### 4.9 示例 CRUD 页 `/examples/notes`

该页面用于让 Codex 学会本项目的业务开发范式。功能包含：

1. Note 列表；
2. 新建 Note；
3. 编辑 Note；
4. 删除 Note；
5. 搜索；
6. 空状态；
7. 加载状态；
8. 错误状态。

所有写操作必须使用 Zod schema 校验，数据访问必须通过 Prisma，页面交互使用 shadcn/ui 组件。

## 5. 数据模型

### 5.1 认证模型

Better Auth 相关表由 Better Auth CLI 生成，核心包括：

1. User；
2. Session；
3. Account；
4. Verification。

Better Auth Prisma adapter 文档说明其 CLI 支持生成 Prisma schema，但 Prisma migration 不由 Better Auth CLI 直接完成；推荐流程是生成 schema 后交给 Prisma migrate 管理。

### 5.2 业务模型

MVP 业务模型建议：

```txt
UserPreference
- id
- userId
- theme
- defaultModel
- language
- createdAt
- updatedAt

Note
- id
- userId
- title
- content
- createdAt
- updatedAt

AiConversation
- id
- userId
- title
- model
- createdAt
- updatedAt

AiMessage
- id
- conversationId
- role
- content
- tokenCount
- createdAt
```

为了减少 SQLite 与 enum 的边界问题，角色、主题、模型等字段可以先用 `String` 存储，再用 Zod 和 TypeScript 常量约束。Prisma SQLite 文档也提示 SQLite 不在数据库层强制 enum 值，非法值会在 Prisma Client 查询时失败。

## 6. 代码结构

推荐结构：

```txt
src/
  app/
  components/
    ui/
    layout/
    auth/
    forms/
    ai/
  features/
    notes/
      actions.ts
      schema.ts
      queries.ts
      components/
    profile/
      actions.ts
      schema.ts
      queries.ts
    ai/
      schema.ts
      service.ts
  lib/
    auth.ts
    auth-client.ts
    db.ts
    env.ts
    routes.ts
    utils.ts
  server/
    require-user.ts
    action-result.ts
  generated/
    prisma/
prisma/
  schema.prisma
  seed.ts
  dev.db
AGENTS.md
skills/
  next-saas-template/
    SKILL.md
  prisma-better-auth/
    SKILL.md
  ai-sdk-next/
    SKILL.md
```

结构原则：

1. `app/` 只放路由、布局、页面；
2. `components/ui/` 只放 shadcn 组件；
3. `features/*` 放业务模块；
4. `lib/db.ts` 是唯一 Prisma Client 出口；
5. `lib/auth.ts` 是唯一 Better Auth 服务端配置出口；
6. `lib/auth-client.ts` 是唯一前端 auth client 出口；
7. Server-only 逻辑不得从 Client Component 引入；
8. 所有业务写操作必须通过 `actions.ts` 或 `route.ts`；
9. 所有输入必须先过 `schema.ts`。

## 7. 认证与权限

### 7.1 认证方式

MVP 支持：

1. 邮箱密码注册；
2. 邮箱密码登录；
3. 退出登录；
4. 读取当前用户；
5. 保护后台路由；
6. 修改基础资料。

P1 扩展：

1. Google OAuth；
2. GitHub OAuth；
3. 邮箱验证；
4. 重置密码；
5. 多 Session 管理。

### 7.2 路由保护

使用 `src/proxy.ts` 保护：

```txt
/dashboard
/me
/settings
/ai
/examples/*
```

Next.js 16 起 Middleware 文件约定更名为 Proxy；Better Auth 的 Next.js 集成文档也针对 Next.js 16 提供 Proxy 兼容说明。

## 8. AI 服务设计

### 8.1 AI SDK 封装

统一在 `features/ai/service.ts` 封装：

1. `generateTextOnce()`；
2. `streamChat()`；
3. `saveConversation()`；
4. `estimateTokenUsage()`；
5. `getAvailableModels()`。

MVP 默认支持一种 provider，例如 Vercel AI Gateway 或 OpenAI。AI SDK 本身是 provider-agnostic，可通过统一 API 接入不同模型。

### 8.2 AI Route Handler

AI streaming 使用：

```txt
src/app/api/ai/chat/route.ts
```

原因：AI streaming 更适合 Route Handler，而普通表单增删改更适合 Server Functions / Server Actions。Next.js Route Handlers 使用标准 Web Request/Response API，适合自定义 API 入口。

## 9. UI 规范

使用 shadcn/ui：

1. Button；
2. Card；
3. Input；
4. Label；
5. Form；
6. Dialog；
7. Dropdown Menu；
8. Avatar；
9. Table；
10. Skeleton；
11. Toast / Sonner；
12. Tabs；
13. Textarea。

shadcn/ui 官方提供 Next.js 安装路径，并要求配置 Tailwind CSS 和 `@/*` import alias。

页面视觉风格：

1. 默认现代 SaaS 风格；
2. 首页偏营销；
3. 后台偏工具型；
4. 保持低装饰、高可读；
5. 所有页面提供空状态、加载状态、错误状态。

## 10. 数据校验规范

统一使用 Zod 定义 schema：

```txt
features/notes/schema.ts
features/profile/schema.ts
features/ai/schema.ts
lib/env.ts
```

校验范围：

1. 环境变量；
2. 表单输入；
3. Server Action 输入；
4. Route Handler 请求体；
5. AI 输出结构；
6. URL query 参数。

Zod schema 是运行时校验的唯一事实源，TypeScript 类型通过 `z.infer` 推导，避免重复定义类型。

## 11. Codex 编程约束

为了便于 Codex 稳定生成代码，项目必须内置 `AGENTS.md` 和 Skills。

### 11.1 AGENTS.md 要求

`AGENTS.md` 必须写明：

1. 使用 Bun，不使用 npm/pnpm/yarn；
2. 使用 App Router，不使用 Pages Router；
3. 默认 Server Component；
4. Client Component 必须有明确交互理由；
5. 数据访问只能通过 Prisma；
6. 不允许直接使用 `bun:sqlite` 写业务逻辑；
7. 认证只能通过 Better Auth；
8. UI 优先使用 shadcn/ui；
9. 表单和 API 输入必须用 Zod；
10. 新业务模块必须放入 `features/<module>`；
11. 修改数据库必须更新 Prisma schema、migration、seed；
12. 完成后必须运行类型检查、lint、测试。

Next.js 官方 AI Coding Agents 文档说明，Next.js 包内已经包含版本匹配的 Markdown 文档，`AGENTS.md` 可以指示 agent 读取本地 `node_modules/next/dist/docs/`，避免使用过时训练数据。

### 11.2 推荐官方 Skills

建议安装：

1. `next-best-practices`：Next.js 文件约定、RSC 边界、数据模式；
2. `next-cache-components`：仅在启用 Cache Components 时使用；
3. `vercel/ai`：AI SDK 使用规范；
4. `next-dev-loop`：用于开发循环、错误修复、验证反馈。

Vercel Skills 文档列出了 Next.js best practices、Next.js 16 Cache Components 等技能；AI SDK 官方也提供 `npx skills add vercel/ai` 的安装方式。

### 11.3 推荐自定义 Skills

建议项目内自带 5 个自定义 Skills：

#### Skill 1：`next-saas-template`

用途：新增页面、布局、业务模块时调用。

包含规则：

1. 路由分组规范；
2. Server/Client Component 边界；
3. 页面状态规范；
4. shadcn 使用规范；
5. feature-first 目录规范。

#### Skill 2：`prisma-better-auth`

用途：涉及用户、会话、数据库模型、迁移时调用。

包含规则：

1. Prisma 是唯一 ORM；
2. Better Auth 表由 CLI 生成；
3. Prisma migration 统一管理；
4. 不用 bun:sqlite 写业务；
5. SQLite 字段类型约束；
6. seed 数据规范。

#### Skill 3：`zod-server-actions`

用途：新增表单、Server Action、CRUD 时调用。

包含规则：

1. schema 先行；
2. 所有 mutation 统一返回 `ActionResult<T>`；
3. 错误信息可展示；
4. 不在 Client Component 里直接访问 Prisma；
5. 乐观更新可选，默认不用。

#### Skill 4：`ai-sdk-next`

用途：新增 AI 功能时调用。

包含规则：

1. Streaming 走 Route Handler；
2. 普通生成可封装 server function；
3. prompt 输入必须校验；
4. AI 输出结构化时使用 schema；
5. 保存 conversation/message；
6. 处理 provider error、rate limit、timeout。

#### Skill 5：`shadcn-product-ui`

用途：新增页面 UI 时调用。

包含规则：

1. 优先使用 shadcn/ui；
2. 页面必须有 loading、empty、error 状态；
3. 表单必须有 label、description、message；
4. 后台页面统一 AppShell；
5. 不直接写大段裸 Tailwind，优先抽组件。

## 12. 开发命令

`package.json` 建议：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "bun prisma/seed.ts",
    "test": "bun test"
  }
}
```

## 13. MVP 验收标准

模板完成后，必须满足：

1. `bun install` 成功；
2. `bun run dev` 成功；
3. 首页可访问；
4. 注册成功；
5. 登录成功；
6. 未登录访问 `/dashboard` 会跳转登录；
7. 登录后访问 `/dashboard` 正常；
8. `/me` 可修改用户资料；
9. `/examples/notes` 可完成增删改查；
10. `/ai` 可完成一次 streaming AI 输出；
11. Prisma Studio 可打开；
12. 所有表单输入均经过 Zod；
13. 业务代码无直接 `bun:sqlite`；
14. `bun run typecheck` 通过；
15. `bun run lint` 通过；
16. `bun test` 通过；
17. Codex 根据 `AGENTS.md` 能新增一个类似 Notes 的模块。

## 14. 版本策略

模板不锁定具体 minor 版本，使用：

```txt
next@latest
react@latest
react-dom@latest
prisma@latest
@prisma/client@latest
better-auth@latest
ai@latest
zod@latest
```

但每次升级后必须：

1. 重新运行 `bun install`；
2. 重新生成 Prisma Client；
3. 重新跑迁移；
4. 重新验证 Better Auth；
5. 重新验证 AI streaming；
6. 重新检查 AGENTS.md 是否仍指向当前 Next.js docs。

## 15. 后续扩展路线

### P1：SaaS 基础增强

1. Workspace；
2. Team Member；
3. Role；
4. Invitation；
5. API Key；
6. Usage Limit；
7. AI 调用额度统计。

### P2：商业化增强

1. Stripe / Lemon Squeezy 支付；
2. Plan；
3. Subscription；
4. Billing Portal；
5. 用量计费；
6. 发票入口。

### P3：生产部署增强

1. PostgreSQL 版本；
2. Turso/libSQL 版本；
3. Dockerfile；
4. VPS 部署文档；
5. Vercel Serverless 兼容版；
6. CI/CD；
7. 错误监控；
8. 日志系统。

## 16. 最终结论

这个模板的核心不是“堆技术栈”，而是给 Codex 一个高度确定的工程边界：

1. Next.js 负责全栈框架；
2. Bun 负责运行和工具链；
3. Prisma 负责数据库；
4. Better Auth 负责认证；
5. AI SDK 负责模型调用；
6. shadcn/ui 负责 UI；
7. Zod 负责所有输入输出校验；
8. AGENTS.md + Skills 负责约束 AI 编程行为。

最重要的一条工程原则是：**所有关键能力只保留一条主路径，不给 Codex 留多个等价选择。**

