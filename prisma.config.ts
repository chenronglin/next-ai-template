// Prisma 7 已把连接 URL 从 schema.prisma 移到 config 文件；迁移命令从这里读取 DATABASE_URL。
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // seed 会加载 Prisma SQLite adapter 和 better-sqlite3；Bun 运行时目前无法加载该原生模块，所以这里必须显式走 Node。
    seed: "node --import tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
