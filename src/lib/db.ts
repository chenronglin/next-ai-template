import "server-only";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

// 开发环境热更新会重复加载模块；把 PrismaClient 挂到 globalThis 可以复用连接，避免 SQLite 文件被多实例频繁打开。
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  // Prisma 7 要求显式 driver adapter；这里也是项目唯一的 SQLite adapter 创建点。
  const adapter = new PrismaBetterSqlite3({
    url: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
