import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

// Better Auth 服务端配置唯一出口；认证相关代码不要在页面里重新创建 auth 实例。
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_APP_URL],
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    // 启用短期 cookie cache 可以减少重复读取 session 的数据库压力。
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [nextCookies()],
});
