import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import {
  sendDeleteAccountEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/features/auth/email-templates";
import { getSocialProviders } from "@/features/auth/oauth";
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
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      // Better Auth 负责生成和校验 token，这里只负责把一次性链接交给 Resend。
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      // 验证链接由 Better Auth 签名生成，邮件模板只展示按钮，不自行拼接 token。
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      deleteTokenExpiresIn: 60 * 30,
      sendDeleteAccountVerification: async ({ user, url }) => {
        // 删除账户走邮件二次确认，避免一次表单提交直接抹除用户数据。
        await sendDeleteAccountEmail({
          to: user.email,
          name: user.name,
          url,
        });
      },
    },
  },
  socialProviders: getSocialProviders(),
  session: {
    // 启用短期 cookie cache 可以减少重复读取 session 的数据库压力。
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [nextCookies()],
});
