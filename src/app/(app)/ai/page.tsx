import type { Metadata } from "next";

import { AiChatPanel } from "@/features/ai/components/ai-chat-panel";
import { getAiHistory } from "@/features/ai/queries";
import { getAvailableModels } from "@/features/ai/service";
import { getUserPreference } from "@/features/settings/queries";
import { requireUser } from "@/server/require-user";

export const metadata: Metadata = {
  title: "AI 示例",
};

export default async function AiPage() {
  const session = await requireUser();
  const [preference, history] = await Promise.all([
    getUserPreference(session.user.id),
    getAiHistory(session.user.id),
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">AI 示例</h1>
        <p className="mt-2 text-muted-foreground">
          使用 Vercel AI SDK Route Handler 进行 streaming 输出，并保存生成历史。
        </p>
      </div>
      <AiChatPanel
        models={getAvailableModels()}
        defaultModel={preference.defaultModel}
        history={history}
      />
    </div>
  );
}
