# Next AI SaaS Starter

一个面向 AI SaaS 产品的 Next.js 16 启动模板，已集成 App Router、Bun、SQLite、Prisma 7、Better Auth、Vercel AI SDK、shadcn/ui、Zod、多语言和基础后台模块。

## 项目定位

这个仓库不是空白脚手架，而是一个可直接运行、可继续扩展的 SaaS 模板。当前代码已经包含营销页、认证页、受保护后台、用户资料、偏好设置、Notes CRUD 示例、AI streaming 示例和中英文路由。

适合用于：

- 快速启动一个带账号体系的 AI 产品原型。
- 作为 Codex 继续扩展业务模块的基础工程。
- 参考模板内置的 `schema.ts`、`queries.ts`、`actions.ts`、`components/` 组织方式新增功能。

## 当前能力

- **Next.js App Router**：路由全部位于 `src/app`，未使用 Pages Router。
- **默认 Server Component**：页面和 layout 默认运行在服务端，只有表单、主题切换、AI streaming 等交互组件使用 Client Component。
- **多语言路由**：内置 `zh-CN` 和 `en-US`，根路径会根据 cookie 或 `Accept-Language` 重定向。
- **Better Auth 认证**：支持邮箱密码注册登录、邮箱验证、重置密码、修改密码、退出登录、删除账户邮件确认，以及 GitHub/Google OAuth 的可选接入。
- **Prisma 7 + SQLite**：业务数据通过 Prisma Client 访问，默认使用项目根目录的 SQLite 文件。
- **受保护后台**：`/dashboard`、`/me`、`/settings`、`/examples/notes`、`/ai` 都需要登录。
- **Notes CRUD 示例**：展示 Zod 校验、Server Action、Prisma 查询和 shadcn/ui 表格的完整链路。
- **AI streaming 示例**：通过 Vercel AI SDK Gateway 输出流式文本，并保存生成历史；未配置 AI Key 时使用本地 mock stream。
- **shadcn/ui**：UI 组件集中在 `src/components/ui`。
- **Codex 项目规则**：根目录 `AGENTS.md` 和 `.agents/skills/` 约束后续开发方式。

## 技术栈

| 类别 | 当前选择 |
| --- | --- |
| 框架 | Next.js `16.2.9`、React `19.2.4` |
| 包管理和命令入口 | Bun |
| 数据库 | SQLite |
| ORM | Prisma `7.8.0`，生成物输出到 `src/generated/prisma` |
| 认证 | Better Auth `1.6.23` |
| AI | Vercel AI SDK `ai`、`@ai-sdk/react` |
| UI | shadcn/ui、Radix UI、Tailwind CSS 4、lucide-react |
| 校验 | Zod 4 |
| 邮件 | Resend，可选但生产认证流程需要配置 |
| 测试 | Bun test |

## 环境要求

请先确保本机已经安装：

- Bun，用于安装依赖和执行项目脚本。
- Node.js，用于实际运行 Next.js、Prisma seed 等脚本入口。项目脚本仍通过 `bun run` 调用，只是在内部显式走 Node runtime。

不要把业务数据库访问改成 `bun:sqlite`、`better-sqlite3` 直连或原始 SQLite 连接。项目约定是：业务代码只能通过 `src/lib/db.ts` 导出的 Prisma Client 访问数据库。

## 快速开始

1. 安装依赖：

```bash
bun install
```

2. 复制环境变量文件：

```bash
cp .env.example .env
```

3. 至少手动修改 `.env` 里的 `BETTER_AUTH_SECRET`。

本地开发可以继续使用默认的 `DATABASE_URL`、`BETTER_AUTH_URL` 和 `NEXT_PUBLIC_APP_URL`。生产环境必须完整配置本文后面的“需要人工配置的环境变量”。

4. 生成 Prisma Client：

```bash
bun run db:generate
```

5. 创建或更新本地数据库：

```bash
bun run db:migrate -- --name init
```

如果迁移已经存在，Prisma 会按当前数据库状态执行需要的迁移。

6. 启动开发服务器：

```bash
bun run dev
```

7. 打开应用：

```txt
http://localhost:3000
```

根路径会自动跳转到 `/zh-CN` 或 `/en-US`。默认语言是简体中文。

## 本地首次登录流程

本项目开启了邮箱验证，所以注册后不会直接进入后台。

1. 打开 `/zh-CN/sign-up` 创建账号。
2. 如果没有配置 `RESEND_API_KEY`，终端会输出类似 `[auth-email] ... url=...` 的开发提示。
3. 复制终端里的验证链接并在浏览器打开，完成邮箱验证。
4. 验证完成后登录，然后访问 `/zh-CN/dashboard`。

如果配置了 Resend，验证邮件会发送到注册邮箱。

## 需要人工配置的环境变量

所有服务端环境变量统一在 `src/lib/env.ts` 校验。请以 `.env.example` 为模板创建 `.env`，不要把真实密钥提交到 Git。

| 变量 | 本地是否必填 | 生产是否必填 | 谁来配置 | 说明 |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | 是，可用默认值 | 是 | 开发者或运维 | SQLite 连接地址。默认 `file:./dev.db` 表示项目根目录的 `dev.db`。生产如果继续使用 SQLite，需要挂载持久化磁盘；如果改成其他数据库，必须同步修改 Prisma schema、driver adapter 和数据库访问代码。 |
| `BETTER_AUTH_SECRET` | 是 | 是 | 人工生成 | Better Auth 加密密钥，至少 32 个字符。生产环境不能使用示例值。推荐执行 `bunx @better-auth/cli secret` 或使用其他安全随机密钥生成器。 |
| `BETTER_AUTH_URL` | 是 | 是 | 部署负责人 | Better Auth 的服务端基准地址。本地为 `http://localhost:3000`，生产应填写真实站点 origin，例如 `https://app.example.com`。 |
| `NEXT_PUBLIC_APP_URL` | 是 | 是 | 部署负责人 | 浏览器侧可见的应用地址，也会进入 Better Auth `trustedOrigins`。通常与 `BETTER_AUTH_URL` 相同。 |
| `AI_GATEWAY_API_KEY` | 否 | 需要真实 AI 时必填 | 产品或平台负责人 | Vercel AI Gateway API Key。不配置时 `/ai` 页面使用本地演示流，仍会保存生成历史，但不会调用真实模型。 |
| `RESEND_API_KEY` | 否 | 认证邮件可用时必填 | 产品或运维 | Resend API Key。生产环境没有这个值时，邮箱验证、重置密码、删除账户确认邮件无法发送，代码会直接报错。 |
| `RESEND_FROM_EMAIL` | 否，有默认值 | 是 | 产品或运维 | 发件人邮箱。默认 `onboarding@resend.dev` 只适合本地或演示，生产应使用已在 Resend 验证的域名邮箱。 |
| `GITHUB_CLIENT_ID` | 否 | 启用 GitHub 登录时必填 | 负责 OAuth 的开发者 | GitHub OAuth App 的 Client ID。为空时 GitHub 登录按钮会显示为不可用状态。 |
| `GITHUB_CLIENT_SECRET` | 否 | 启用 GitHub 登录时必填 | 负责 OAuth 的开发者 | GitHub OAuth App 的 Client Secret。必须和 Client ID 同时配置才会注册 provider。 |
| `GOOGLE_CLIENT_ID` | 否 | 启用 Google 登录时必填 | 负责 OAuth 的开发者 | Google OAuth Client ID。为空时 Google 登录按钮会显示为不可用状态。 |
| `GOOGLE_CLIENT_SECRET` | 否 | 启用 Google 登录时必填 | 负责 OAuth 的开发者 | Google OAuth Client Secret。必须和 Client ID 同时配置才会注册 provider。 |

### 本地 `.env` 最小示例

```txt
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="请替换为至少 32 个字符的随机密钥"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AI_GATEWAY_API_KEY=""
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## 第三方服务配置说明

### Better Auth

必须人工设置：

- `BETTER_AUTH_SECRET`：生产必须是高强度随机值。
- `BETTER_AUTH_URL`：必须是当前部署的真实 origin。
- `NEXT_PUBLIC_APP_URL`：必须是浏览器访问的真实 origin。

当前服务端配置位于 `src/lib/auth.ts`。认证路由位于 `src/app/api/auth/[...all]/route.ts`，客户端唯一入口是 `src/lib/auth-client.ts`。

### Resend 邮件

本地不配置 `RESEND_API_KEY` 时，系统不会真正发送邮件，而是在终端输出验证、重置密码或删除账户确认链接。

生产需要人工完成：

- 在 Resend 创建 API Key，填入 `RESEND_API_KEY`。
- 验证发信域名。
- 把 `RESEND_FROM_EMAIL` 改成已验证域名下的邮箱。

认证相关邮件模板位于 `src/features/auth/email-templates.ts`。

### GitHub OAuth

启用 GitHub 登录时，需要在 GitHub OAuth App 中设置：

```txt
Homepage URL: <NEXT_PUBLIC_APP_URL>
Authorization callback URL: <BETTER_AUTH_URL>/api/auth/callback/github
```

然后把 GitHub 提供的值写入：

```txt
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Google OAuth

启用 Google 登录时，需要在 Google Cloud Console 创建 OAuth Client，并设置授权重定向 URI：

```txt
<BETTER_AUTH_URL>/api/auth/callback/google
```

然后把 Google 提供的值写入：

```txt
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Vercel AI Gateway

`src/features/ai/service.ts` 使用 `gateway(input.model)`，AI SDK 会读取 `AI_GATEWAY_API_KEY`。

当前内置模型值在 `src/lib/constants.ts`：

```txt
openai/gpt-4o-mini
openai/gpt-4.1-mini
anthropic/claude-3-5-haiku
```

需要真实模型输出时，请人工完成：

- 在 Vercel AI Gateway 创建或获取 API Key。
- 确认账号或项目有对应模型的调用权限和预算。
- 在部署平台设置 `AI_GATEWAY_API_KEY`。

未设置 `AI_GATEWAY_API_KEY` 时，`/ai` 会返回本地 mock stream，便于无第三方密钥时继续开发 UI 和历史保存逻辑。

## 常用路由

| 路由 | 说明 |
| --- | --- |
| `/` | 根据语言 cookie 或浏览器语言重定向到 locale 路由。 |
| `/zh-CN`、`/en-US` | 营销首页。 |
| `/zh-CN/pricing`、`/en-US/pricing` | 价格占位页，当前未接入支付。 |
| `/zh-CN/docs`、`/en-US/docs` | 项目文档摘要页。 |
| `/zh-CN/sign-up` | 注册页。 |
| `/zh-CN/sign-in` | 登录页。 |
| `/zh-CN/forgot-password` | 忘记密码页。 |
| `/zh-CN/reset-password` | 重置密码页。 |
| `/zh-CN/dashboard` | 登录后的后台概览。 |
| `/zh-CN/me` | 用户资料和修改密码。 |
| `/zh-CN/settings` | 主题、默认 AI 模型、语言、通知偏好和删除账户。 |
| `/zh-CN/examples/notes` | Notes CRUD 示例。 |
| `/zh-CN/ai` | AI streaming 示例和生成历史。 |
| `/api/auth/[...all]` | Better Auth API。 |
| `/api/ai/chat` | AI streaming Route Handler。 |

受保护页面会先经过 `src/proxy.ts` 做轻量 cookie 预检，真正的 session 校验在 `src/server/require-user.ts` 和受保护 layout 内完成。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `bun install` | 安装依赖。 |
| `bun run dev` | 启动开发服务器。 |
| `bun run build` | 构建生产产物。 |
| `bun run start` | 启动生产服务器，需要先执行 build。 |
| `bun run lint` | 运行 ESLint。 |
| `bun run typecheck` | 运行 TypeScript 类型检查。 |
| `bun test` | 运行 Bun 测试。当前测试位于 `tests/schemas.test.ts`。 |
| `bun run db:generate` | 根据 Prisma schema 生成 Prisma Client。 |
| `bun run db:migrate -- --name <name>` | 生成并执行数据库迁移。 |
| `bun run db:seed` | 执行 seed 脚本。当前只做连通性检查，不创建认证用户。 |
| `bun run db:studio` | 打开 Prisma Studio。 |

注意：因为 `@prisma/adapter-better-sqlite3` 依赖原生模块，数据库相关脚本会通过 `bun run` 入口调用 Node runtime。不要把这些命令改成直接由 Bun runtime 加载应用数据库代码。

## 数据库说明

Prisma schema 位于 `prisma/schema.prisma`。当前模型包括：

- `user`、`session`、`account`、`verification`：Better Auth 使用的认证模型。
- `userPreference`：用户主题、默认 AI 模型、语言和通知偏好。
- `note`：Notes CRUD 示例数据。
- `aiConversation`、`aiMessage`：AI prompt、模型选择和输出历史。

Prisma 7 的连接 URL 位于 `prisma.config.ts`，不是写在 `schema.prisma` 的 datasource 里。默认本地数据库是项目根目录的 `dev.db`，因为 Prisma config 会从项目根目录解析 `DATABASE_URL`。

修改数据库时，请按顺序执行：

```bash
bun run db:migrate -- --name <migration-name>
bun run db:generate
bun run typecheck
```

如果新增业务代码依赖新表或新字段，还应补充相关查询、Server Action 和 schema 测试。

## 项目结构

```txt
.agents/skills/              Codex 项目技能，后续开发约束放在这里
prisma/                      Prisma schema、migration 和 seed
public/                      静态资源
src/app/                     Next.js App Router 路由
src/components/auth/         跨页面认证组件
src/components/i18n/         语言切换组件
src/components/layout/       营销页和后台布局组件
src/components/ui/           shadcn/ui 组件
src/features/ai/             AI schema、service、queries 和 UI
src/features/auth/           认证表单、OAuth 状态和邮件模板
src/features/notes/          Notes CRUD 示例模块
src/features/profile/        个人资料和修改密码
src/features/settings/       用户偏好和删除账户
src/generated/prisma/        Prisma 7 生成物
src/i18n/                    locale 配置、字典和文档语言同步
src/lib/                     env、auth、db、email、常量和通用工具
src/server/                  Server Action 返回结构和登录态读取
tests/                       Bun 测试
```

## 新增业务模块约定

新增模块请放在 `src/features/<module>`，并优先沿用以下结构：

```txt
src/features/<module>/
  schema.ts                  Zod schema 和类型
  queries.ts                 只读数据库查询
  actions.ts                 Server Actions 和写操作
  components/                该模块专属 UI
```

开发时请遵守：

- 页面和 layout 默认写 Server Component。
- 只有表单、主题切换、AI streaming UI 等明确交互才写 Client Component。
- 表单、Server Action、Route Handler 输入必须先经过 Zod 校验。
- 数据库访问只能通过 `src/lib/db.ts` 的 Prisma Client。
- 认证只能通过 `src/lib/auth.ts` 和 `src/lib/auth-client.ts`。
- UI 优先复用 `src/components/ui` 下的 shadcn/ui 组件。
- 新增文案需要同步更新 `src/i18n/messages/zh-CN.ts` 和 `src/i18n/messages/en-US.ts`。
- 新增 locale 时需要同步更新 `src/i18n/config.ts`、字典文件、路由链接和语言切换逻辑。
- 修改数据库必须更新 `prisma/schema.prisma`、生成 migration，并重新生成 Prisma Client。

## 多语言说明

当前语言配置在 `src/i18n/config.ts`：

```txt
默认语言: zh-CN
可用语言: zh-CN, en-US
语言 cookie: NEXT_LOCALE
```

`src/proxy.ts` 会处理没有 locale 的路径，把用户重定向到偏好的语言路径。内部链接应使用 `localizeHref` 或相关 helper，避免手写 `/zh-CN/...` 破坏语言切换。

## 生产部署前检查清单

部署前请人工确认：

- `BETTER_AUTH_SECRET` 已替换为高强度随机值。
- `BETTER_AUTH_URL` 是生产真实 origin。
- `NEXT_PUBLIC_APP_URL` 是浏览器访问的生产真实 origin。
- `DATABASE_URL` 指向生产可持久化的 SQLite 文件路径，或已经完成数据库类型和 adapter 改造。
- 已在部署平台设置所有需要的环境变量，不依赖本地 `.env`。
- Resend 已配置 API Key、验证发信域名，并设置生产 `RESEND_FROM_EMAIL`。
- 如果启用 GitHub 登录，GitHub OAuth 回调地址是 `<BETTER_AUTH_URL>/api/auth/callback/github`。
- 如果启用 Google 登录，Google OAuth 回调地址是 `<BETTER_AUTH_URL>/api/auth/callback/google`。
- 如果需要真实 AI 输出，已配置 `AI_GATEWAY_API_KEY`，并确认模型权限和预算。
- 已执行数据库迁移和 Prisma Client 生成。
- 已运行质量检查：

```bash
bun run typecheck
bun run lint
bun test
bun run build
```

## 常见问题

### 注册成功后无法登录

邮箱验证是必需流程。未配置 Resend 时，请查看 `bun run dev` 的终端输出，找到 `[auth-email]` 日志里的 `url=` 链接并打开。

### OAuth 按钮不可用

GitHub 或 Google 的 Client ID、Client Secret 没有成对配置。两者都存在时，`src/features/auth/oauth.ts` 才会注册对应 provider。

### AI 页面只返回演示内容

`AI_GATEWAY_API_KEY` 为空时会走本地 mock stream。配置 Vercel AI Gateway Key 后，`/api/ai/chat` 才会调用真实模型。

### 生产环境无法发送认证邮件

生产环境没有 `RESEND_API_KEY` 时，`src/lib/email.ts` 会抛错。请配置 Resend API Key 和已验证的发件邮箱。

### Prisma 找不到数据库或迁移失败

先确认 `.env` 中的 `DATABASE_URL`。本项目使用 Prisma 7，连接地址由 `prisma.config.ts` 读取，默认相对项目根目录解析。

### 修改 schema 后类型仍旧不对

执行：

```bash
bun run db:generate
bun run typecheck
```

Prisma Client 生成物在 `src/generated/prisma`，应用代码从这里导入类型和客户端。

## Codex 开发约束

本项目的 Codex 技能必须放在 `.agents/skills/`，不要恢复或新增根目录 `skills/`。开始实现相关功能前，需要按 `AGENTS.md` 判断是否命中项目技能，并读取对应 `SKILL.md`。

所有新增或修改的代码都需要使用简体中文注释。复杂流程、边界处理、认证、数据库和 AI 调用要解释原因与约束，不能只复述语法。
