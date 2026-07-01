import { z } from "zod";

import { aiModelValues } from "@/lib/constants";

// AI 输入需要限制长度，避免模板默认环境中一次请求消耗过多 token。
export const aiPromptSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt 不能为空").max(4000, "Prompt 最多 4000 字符"),
  model: z.enum(aiModelValues),
});

export type AiPromptInput = z.infer<typeof aiPromptSchema>;
