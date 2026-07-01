---
name: prisma-better-auth
description: 涉及用户、会话、数据库模型、迁移和 Better Auth 集成时使用。
---

# prisma-better-auth

## 规则

1. Prisma 是唯一业务 ORM，数据库入口只允许 `src/lib/db.ts`。
2. Better Auth 服务端配置只允许 `src/lib/auth.ts`，前端客户端只允许 `src/lib/auth-client.ts`。
3. 不要在业务代码中直接使用 `bun:sqlite`、`better-sqlite3` 或原始 SQLite 连接。
4. SQLite 字符串枚举必须由 Zod 和 TypeScript 常量约束，不依赖数据库 enum。
5. 修改模型后运行 `bun run db:generate` 和 `bun run db:migrate -- --name <name>`。
6. Bun 仍是命令入口，但 Prisma SQLite adapter 相关运行时需要 Node；不要把脚本改成直接 Bun 运行数据库代码。
