import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

// seed 只写模板演示数据，不创建真实认证用户，避免绕过 Better Auth 的密码哈希流程。
const adapter = new PrismaBetterSqlite3({
  // seed 和应用运行时都使用 Prisma config 中同一份 SQLite URL。
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

// Prisma 7 在 Bun/Node 下需要显式传入 SQLite driver adapter。
const prisma = new PrismaClient({ adapter });

async function main() {
  // 这里保留轻量连通性检查，确保 `bun run db:seed` 能发现 schema/client 不一致的问题。
  await prisma.$queryRaw`SELECT 1`;
  console.log("Seed completed. Register a user from /sign-up to create demo data.");
}

main()
  .catch((error) => {
    // seed 失败时抛出非零退出码，方便 CI 和 Codex 自动识别。
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
