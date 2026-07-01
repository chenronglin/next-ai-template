import { NextRequest, NextResponse } from "next/server";

import { createAiPromptSchema } from "@/features/ai/schema";
import { createAiTextStream, createMockStreamResponse } from "@/features/ai/service";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { env } from "@/lib/env";
import { getCurrentSession } from "@/server/require-user";

export async function POST(request: NextRequest) {
  // session 和 body 互不依赖，提前并行启动，避免 Route Handler 中出现串行等待。
  const sessionPromise = getCurrentSession();
  const bodyPromise = request.json();
  const [session, body] = await Promise.all([sessionPromise, bodyPromise]);
  const locale = resolveLocale(
    typeof body?.locale === "string" ? body.locale : undefined,
  );
  const dictionary = await getDictionary(locale);

  if (!session?.user) {
    return NextResponse.json(
      { error: dictionary.ai.validation.unauthorized },
      { status: 401 },
    );
  }

  const parsed = createAiPromptSchema(dictionary.ai.validation).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? dictionary.ai.validation.invalidRequest },
      { status: 400 },
    );
  }

  if (!env.AI_GATEWAY_API_KEY) {
    return createMockStreamResponse(parsed.data, session.user.id, dictionary.ai.mockStream);
  }

  const result = createAiTextStream(parsed.data, session.user.id);
  return result.toTextStreamResponse();
}
