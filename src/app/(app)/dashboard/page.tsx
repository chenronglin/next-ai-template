import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Database, Settings, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countAiConversations } from "@/features/ai/queries";
import { countNotes, getRecentNotes } from "@/features/notes/queries";
import { getUserPreference } from "@/features/settings/queries";
import { aiModelLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { requireUser } from "@/server/require-user";

export const metadata: Metadata = {
  title: "Dashboard",
};

const quickLinks = [
  { href: "/me", label: "我的", icon: UserRound },
  { href: "/settings", label: "设置", icon: Settings },
  { href: "/examples/notes", label: "数据库示例", icon: Database },
  { href: "/ai", label: "AI 示例", icon: Bot },
] as const;

export default async function DashboardPage() {
  const session = await requireUser();

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
          <Badge variant="secondary">Protected dashboard</Badge>
          <h1 className="mt-3 text-3xl font-semibold">欢迎，{session.user.name}</h1>
          <p className="mt-2 text-muted-foreground">
            当前账户 {session.user.email} 已通过 Better Auth 会话校验。
          </p>
        </div>
        <Button asChild>
          <Link href="/examples/notes">创建示例资源</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">模板状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Next.js App Router 已启用</p>
            <p>Prisma SQLite adapter 已配置</p>
            <p>Better Auth 邮箱密码认证已配置</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{noteCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">当前用户创建的 Note</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{aiCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              默认模型 {aiModelLabels[preference.defaultModel as keyof typeof aiModelLabels]}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">最近创建的 Note</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                暂无 Note。去数据库示例页创建第一条资源。
              </p>
            ) : (
              <div className="grid gap-3">
                {recentNotes.map((note) => (
                  <div key={note.id} className="rounded-md border p-3">
                    <p className="font-medium">{note.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {note.content}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(note.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">快速链接</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickLinks.map((item) => (
              <Button key={item.href} asChild variant="outline" className="justify-start gap-2">
                <Link href={item.href}>
                  <item.icon data-icon="inline-start" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
