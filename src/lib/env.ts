import "server-only";

import { z } from "zod";

// 本文件是环境变量唯一入口：所有服务端模块都从这里读取，避免散落的 `process.env` 绕过校验。
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1).default("file:./prisma/dev.db"),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET 至少需要 32 个字符"),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    AI_GATEWAY_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().min(1).default("onboarding@resend.dev"),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((value, context) => {
    // 生产环境不能沿用示例密钥；这类错误越早失败越好。
    if (
      value.NODE_ENV === "production" &&
      value.BETTER_AUTH_SECRET.includes("replace-with")
    ) {
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_SECRET"],
        message: "生产环境必须替换 Better Auth 示例密钥",
      });
    }
  });

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});
