# Next AI SaaS Starter Agent Guide

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 本地文档

本项目使用 Next.js 16。写 Next.js 相关代码前，优先读取本地版本匹配文档：

```txt
node_modules/next/dist/docs/
```

重点关注 App Router、Server Components、Route Handlers、Server Functions、Proxy 文件约定。
<!-- END:nextjs-agent-rules -->

## 项目硬约束

1. 使用 Bun 作为包管理与命令入口：安装依赖用 `bun install`，执行脚本用 `bun run`，临时 CLI 用 `bunx`。
2. 因 `@prisma/adapter-better-sqlite3` 依赖 `better-sqlite3`，会加载数据库的脚本通过 `bun run` 入口调用 Node 运行时；不要改成直接用 `bun:sqlite`。
3. 使用 `src/app` App Router，不新增 Pages Router。
4. 页面和 layout 默认是 Server Component；只有表单、主题切换、AI streaming UI 等明确交互才使用 Client Component。
5. 数据库访问只能通过 `src/lib/db.ts` 导出的 Prisma Client。
6. 业务代码禁止直接使用 `bun:sqlite` 或 `better-sqlite3`。
7. 认证只能通过 `src/lib/auth.ts` 和 `src/lib/auth-client.ts` 的 Better Auth 实例。
8. UI 优先使用 `src/components/ui` 下的 shadcn/ui 组件。
9. 表单、Server Action、Route Handler 输入必须先用 Zod schema 校验。
10. 新业务模块放入 `src/features/<module>`，按 `schema.ts`、`queries.ts`、`actions.ts`、`components/` 组织。
11. 修改数据库必须更新 `prisma/schema.prisma`、生成 migration，并重新运行 Prisma Client 生成。
12. 完成代码修改后运行 `bun run typecheck`、`bun run lint`、`bun test`；涉及页面或数据库时同时运行相关 Prisma 命令。

## 当前技术栈

- Next.js App Router
- React Server Components
- Bun package manager
- SQLite
- Prisma 7 driver adapter
- Better Auth
- Vercel AI SDK
- shadcn/ui
- Zod

## 常用命令

```bash
bun install
bun run dev
bun run db:generate
bun run db:migrate -- --name <name>
bun run db:seed
bun run db:studio
bun run typecheck
bun run lint
bun test
```
