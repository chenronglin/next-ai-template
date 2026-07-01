import { z } from "zod";

import { aiModelValues, languageValues, themeValues } from "@/lib/constants";

// 用户设置统一用字符串枚举校验，数据库只负责存储，业务合法性由 Zod 兜底。
export const settingsSchema = z.object({
  theme: z.enum(themeValues),
  defaultModel: z.enum(aiModelValues),
  language: z.enum(languageValues),
  notifications: z.boolean(),
});

type DeleteAccountValidationMessages = {
  passwordRequired: string;
  confirmationMismatch: string;
};

export function createDeleteAccountSchema(
  messages: DeleteAccountValidationMessages,
  expectedEmail: string,
) {
  // 删除账户必须同时通过密码校验和邮箱文本确认，降低误触发危险操作的概率。
  return z.object({
    password: z.string().min(1, messages.passwordRequired),
    confirmation: z
      .string()
      .trim()
      .refine((value) => value === expectedEmail, messages.confirmationMismatch),
  });
}

export type SettingsInput = z.infer<typeof settingsSchema>;
