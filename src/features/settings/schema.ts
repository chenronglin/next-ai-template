import { z } from "zod";

import { aiModelValues, languageValues, themeValues } from "@/lib/constants";

// 用户设置统一用字符串枚举校验，数据库只负责存储，业务合法性由 Zod 兜底。
export const settingsSchema = z.object({
  theme: z.enum(themeValues),
  defaultModel: z.enum(aiModelValues),
  language: z.enum(languageValues),
  notifications: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
