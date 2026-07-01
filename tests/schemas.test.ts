import { describe, expect, test } from "bun:test";

import { aiPromptSchema } from "@/features/ai/schema";
import { signUpSchema } from "@/features/auth/schema";
import { noteCreateSchema } from "@/features/notes/schema";
import { settingsSchema } from "@/features/settings/schema";

describe("核心 Zod schema", () => {
  test("注册 schema 会拒绝不一致的确认密码", () => {
    const result = signUpSchema.safeParse({
      name: "Moses",
      email: "moses@example.com",
      password: "password123",
      confirmPassword: "password456",
      terms: true,
    });

    expect(result.success).toBe(false);
  });

  test("Note 创建 schema 会裁剪空标题并拒绝空内容", () => {
    const result = noteCreateSchema.safeParse({
      title: "   ",
      content: "",
    });

    expect(result.success).toBe(false);
  });

  test("设置 schema 只接受约定模型和主题", () => {
    const result = settingsSchema.safeParse({
      theme: "system",
      defaultModel: "openai/gpt-4o-mini",
      language: "zh-CN",
      notifications: true,
    });

    expect(result.success).toBe(true);
  });

  test("AI Prompt schema 会限制空 prompt", () => {
    const result = aiPromptSchema.safeParse({
      prompt: "",
      model: "openai/gpt-4o-mini",
    });

    expect(result.success).toBe(false);
  });
});
