import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Database, Settings, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countAiConversations } from "@/features/ai/queries";
import { countNotes, getRecentNotes } from "@/features/notes/queries";
import { getUserPreference } from "@/features/settings/queries";
import { getLocaleFromRouteParams, localizeHref, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { aiModelLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { requireUser } from "@/server/require-user";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.dashboard.metadataTitle,
  };
}

const quickLinks = [
  { href: "/me", labelKey: "me", icon: UserRound },
  { href: "/settings", labelKey: "settings", icon: Settings },
  { href: "/examples/notes", labelKey: "notes", icon: Database },
  { href: "/ai", labelKey: "ai", icon: Bot },
] as const;

export default async function DashboardPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const messages = dictionary.dashboard;

  // 后台首页的数据互不依赖，使用 Promise.all 避免数据库查询瀑布。
  const [recentNotes, noteCount, aiCount, preference] = await Promise.all([
    getRecentNotes(session.user.id),
    countNotes(session.user.id),
    countAiConversations(session.user.id),
    getUserPreference(session.user.id),
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="secondary">{messages.badge}</Badge>
          <h1 className="mt-3 text-3xl font-semibold">
            {messages.greeting.replace("{name}", session.user.name)}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {messages.sessionDescription.replace("{email}", session.user.email)}
          </p>
        </div>
        <Button asChild>
          <Link href={localizeHref("/examples/notes", locale)}>
            {messages.createResource}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.statusCard.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {messages.statusCard.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.notesCard.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{noteCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {messages.notesCard.description}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.aiCard.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{aiCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {messages.aiCard.defaultModel.replace(
                "{model}",
                aiModelLabels[preference.defaultModel as keyof typeof aiModelLabels],
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.recentNotes.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{messages.recentNotes.empty}</p>
            ) : (
              <div className="grid gap-3">
                {recentNotes.map((note) => (
                  <div key={note.id} className="rounded-md border p-3">
                    <p className="font-medium">{note.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {note.content}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(note.updatedAt, locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.quickLinks.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickLinks.map((item) => (
              <Button key={item.href} asChild variant="outline" className="justify-start gap-2">
                <Link href={localizeHref(item.href, locale)}>
                  <item.icon data-icon="inline-start" />
                  {messages.quickLinks[item.labelKey]}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
