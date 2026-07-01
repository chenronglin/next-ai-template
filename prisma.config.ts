// Prisma 7 已把连接 URL 从 schema.prisma 移到 config 文件；迁移命令从这里读取 DATABASE_URL。
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
