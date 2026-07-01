import type { Metadata } from "next";

import { AiChatPanel } from "@/features/ai/components/ai-chat-panel";
import { getAiHistory } from "@/features/ai/queries";
import { getAvailableModels } from "@/features/ai/service";
import { getUserPreference } from "@/features/settings/queries";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireUser } from "@/server/require-user";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.ai.metadataTitle,
  };
}

export default async function AiPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const [preference, history] = await Promise.all([
    getUserPreference(session.user.id),
    getAiHistory(session.user.id),
  ]);
  const messages = dictionary.ai;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{messages.title}</h1>
        <p className="mt-2 text-muted-foreground">{messages.description}</p>
      </div>
      <AiChatPanel
        models={getAvailableModels()}
        defaultModel={preference.defaultModel}
        history={history}
        locale={locale}
        messages={messages}
      />
    </div>
  );
}
