import { z } from "zod";

import { aiModelValues } from "@/lib/constants";

type AiValidationMessages = {
  promptRequired: string;
  promptMax: string;
};

export function createAiPromptSchema(messages: AiValidationMessages) {
  // AI 输入需要限制长度，避免模板默认环境中一次请求消耗过多 token。
  return z.object({
    prompt: z.string().trim().min(1, messages.promptRequired).max(4000, messages.promptMax),
    model: z.enum(aiModelValues),
  });
}

export const aiPromptSchema = createAiPromptSchema({
  promptRequired: "Prompt 不能为空",
  promptMax: "Prompt 最多 4000 字符",
});

export type AiPromptInput = z.infer<typeof aiPromptSchema>;
