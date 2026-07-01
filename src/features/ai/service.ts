import "server-only";

import { generateText, gateway, streamText, type LanguageModelUsage } from "ai";

import type { AiPromptInput } from "@/features/ai/schema";
import type { Dictionary } from "@/i18n/types";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { aiModelLabels, aiModelValues } from "@/lib/constants";

const encoder = new TextEncoder();

export function getAvailableModels() {
  return aiModelValues.map((value) => ({
    value,
    label: aiModelLabels[value],
  }));
}

export function estimateTokenUsage(content: string) {
  // 粗略按 4 字符 1 token 估算，用于 provider 没返回 usage 或本地演示流。
  return Math.max(1, Math.ceil(content.length / 4));
}

export async function generateTextOnce(input: AiPromptInput) {
  if (!env.AI_GATEWAY_API_KEY) {
    return `本地演示响应：${input.prompt.slice(0, 160)}`;
  }

  const result = await generateText({
    model: gateway(input.model),
    prompt: input.prompt,
    system: "You are a concise SaaS product assistant embedded in a starter template.",
  });

  return result.text;
}

export function createAiTextStream(input: AiPromptInput, userId: string) {
  return streamText({
    model: gateway(input.model),
    prompt: input.prompt,
    system:
      "You are a concise SaaS product assistant. Answer clearly and focus on implementation details.",
    onEnd: async (event) => {
      await saveConversation({
        userId,
        prompt: input.prompt,
        model: input.model,
        output: event.text,
        usage: event.usage,
      });
    },
  });
}

export function createMockStreamResponse(
  input: AiPromptInput,
  userId: string,
  messages: Dictionary["ai"]["mockStream"],
) {
  const chunks = [
    messages.prefix,
    messages.missingKey,
    messages.fallback,
    messages.promptLabel,
    input.prompt,
    messages.enableGateway,
  ];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 45));
      }

      controller.close();

      await saveConversation({
        userId,
        prompt: input.prompt,
        model: input.model,
        output: chunks.join(""),
        usage: undefined,
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function saveConversation({
  userId,
  prompt,
  model,
  output,
  usage,
}: {
  userId: string;
  prompt: string;
  model: string;
  output: string;
  usage?: LanguageModelUsage;
}) {
  const tokenCount =
    usage?.totalTokens ?? estimateTokenUsage(prompt) + estimateTokenUsage(output);

  await db.aiConversation.create({
    data: {
      userId,
      model,
      title: prompt.slice(0, 80),
      messages: {
        create: [
          {
            role: "user",
            content: prompt,
            tokenCount: estimateTokenUsage(prompt),
          },
          {
            role: "assistant",
            content: output,
            tokenCount,
          },
        ],
      },
    },
  });
}
