# Next AI SaaS Starter Agent Guide

## 工作入口

1. 本项目的 Codex 技能必须放在 `.agents/skills/`；不要使用或恢复根目录 `skills/`，否则 Codex 无法按项目技能发现并触发。
2. 开始实现前，先判断任务是否命中下方“项目技能”。命中时必须完整读取对应 `.agents/skills/<skill-name>/SKILL.md`，再写代码或改文档。
3. `AGENTS.md` 是顶层硬约束；项目技能提供更具体的场景规则。若两者冲突，优先遵守用户最新要求和本文件硬约束。
4. 所有新增或修改的代码都必须配套简体中文注释；复杂流程、边界处理、认证、数据库、AI 调用等非显然逻辑要写清楚原因与约束，避免只复述语法。

## 项目技能

| 技能 | 必须使用的场景 |
| --- | --- |
| `next-saas-template` | 新增或修改 Next.js SaaS 页面、layout、业务模块、路由结构、Server/Client Component 边界。 |
| `shadcn-product-ui` | 新增或修改产品 UI、后台页面、表单、表格、弹窗、加载/空/错误状态。 |
| `zod-server-actions` | 新增或修改表单、Server Action、CRUD、Route Handler 输入校验和写操作返回结构。 |
| `prisma-better-auth` | 涉及用户、会话、Better Auth、Prisma 模型、数据库访问、迁移或 seed。 |
| `ai-sdk-next` | 新增或修改 AI 生成、streaming UI、模型选择、prompt 校验、AI 会话历史保存。 |

多场景任务需要读取多个技能。推荐顺序：`next-saas-template` -> `prisma-better-auth` -> `zod-server-actions` -> `shadcn-product-ui` -> `ai-sdk-next`，并按实际任务跳过无关技能。

## Next.js 本地文档

本项目使用 `package.json` 锁定的 Next.js 16。写 Next.js 相关代码前，优先读取本地版本匹配文档：

```txt
node_modules/next/dist/docs/
```

重点关注 App Router、Server Components、Route Handlers、Server Functions、Proxy 文件约定。

## 项目硬约束

1. 使用 Bun 作为包管理与命令入口：安装依赖用 `bun install`，执行脚本用 `bun run`，临时 CLI 用 `bunx`。
2. 因 `@prisma/adapter-better-sqlite3` 依赖 `better-sqlite3`，会加载数据库的脚本通过 `bun run` 入口调用 Node 运行时；业务代码禁止直接使用 `bun:sqlite`、`better-sqlite3` 或原始 SQLite 连接。
3. 使用 `src/app` App Router，不新增 Pages Router。
4. 页面和 layout 默认是 Server Component；只有表单、主题切换、AI streaming UI 等明确交互才使用 Client Component。
5. 数据库访问只能通过 `src/lib/db.ts` 导出的 Prisma Client。
6. 认证只能通过 `src/lib/auth.ts` 和 `src/lib/auth-client.ts` 的 Better Auth 实例。
7. UI 优先使用 `src/components/ui` 下的 shadcn/ui 组件。
8. 表单、Server Action、Route Handler 输入必须先用 Zod schema 校验。
9. 新业务模块放入 `src/features/<module>`，按 `schema.ts`、`queries.ts`、`actions.ts`、`components/` 组织。
10. 修改数据库必须更新 `prisma/schema.prisma`、生成 migration，并重新运行 Prisma Client 生成。
11. 完成代码修改后运行 `bun run typecheck`、`bun run lint`、`bun test`；涉及页面或数据库时同时运行相关 Prisma 命令。

## 常用命令

```bash
bun install
bun run dev
bun run build
bun run db:generate
bun run db:migrate -- --name <name>
bun run db:seed
bun run db:studio
bun run typecheck
bun run lint
bun test
```
