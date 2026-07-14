## AI-Native Web Application Base Project

**适用对象：**

- 使用 Codex、Claude Code 等通用 AI 编程 Agent 的个人开发者；
    
- 需要快速完成 MVP，并继续迭代到正式产品的小型团队；
    
- 希望减少 AI 生成代码失控、重复返工和无法部署问题的开发者。
    

**适用项目：**

- SaaS 产品；
    
- 企业管理后台；
    
- 内容平台；
    
- AI 工具网站；
    
- 电商、会员、订阅类应用；
    
- 具有用户、权限、数据库和后台任务的 Web 应用。
    

---

# 一、基础工程的目标

AI 驱动型 Web 应用基础工程，不是一份代码模板，也不是某个固定框架的 Starter。

它是一套让 AI Agent 能够稳定参与 Web 应用开发的项目结构和工作协议。

它需要确保 AI Agent 能够准确回答六个问题：

1. 这个产品解决什么问题？
    
2. 当前系统采用什么技术方案？
    
3. 代码应该放在哪里？
    
4. 可以使用哪些现成 Skills 和工具？
    
5. 修改完成后如何证明功能正确？
    
6. 代码最终运行在什么环境，如何发布和回滚？
    

因此，一个可用的 AI-Native Web Base Project 应至少具备：

- 清晰的产品和架构文档；
    
- 简洁统一的 Agent 操作规则；
    
- 明确的代码目录边界；
    
- 可发现、可复用的 Agent Skills；
    
- 统一的测试和验证命令；
    
- 明确的本地、Preview 和 Production 环境；
    
- 数据库迁移、安全和部署规范；
    
- 可执行的 CI、部署检查和 Smoke Test。
    

核心目标不是让 AI 尽可能多写代码，而是：

> 让 AI 在正确的上下文中，以受约束、可验证、可部署的方式完成 Web 应用开发。

---

# 二、推荐参考技术栈

基础工程可以适配不同技术组合，但新项目最好先确定一套明确的默认 Profile。

## 2.1 默认 Web 应用 Profile

推荐用于大多数 SaaS、后台系统和 AI 工具网站：

|层级|推荐选择|
|---|---|
|Web 框架|Next.js App Router|
|开发语言|TypeScript Strict Mode|
|UI|Tailwind CSS + shadcn/ui|
|表单与校验|React Hook Form + Zod|
|数据库|PostgreSQL|
|数据平台|Supabase 或独立托管 PostgreSQL|
|ORM/Query Builder|Prisma、Drizzle 或项目明确指定的方案|
|单元测试|Vitest|
|浏览器测试|Playwright|
|部署|Vercel 或 Cloudflare Workers|
|CI|GitHub Actions|
|错误监控|Sentry 或同类平台|
|产品分析|PostHog 或同类平台|

基础工程不强制所有项目使用这些产品，但一个项目一旦确定技术选择，就应写入架构文档，并要求 Agent 不得自行替换。

---

## 2.2 部署 Profile

每个项目只选择一个主要 Web Runtime。

### Profile A：Vercel

适合：

- Next.js 全栈应用；
    
- SaaS、内容平台和管理后台；
    
- 需要 Pull Request Preview；
    
- 希望减少服务器维护；
    
- 主要采用 Server Components、Route Handlers 和 Server Actions。
    

### Profile B：Cloudflare

适合：

- Workers 或 Edge Runtime；
    
- 高并发轻量 API；
    
- 全球边缘部署；
    
- 使用 KV、D1、R2、Queues 或 Durable Objects；
    
- 对网络、安全和边缘计算有明确需求。
    

### Profile C：VPS 或容器平台

适合：

- 长时间运行的任务；
    
- WebSocket、爬虫、媒体处理等特殊服务；
    
- 需要完整 Node.js Runtime 或系统级依赖；
    
- 需要自主管理网络、进程和存储。
    

不要因为“以后也许会用”而同时维护多套部署配置。

基础工程只保留当前实际使用的主部署 Profile，确实存在多平台需求时再增加第二套部署方案。

---

# 三、基础工程设计原则

## 3.1 项目事实与平台知识分离

项目需要自己维护的是：

- 产品规则；
    
- 数据模型；
    
- 权限模型；
    
- 目录边界；
    
- 业务流程；
    
- 环境映射；
    
- 发布流程；
    
- 验收标准。
    

Next.js、Vercel、Cloudflare、Supabase、PostgreSQL 等平台的通用知识，应优先复用官方或成熟 Skills，而不是复制到项目文档中。

例如：

- 项目文档负责说明“本项目使用 Supabase，并采用哪些表和权限规则”；
    
- Supabase Skill 负责说明“怎样正确创建迁移、配置 RLS 和调用 Supabase”；
    
- 项目不再维护一份完整的 Supabase 使用教程。
    

---

## 3.2 单一事实源

同一项信息只保留一个权威位置。

|信息|权威文件|
|---|---|
|产品范围和业务规则|`docs/PRODUCT.md`|
|系统架构|`docs/ARCHITECTURE.md`|
|数据模型|`docs/DATA_MODEL.md`|
|安全与权限|`docs/SECURITY.md`|
|部署环境|`docs/DEPLOYMENT.md`|
|Agent 操作规则|`AGENTS.md`|
|项目命令|`package.json`|
|环境变量名称|`.env.example` 和环境变量校验代码|
|数据库结构|Migration 文件|
|当前开发状态|`docs/STATUS.md`|

不得在多个文件中复制同一套规则。

---

## 3.3 渐进式上下文加载

Agent 不应在每次任务开始时读取整个项目的所有文档。

推荐加载方式：

- 普通 UI 修改：读取 `AGENTS.md` 和对应 Feature；
    
- 新业务功能：增加读取 `PRODUCT.md`；
    
- 数据库修改：增加读取 `DATA_MODEL.md` 和 Migration；
    
- 认证或权限修改：增加读取 `SECURITY.md`；
    
- 部署问题：增加读取 `DEPLOYMENT.md`；
    
- 大型架构调整：增加读取相关 ADR。
    

Codex 和 Claude Code 的 Skills 都支持按需加载完整 Skill 内容，因此适合把较长的流程、参考资料和脚本放入 Skill，而不是全部塞进常驻项目指令。

---

## 3.4 可执行规则优先

以下规则效果较弱：

> 修改完成后认真检查代码。

更好的做法是：

```bash
pnpm verify
```

并让 `verify` 实际执行：

```text
格式检查
→ Lint
→ TypeScript 类型检查
→ 单元测试
→ 集成测试
→ 生产构建
```

能由代码、脚本或 CI 验证的要求，不应只依赖自然语言提醒。

---

## 3.5 生产操作必须受控

AI Agent 可以自动执行：

- 安装依赖；
    
- 修改代码；
    
- 创建数据库 Migration；
    
- 启动本地开发环境；
    
- 执行测试；
    
- 创建 Preview Deployment；
    
- 查看日志；
    
- 执行只读数据库查询。
    

以下操作必须获得明确人工授权：

- 部署到 Production；
    
- 执行生产数据库 Migration；
    
- 删除表、列或生产数据；
    
- 修改生产密钥；
    
- 修改域名或 DNS；
    
- 修改生产权限策略；
    
- 关闭安全检查；
    
- 跳过失败测试；
    
- 回滚或恢复生产数据库。
    

---

# 四、推荐目录结构

以下结构以 Next.js App Router 项目为参考。

```text
web-app/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json
├── .env.example
├── .gitignore
│
├── docs/
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   ├── AI_SKILLS.md
│   ├── STATUS.md
│   │
│   ├── plans/
│   │   ├── README.md
│   │   └── template.md
│   │
│   ├── adr/
│   │   ├── README.md
│   │   └── 0001-example.md
│   │
│   └── runbooks/
│       ├── deployment-failure.md
│       ├── database-migration-failure.md
│       └── service-unavailable.md
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   ├── api/
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── billing/
│   │   └── example-feature/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── server/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── jobs/
│   │
│   ├── lib/
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   ├── result.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   ├── styles/
│   └── types/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   └── smoke/
│
├── scripts/
│   ├── verify.mjs
│   ├── check-env.mjs
│   ├── seed.mjs
│   └── smoke-test.mjs
│
├── .agents/
│   └── skills/
│       ├── verify-critical-flows/
│       │   └── SKILL.md
│       └── prepare-release/
│           └── SKILL.md
│
├── .claude/
│   └── skills/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── preview.yml
│   │   └── production.yml
│   └── pull_request_template.md
│
├── public/
│
└── platform-specific/
    └── 只选择实际使用的平台文件
```

平台专用文件不必统一放进 `platform-specific/`。实际使用时应采用平台官方约定，例如：

```text
Supabase：
supabase/
├── config.toml
├── migrations/
├── seed.sql
└── tests/

Cloudflare：
wrangler.jsonc
worker-configuration.d.ts

Vercel：
vercel.json
```

只有确实需要自定义平台行为时，才创建相应配置文件。

---

# 五、应用代码的目录边界

目录结构不仅是为了整洁，更是为了帮助 Agent 判断代码应该放在哪里。

## 5.1 `src/app/`

职责：

- 路由；
    
- Layout；
    
- 页面入口；
    
- Route Handlers；
    
- 页面级数据组装；
    
- 错误边界；
    
- Metadata。
    

不应承担：

- 大量业务规则；
    
- 复杂数据库查询；
    
- 可复用业务服务；
    
- 通用 UI 组件实现。
    

页面文件应尽量保持为组合层。

```tsx
export default async function ProjectsPage() {
  const projects = await listProjectsForCurrentUser();

  return <ProjectListPage projects={projects} />;
}
```

---

## 5.2 `src/features/`

以业务领域组织代码。

示例：

```text
src/features/projects/
├── components/
│   ├── project-card.tsx
│   └── project-form.tsx
├── server/
│   ├── queries.ts
│   ├── mutations.ts
│   └── policies.ts
├── schemas.ts
├── types.ts
└── constants.ts
```

一个 Feature 可以包含：

- 业务 UI；
    
- 输入 Schema；
    
- 查询和修改入口；
    
- 权限判断；
    
- Feature 专属类型。
    

Feature 不应直接依赖其他 Feature 的内部文件。

跨 Feature 能力应移动到：

- `src/server/services/`；
    
- `src/components/shared/`；
    
- `src/lib/`。
    

---

## 5.3 `src/components/ui/`

存放基础 UI 组件，例如：

- Button；
    
- Dialog；
    
- Input；
    
- Table；
    
- Dropdown；
    
- Form；
    
- Toast。
    

这一层不包含产品业务逻辑。

如果使用 shadcn/ui，应优先通过官方 Skill 和 CLI 管理组件，而不是让 Agent 凭记忆手写组件。skills.sh 已收录 shadcn/ui 官方 Skill，覆盖组件查找、添加、修改和项目上下文识别。

---

## 5.4 `src/server/`

存放只能在服务端运行的代码：

- 数据库访问；
    
- 第三方平台密钥调用；
    
- 认证 Session；
    
- 后台任务；
    
- 邮件发送；
    
- 支付调用；
    
- 文件签名；
    
- 审计日志。
    

建议使用 `server-only` 或等价方式阻止服务端模块被错误打包到客户端。

---

## 5.5 Repository 与 Service

对于简单功能，不必建立复杂的多层架构。

当业务开始复杂时，可以采用：

```text
Route Handler / Server Action
        ↓
输入校验和身份检查
        ↓
Service
        ↓
Repository
        ↓
PostgreSQL / Supabase
```

### Repository 负责

- 查询数据库；
    
- 保存数据；
    
- 隔离 ORM 或数据库客户端。
    

### Service 负责

- 业务规则；
    
- 跨表操作；
    
- 权限判断；
    
- 事务边界；
    
- 外部服务调用。
    

不要让 React 组件直接调用 ORM。

---

# 六、核心文档

## 6.1 `README.md`

面向首次进入项目的人类开发者。

只需要回答：

- 项目是什么；
    
- 使用什么技术栈；
    
- 怎样安装；
    
- 怎样配置环境变量；
    
- 怎样启动；
    
- 怎样测试；
    
- 怎样访问详细文档。
    

推荐结构：

```markdown
# 项目名称

## 项目简介

## 技术栈

## 环境要求

## 本地启动

## 常用命令

## 测试

## 部署环境

## 文档导航
```

---

## 6.2 `docs/PRODUCT.md`

这是业务事实源。

建议包含：

```text
1. 产品背景
2. 目标用户
3. 用户需要解决的问题
4. 核心价值
5. 功能范围
6. 非功能范围
7. 用户角色
8. 核心业务流程
9. 业务规则
10. 验收标准
11. 已知限制
```

每一个核心功能都应有可判断的验收条件。

不要只写：

> 用户可以管理项目。

应写成：

```text
- 登录用户可以创建项目；
- 项目名称长度为 1～100 个字符；
- 用户只能查看自己所属组织的项目；
- 删除项目需要二次确认；
- 已归档项目默认不显示在项目列表中。
```

---

## 6.3 `docs/ARCHITECTURE.md`

记录系统当前实际架构。

建议包含：

- 系统边界；
    
- 技术栈；
    
- Runtime；
    
- 模块划分；
    
- 请求流程；
    
- 数据流；
    
- 认证方式；
    
- 权限模型；
    
- 缓存策略；
    
- 后台任务；
    
- 外部服务；
    
- 目录依赖规则；
    
- 当前技术债务。
    

推荐增加一张简单的数据流：

```text
Browser
   ↓
Next.js Page / Route Handler / Server Action
   ↓
Authentication and Input Validation
   ↓
Domain Service
   ↓
Repository
   ↓
PostgreSQL
```

架构文档只描述项目自身选择，不复制 Next.js 或云平台教程。

---

## 6.4 `docs/DATA_MODEL.md`

记录数据库的业务含义，而不是复制完整 DDL。

建议包含：

- 核心实体；
    
- 实体关系；
    
- 主键策略；
    
- 多租户策略；
    
- 软删除策略；
    
- 时间字段；
    
- 数据保留规则；
    
- 敏感数据；
    
- 权限边界；
    
- 关键索引；
    
- Migration 规则。
    

实际数据库结构以 Migration 文件为准。

---

## 6.5 `docs/SECURITY.md`

至少说明：

- 用户如何认证；
    
- Session 保存在什么位置；
    
- 角色和权限如何定义；
    
- 多租户数据如何隔离；
    
- 哪些操作必须检查资源所有权；
    
- 哪些数据属于敏感数据；
    
- 文件上传限制；
    
- Webhook 如何验签；
    
- 如何处理日志中的个人信息；
    
- 如何管理密钥；
    
- 哪些操作需要审计日志。
    

---

## 6.6 `docs/DEPLOYMENT.md`

只记录项目专属部署信息：

```text
1. 当前部署平台
2. Runtime
3. 环境划分
4. Git 分支与环境映射
5. 环境变量映射
6. 数据库环境映射
7. 构建命令
8. Migration 执行顺序
9. Preview 发布流程
10. Production 发布流程
11. Smoke Test
12. 回滚流程
```

不要重新编写 Vercel、Cloudflare 或 Supabase 的完整使用说明。

具体平台操作由对应官方 Skill 和官方工具完成。

---

## 6.7 `docs/STATUS.md`

用于帮助新 Agent 快速了解项目现状。

建议保持简短：

```markdown
# Current Status

## 当前版本

## 已完成功能

## 正在进行

## 已知问题

## 暂缓事项

## 下一阶段目标
```

它不是完整的任务管理系统，也不应保存每一次开发日志。

---

# 七、AGENTS.md：仓库操作契约

`AGENTS.md` 是 Agent 进入项目后的核心入口。

它不需要解释整个系统，只需要告诉 Agent：

- 先读什么；
    
- 代码放在哪里；
    
- 有哪些禁止事项；
    
- 修改完成后必须执行什么；
    
- 哪些操作需要人工授权。
    

Codex 原生支持通过 `AGENTS.md` 获取仓库级项目指令；Claude Code 可以通过简短的 `CLAUDE.md` 引导其读取同一份项目契约。

推荐模板：

```markdown
# Repository Instructions

## Project

这是一个基于 Next.js、TypeScript 和 PostgreSQL 的 Web 应用。

产品需求以 `docs/PRODUCT.md` 为准。
系统架构以 `docs/ARCHITECTURE.md` 为准。
数据库规则以 `docs/DATA_MODEL.md` 为准。

## Read Before Working

- 普通代码修改：阅读本文件和相关代码。
- 新增业务功能：额外阅读 `docs/PRODUCT.md`。
- 数据库修改：额外阅读 `docs/DATA_MODEL.md`。
- 认证、权限和敏感数据：额外阅读 `docs/SECURITY.md`。
- 部署相关修改：额外阅读 `docs/DEPLOYMENT.md`。

不要无差别读取全部文档。

## Architecture Boundaries

- `src/app` 只负责路由和页面组合。
- 业务代码放入 `src/features`。
- 数据库和密钥相关代码只能放入 `src/server`。
- 基础 UI 放入 `src/components/ui`。
- React 组件不得直接调用 ORM。
- 客户端代码不得引用服务端环境变量。
- 不得跨 Feature 引用其他 Feature 的内部实现。

## Working Rules

- 先检查现有实现，再添加新代码。
- 优先复用已有组件和服务。
- 不要进行与任务无关的重构。
- 不得擅自替换技术栈、ORM、认证或部署平台。
- 引入新的生产依赖前说明必要性。
- 所有外部输入必须校验。
- 所有数据访问必须执行认证和授权检查。
- 不得提交密钥、Token、真实用户数据或 `.env.local`。

## Database Rules

- 所有数据库结构变化必须通过 Migration。
- 不得使用生产数据库进行开发测试。
- 不得直接删除表、列或生产数据。
- 危险 Migration 必须说明兼容和回滚方案。
- 修改数据访问逻辑时必须检查租户和资源权限。

## Required Verification

代码修改完成后运行：

`pnpm verify`

涉及浏览器交互时，还要运行对应 Playwright 测试。

涉及数据库时，还要执行数据库集成测试。

不得在验证失败时声称任务已完成。

## Approval Required

以下操作必须获得明确授权：

- Production 部署；
- 生产数据库 Migration；
- 删除资源或数据；
- 修改生产密钥；
- 修改域名、DNS 或生产权限；
- 跳过失败测试。

## Completion Report

完成后报告：

1. 修改了什么；
2. 修改了哪些文件；
3. 执行了哪些验证；
4. 验证结果；
5. 已知风险；
6. 尚未完成的事项。
```

---

# 八、Claude Code 兼容入口

`CLAUDE.md` 不再保存另一套项目规则。

推荐保持极简：

```markdown
# Claude Code Instructions

Read and follow `AGENTS.md` as the primary repository operating contract.

Only load documents under `docs/` when they are relevant to the current task.

Use existing project Skills and scripts before creating new workflows.
```

其他工具专用说明文件也采用同样原则：

> 只负责把 Agent 引导到项目的通用事实源，不单独维护一份完整规则。

---

# 九、Skills 使用策略

## 9.1 基本原则

Skills 是 AI Agent 的可复用能力包，适合保存：

- 平台最佳实践；
    
- 多步骤开发流程；
    
- 工具调用方法；
    
- 测试方式；
    
- 部署方法；
    
- 参考资料；
    
- 可执行脚本。
    

skills.sh 提供可供 Codex、Claude Code 等多种 Agent 使用的开放 Skills 目录和 CLI。

项目应遵循：

```text
平台通用知识 → 使用外部成熟 Skill
项目业务知识 → 写入项目文档
项目专属流程 → 创建项目 Skill
确定性操作 → 编写项目脚本
```

---

## 9.2 不要安装所有 Skills

Skill 不是越多越好。

过多 Skills 会带来：

- Agent 选择困难；
    
- 重复或冲突规则；
    
- 更多外部脚本权限；
    
- 难以审查和升级；
    
- 项目行为不稳定。
    

建议分为三组：

1. 所有 Web 项目使用的基础 Skills；
    
2. 根据技术栈安装的平台 Skills；
    
3. 项目实际出现重复流程后，再创建项目 Skills。
    

---

# 十、推荐基础 Skills

## 10.1 Skill 发现

```bash
npx skills add vercel-labs/skills --skill find-skills
```

`find-skills` 用于在出现新需求时查找对应能力，避免项目提前安装大量暂时用不到的 Skills。

---

## 10.2 Next.js

```bash
npx skills add vercel/nextjs-skills --skill next-best-practices
```

适用于：

- App Router 文件约定；
    
- Server Components 和 Client Components 边界；
    
- 数据获取；
    
- 异步 API；
    
- Metadata；
    
- Next.js 项目结构。
    

Vercel 当前提供包含 `next-best-practices`、缓存组件和升级能力的 Next.js Skills 集合。

---

## 10.3 React 性能

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
```

适用于：

- React 和 Next.js 性能审查；
    
- 数据请求瀑布；
    
- Bundle 体积；
    
- 服务端渲染性能；
    
- 不必要的重复渲染；
    
- Hydration 问题。
    

该 Skill 包含按影响排序的 React 和 Next.js 性能规则。

---

## 10.4 React 组件设计

```bash
npx skills add vercel-labs/agent-skills --skill vercel-composition-patterns
```

适用于：

- 复杂组件拆分；
    
- Compound Components；
    
- Context 设计；
    
- 组件 API；
    
- 减少大量布尔 Props。
    

---

## 10.5 Web 界面审查

```bash
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

适用于：

- UI 一致性；
    
- 可访问性；
    
- 交互设计；
    
- 表单体验；
    
- 页面结构审查。
    

---

## 10.6 shadcn/ui

```bash
npx skills add shadcn/ui --skill shadcn
```

适用于：

- 查询组件；
    
- 安装组件；
    
- 组合表单和弹窗；
    
- 更新已有组件；
    
- 遵守项目中的 shadcn 配置。
    

---

## 10.7 Web 应用测试

```bash
npx skills add anthropics/skills --skill webapp-testing
```

适用于：

- 启动本地 Web 服务；
    
- 使用 Playwright 检查页面；
    
- 获取截图和 DOM；
    
- 执行用户操作；
    
- 捕获浏览器 Console；
    
- 验证真实交互流程。
    

---

# 十一、按平台选择 Skills

## 11.1 Vercel 部署

使用 Vercel 时安装：

```bash
npx skills add vercel-labs/agent-skills --skill deploy-to-vercel
```

该 Skill 支持识别 Git、Vercel CLI 和项目关联状态，并默认优先创建 Preview Deployment；只有用户明确要求时才进行 Production 部署。

项目自己只需要在 `docs/DEPLOYMENT.md` 中补充：

- Vercel Project 名称；
    
- Preview 和 Production 分支；
    
- 环境变量；
    
- 数据库映射；
    
- Migration 顺序；
    
- Smoke Test；
    
- 回滚方式。
    

---

## 11.2 Cloudflare

使用 Cloudflare 时，按需安装：

```bash
npx skills add cloudflare/skills --skill cloudflare
npx skills add cloudflare/skills --skill wrangler
npx skills add cloudflare/skills --skill workers-best-practices
```

其中：

- `cloudflare` 用于选择和设计 Cloudflare 产品组合；
    
- `wrangler` 用于本地开发、Bindings、Secrets 和部署；
    
- `workers-best-practices` 用于编写和审查 Workers 代码。
    

Cloudflare 官方 Skills 集合还提供 Durable Objects、Agents SDK、Sandbox SDK 和 Web 性能等专项能力。

需要真实页面性能检查时，可以增加：

```bash
npx skills add cloudflare/skills --skill web-perf
```

该 Skill 需要 Chrome DevTools MCP，并可分析 Core Web Vitals、网络依赖、布局偏移和缓存问题。

---

## 11.3 Supabase 与 PostgreSQL

使用 Supabase 时安装：

```bash
npx skills add supabase/agent-skills --skill supabase
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
```

`supabase` 覆盖：

- 数据库；
    
- Migration；
    
- Auth；
    
- RLS；
    
- Storage；
    
- Realtime；
    
- Edge Functions；
    
- SSR 集成；
    
- 安全检查。
    

`supabase-postgres-best-practices` 覆盖：

- Schema 设计；
    
- 索引；
    
- 查询性能；
    
- 连接管理；
    
- 并发；
    
- RLS；
    
- PostgreSQL 运行性能。
    

Supabase 本质上为每个项目提供完整 PostgreSQL 数据库，因此 PostgreSQL Schema、索引、连接和 RLS 仍然需要按照 PostgreSQL 的方式设计。

---

## 11.4 可选平台 Skills

只有项目实际采用对应服务时再安装：

|能力|可查找的 Skill 来源|
|---|---|
|支付|Stripe|
|登录和组织管理|Clerk、Auth0、Better Auth|
|邮件|Resend、React Email|
|错误监控|Sentry|
|产品分析|PostHog|
|ORM|Prisma|
|安全扫描|Semgrep|
|Feature Flag|LaunchDarkly|
|定时任务|Trigger.dev、Temporal|
|Redis|Redis、Upstash|

skills.sh 的 Official 页面已经收录大量由技术提供方维护的 Skills。

---

# 十二、Skills 安全管理

外部 Skill 可能包含：

- Shell 命令；
    
- 文件修改；
    
- 网络访问；
    
- CLI 安装；
    
- 云资源操作；
    
- MCP 调用。
    

因此，安装 Skill 前至少检查：

1. 是否来自技术官方或可信维护者；
    
2. `SKILL.md` 做了什么；
    
3. 是否包含 Shell 命令；
    
4. 是否需要云平台凭证；
    
5. 是否可能执行写入或删除；
    
6. 是否存在安全审计警告；
    
7. 是否与现有 Skills 重复。
    

skills.sh 明确说明，目录和安全审计不能保证每个 Skill 的质量和安全，安装者仍然需要自行审查。

建议在 `docs/AI_SKILLS.md` 维护登记表：

```markdown
# Project AI Skills

| Skill | Source | Purpose | Required | Permission Risk | Reviewed |
|---|---|---|---|---|---|
| next-best-practices | vercel/nextjs-skills | Next.js 开发 | Yes | Low | 2026-07-14 |
| webapp-testing | anthropics/skills | 浏览器测试 | Yes | Medium | 2026-07-14 |
| deploy-to-vercel | vercel-labs/agent-skills | Preview 部署 | Vercel only | High | 2026-07-14 |
| supabase | supabase/agent-skills | 数据库与 Auth | Supabase only | High | 2026-07-14 |
```

---

# 十三、项目专属 Skills

项目只为真正重复出现的专属流程创建 Skill。

适合创建项目 Skill 的场景：

- 创建一种包含固定权限规则的业务模块；
    
- 导入特定格式的客户数据；
    
- 创建 Demo 租户；
    
- 验证项目的关键业务流程；
    
- 执行项目专属发布检查；
    
- 根据数据库生成项目专属报表；
    
- 检查多租户隔离规则；
    
- 执行某种固定内容审核流程。
    

不适合创建项目 Skill 的场景：

- 普通 React 组件开发；
    
- 通用 Next.js 最佳实践；
    
- 通用 PostgreSQL 优化；
    
- 通用 Vercel 部署；
    
- 通用 Cloudflare 配置；
    
- 只执行一次的简单任务。
    

---

## 13.1 项目 Skill 示例

```text
.agents/skills/verify-critical-flows/
├── SKILL.md
├── references/
│   └── critical-flows.md
└── scripts/
    └── run-critical-flows.mjs
```

`SKILL.md`：

```markdown
---
name: verify-critical-flows
description: >
  Verify the project's critical user flows before a release.
  Use before preview acceptance or production deployment.
---

# Verify Critical Flows

## Required Context

Read:

- `docs/PRODUCT.md`
- `docs/TESTING.md`
- `references/critical-flows.md`

## Preconditions

- The application can start locally.
- Test environment variables are available.
- Test data has been seeded.

## Procedure

1. Run `pnpm verify`.
2. Start the application in test mode.
3. Run `pnpm test:e2e:critical`.
4. Capture browser console errors.
5. Capture screenshots for failed steps.
6. Report each flow as passed, failed, or blocked.

## Critical Rules

- Do not use production user data.
- Do not mark a flow passed unless assertions completed.
- Stop release preparation when a critical flow fails.

## Output

Report:

- executed commands;
- passed flows;
- failed flows;
- screenshots and logs;
- release recommendation.
```

Codex 官方建议一个 Skill 聚焦一类可重复任务，并明确输入、输出和实际使用场景，不要一开始就把所有边缘情况都塞进同一个 Skill。

---

# 十四、项目命令协议

`package.json` 是 Agent 执行项目操作的机器入口。

建议至少提供：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:critical": "playwright test --grep @critical",
    "smoke": "node scripts/smoke-test.mjs",
    "verify": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

数据库脚本按项目实际技术增加：

```json
{
  "scripts": {
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase db reset",
    "db:generate": "supabase gen types typescript --local",
    "db:test": "supabase test db"
  }
}
```

或者：

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed"
  }
}
```

Agent 不应临时发明项目命令。

所有常用操作都应通过 `package.json` 或 `scripts/` 暴露统一入口。

---

# 十五、环境变量规范

## 15.1 必须具备

```text
.env.example
src/lib/env.ts
```

`.env.example` 只包含变量名称和说明：

```bash
# Public
NEXT_PUBLIC_APP_URL=

# Database
DATABASE_URL=
DIRECT_DATABASE_URL=

# Authentication
AUTH_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Monitoring
SENTRY_DSN=
```

不得放入真实值。

---

## 15.2 启动时校验

使用 Zod 或同类方式校验：

```ts
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = {
  server: serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  }),
  client: clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }),
};
```

目标是让环境配置错误尽早失败，而不是部署后才发现。

---

## 15.3 环境隔离

至少区分：

|环境|Web 应用|数据库|外部服务|
|---|---|---|---|
|Local|本地|本地数据库|Sandbox|
|Test|测试进程|临时数据库|Mock/Sandbox|
|Preview|Preview URL|Preview/Staging 数据库|Sandbox|
|Production|正式域名|Production 数据库|Production|

Preview 不得默认拥有生产数据库写权限。

---

# 十六、数据库与 Migration

数据库结构的唯一事实源是 Migration。

推荐流程：

```text
修改 DATA_MODEL.md
        ↓
生成 Migration
        ↓
本地重建数据库
        ↓
运行数据库测试
        ↓
运行应用集成测试
        ↓
部署到 Preview 或 Staging
        ↓
人工审查
        ↓
执行 Production Migration
```

---

## 16.1 Migration 规则

Agent 创建 Migration 时必须：

- 使用明确名称；
    
- 不直接修改已执行的历史 Migration；
    
- 说明是否兼容旧代码；
    
- 为新增非空字段提供默认值或分阶段迁移；
    
- 为大表索引考虑锁表和执行时间；
    
- 为数据转换提供验证 SQL；
    
- 说明失败后的前向修复或回滚方式。
    

---

## 16.2 危险数据库变更

以下变化必须单独审查：

- 删除表；
    
- 删除列；
    
- 重命名字段；
    
- 修改字段类型；
    
- 增加非空约束；
    
- 大批量更新数据；
    
- 修改 RLS；
    
- 修改租户字段；
    
- 修改用户与组织关系；
    
- 修改唯一约束；
    
- 修改级联删除。
    

推荐使用扩展—迁移—收缩方式：

```text
增加新字段
→ 新旧代码兼容
→ 回填数据
→ 切换读取
→ 验证
→ 最后移除旧字段
```

---

# 十七、认证和授权

Web 应用必须区分：

- Authentication：用户是谁；
    
- Authorization：用户可以做什么；
    
- Resource Ownership：用户是否可以操作这个具体资源；
    
- Tenant Isolation：用户是否属于这个组织或租户。
    

仅检查“用户已经登录”是不够的。

错误示例：

```ts
const user = await requireUser();

return db.project.findUnique({
  where: { id: projectId },
});
```

正确方向：

```ts
const actor = await requireUser();

return projectRepository.findAccessibleProject({
  projectId,
  organizationId: actor.organizationId,
});
```

每次读取、修改和删除资源，都需要重新检查权限。

客户端隐藏按钮不能替代服务端授权。

---

# 十八、测试结构

## 18.1 单元测试

测试：

- 业务规则；
    
- 数据转换；
    
- 权限计算；
    
- 状态机；
    
- 金额和日期计算；
    
- Schema 校验。
    

不需要为没有逻辑的展示组件机械编写测试。

---

## 18.2 集成测试

测试：

- Repository；
    
- PostgreSQL 查询；
    
- Transaction；
    
- Migration；
    
- RLS；
    
- Route Handler；
    
- Server Action；
    
- 外部服务 Adapter。
    

集成测试应使用独立测试数据库。

---

## 18.3 E2E 测试

覆盖最关键的用户流程，例如：

```text
注册或登录
→ 创建核心资源
→ 编辑资源
→ 权限校验
→ 退出登录
```

每个项目控制在少量真正关键流程，不必对所有页面进行完整自动化。

推荐标签：

```ts
test("@critical 用户可以创建项目", async ({ page }) => {
  // ...
});
```

---

## 18.4 Smoke Test

部署后只检查最关键的可用性：

- 首页响应；
    
- 登录页响应；
    
- 健康检查接口；
    
- 数据库连接；
    
- 一个关键只读 API；
    
- 一个核心页面；
    
- 页面是否出现严重 Console Error。
    

Smoke Test 应在 Preview 和 Production 部署后都能执行。

---

# 十九、统一验证流程

所有代码任务完成后执行：

```bash
pnpm verify
```

根据任务类型追加：

|变更类型|附加验证|
|---|---|
|UI 和交互|Playwright 或浏览器检查|
|数据库|Migration + Integration Test|
|权限|多角色和跨租户测试|
|部署|Preview + Smoke Test|
|性能|Web Performance Audit|
|支付|Sandbox Webhook 和金额测试|
|邮件|测试收件箱和模板预览|

AI Agent 不得因为“代码看起来正确”而跳过验证。

---

# 二十、CI Pipeline

推荐 Pull Request 流程：

```text
Pull Request
    ↓
安装锁定依赖
    ↓
格式检查
    ↓
Lint
    ↓
TypeScript 检查
    ↓
单元测试
    ↓
集成测试
    ↓
生产构建
    ↓
Preview Deployment
    ↓
Smoke Test
    ↓
人工审查
```

Production 流程：

```text
合并主分支
    ↓
再次执行 Verify
    ↓
确认 Migration
    ↓
人工批准
    ↓
执行 Migration
    ↓
部署 Web 应用
    ↓
Production Smoke Test
    ↓
检查监控和错误日志
```

生产密钥只允许在 Production Job 获得批准后使用。

---

# 二十一、开发计划与架构决策

## 21.1 什么时候写 Plan

以下任务建议在 `docs/plans/` 创建实现计划：

- 预计修改多个模块；
    
- 需要数据库变化；
    
- 涉及权限；
    
- 涉及支付；
    
- 涉及部署；
    
- 预计超过半天；
    
- 存在多种实现方案。
    

Plan 模板：

```markdown
# Feature Plan

## Background

## Goals

## Non-goals

## Current Implementation

## Proposed Changes

## Files and Modules

## Data Changes

## Authorization

## Testing

## Deployment Impact

## Risks

## Completion Criteria
```

小型修复不需要为形式而创建 Plan。

---

## 21.2 什么时候写 ADR

只有长期影响系统的决策才写 ADR，例如：

- 选择 Supabase 而不是独立 PostgreSQL；
    
- 选择 Vercel 而不是 Cloudflare；
    
- 选择 Prisma 或 Drizzle；
    
- 采用多租户共享 Schema；
    
- 采用软删除；
    
- 引入事件队列；
    
- 更换认证系统。
    

ADR 记录的是已经作出的决定，不是开发任务清单。

---

# 二十二、标准 Agent 开发流程

## 第一步：理解任务

Agent 应先：

- 阅读任务描述；
    
- 检查相关代码；
    
- 找到已有实现；
    
- 判断涉及的 Feature；
    
- 判断是否涉及数据库、权限或部署；
    
- 找到对应 Skills。
    

---

## 第二步：确认验收标准

对于模糊需求，Agent 应先把目标转换为可验证结果。

例如：

```text
用户可以修改个人资料
```

转换为：

```text
- 登录用户可以修改昵称和头像；
- 昵称长度为 2～30 个字符；
- 不允许修改其他用户资料；
- 上传文件限制为指定类型和大小；
- 修改完成后页面立即显示新资料；
- 失败时显示明确错误。
```

---

## 第三步：制定计划

简单任务使用短计划。

复杂任务创建 `docs/plans/` 文件，并明确：

- 修改范围；
    
- 数据变化；
    
- 权限变化；
    
- 测试方式；
    
- 部署影响；
    
- 风险。
    

---

## 第四步：最小范围实现

实施时：

- 优先修改已有模块；
    
- 不顺手进行大规模重构；
    
- 不创建重复组件；
    
- 不为未来假设设计复杂抽象；
    
- 不擅自替换依赖；
    
- 一个任务只解决一个主要问题。
    

---

## 第五步：自动验证

执行：

```bash
pnpm verify
```

再根据任务类型追加数据库、浏览器或部署验证。

---

## 第六步：真实浏览器验证

涉及页面时，Agent 应在真实浏览器中检查：

- 页面是否能加载；
    
- 关键按钮是否可操作；
    
- 表单是否可提交；
    
- 加载和错误状态；
    
- 响应式布局；
    
- Console Error；
    
- 必要的截图。
    

不能只依赖 JSX 和 CSS 静态阅读判断页面完成。

---

## 第七步：报告结果

标准完成报告：

```markdown
## Completed

- 实现了什么

## Files Changed

- 修改的主要文件

## Verification

- pnpm verify: passed
- integration tests: passed
- Playwright critical flow: passed

## Deployment Impact

- 是否新增环境变量
- 是否包含 Migration
- 是否需要重新部署

## Risks

- 已知风险或限制

## Not Completed

- 明确未完成事项
```

---

# 二十三、Definition of Done

一个 Web 功能只有同时满足以下条件，才可以被标记完成。

## 产品

- 满足明确的验收标准；
    
- 正常流程可用；
    
- 空状态、加载状态和错误状态已处理；
    
- 没有添加需求范围外的行为。
    

## 架构

- 代码放在正确目录；
    
- 没有破坏 Server 和 Client 边界；
    
- 没有跨 Feature 引用内部代码；
    
- 没有绕过 Service 或权限层。
    

## 安全

- 外部输入经过校验；
    
- 服务端执行认证和授权；
    
- 不会跨用户或跨租户访问数据；
    
- 没有泄露密钥和敏感数据；
    
- 日志不包含不必要的个人信息。
    

## 数据库

- Schema 变化包含 Migration；
    
- 关键查询包含适当索引；
    
- Migration 已在非生产环境验证；
    
- 权限策略和 RLS 已验证；
    
- 危险变化已有处理方案。
    

## 测试

- `pnpm verify` 通过；
    
- 核心业务规则有测试；
    
- 数据库变化有集成测试；
    
- 用户关键流程有 E2E 或真实浏览器验证；
    
- 没有被忽略的失败测试。
    

## 部署

- 新环境变量已加入 `.env.example`；
    
- Preview 构建成功；
    
- Smoke Test 通过；
    
- Production 影响已说明；
    
- 必要时有回滚方案。
    

## 文档

- 产品规则变化已更新 `PRODUCT.md`；
    
- 数据结构变化已更新 `DATA_MODEL.md`；
    
- 架构决策已更新 `ARCHITECTURE.md` 或 ADR；
    
- 部署方式变化已更新 `DEPLOYMENT.md`。
    

---

# 二十四、最小落地版本

对于刚开始的项目，不需要一次建立所有目录。

第一阶段只创建：

```text
AGENTS.md
CLAUDE.md
README.md
.env.example
docs/
├── PRODUCT.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── DEPLOYMENT.md
├── AI_SKILLS.md
└── STATUS.md
src/
tests/
package.json
.github/workflows/ci.yml
```

并完成以下事项：

1. 明确一个部署 Profile；
    
2. 建立 `pnpm verify`；
    
3. 安装 Next.js 和 Web 测试基础 Skills；
    
4. 根据项目选择 Vercel、Cloudflare 或 Supabase Skills；
    
5. 建立 Preview Deployment；
    
6. 为一个核心用户流程创建 E2E 测试；
    
7. 禁止 Agent 直接操作生产环境。
    

---

# 二十五、项目初始化检查表

## 产品

-  目标用户已经明确；
    
-  第一版功能范围已经明确；
    
-  核心业务流程已经写入 `PRODUCT.md`；
    
-  每个核心功能有验收标准。
    

## 技术

-  已确定 Web 框架；
    
-  已确定数据库；
    
-  已确定认证方案；
    
-  已确定主要部署平台；
    
-  已确定 ORM 或数据库访问方式。
    

## Agent

-  已创建 `AGENTS.md`；
    
-  已创建极简 `CLAUDE.md`；
    
-  已登记项目使用的 Skills；
    
-  已审查包含 Shell 或云平台操作的 Skills；
    
-  已明确生产操作授权边界。
    

## 工程

-  TypeScript Strict Mode 已启用；
    
-  环境变量启动校验已启用；
    
-  `pnpm verify` 可以执行；
    
-  数据库 Migration 可以本地运行；
    
-  CI 可以执行构建和测试；
    
-  Preview 环境可以部署；
    
-  Smoke Test 可以运行。
    

## 安全

-  客户端和服务端变量已经分离；
    
-  数据访问包含授权判断；
    
-  Preview 不使用生产数据库写凭证；
    
-  密钥没有提交到仓库；
    
-  生产部署需要人工批准。
    

---

# 二十六、最终模型

AI 驱动型 Web 应用基础工程可以概括为：

```text
PRODUCT.md
定义要做什么
        ↓
ARCHITECTURE.md
定义系统怎样组织
        ↓
AGENTS.md
定义 Agent 怎样工作
        ↓
External Skills
提供平台和框架能力
        ↓
Project Skills
提供项目专属流程
        ↓
package.json + scripts
执行确定性操作
        ↓
Tests + CI
验证代码是否合格
        ↓
Preview Deployment
验证真实运行结果
        ↓
Production Approval
控制高风险上线操作
        ↓
Monitoring + Runbooks
发现并处理生产问题
```

其中最重要的边界是：

> 不复制平台已经维护成熟的知识；  
> 不把项目业务交给通用 Skill 猜测；  
> 不把自然语言提醒当成自动化验证；  
> 不让开发 Agent 默认拥有生产权限；  
> 不在没有真实浏览器和部署验证的情况下宣布 Web 功能完成。

一套成熟的 AI-Native Web Base Project，最终应让新的开发者或新的 AI Agent 在进入仓库后，能够快速理解产品、找到正确代码位置、调用合适 Skills、完成修改、运行验证，并安全地把功能交付到真实 Web 环境。