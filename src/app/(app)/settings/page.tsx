import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { getUserPreference } from "@/features/settings/queries";
import { requireUser } from "@/server/require-user";

export const metadata: Metadata = {
  title: "设置",
};

export default async function SettingsPage() {
  const session = await requireUser();
  const preference = await getUserPreference(session.user.id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">设置</h1>
        <p className="mt-2 text-muted-foreground">
          保存主题、默认 AI 模型、语言和通知偏好。
        </p>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">偏好设置</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm preference={preference} />
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTitle>危险区</AlertTitle>
        <AlertDescription>
          删除账户在 MVP 中仅保留 UI 占位，生产启用前需要二次确认、数据导出和审计策略。
        </AlertDescription>
      </Alert>
    </div>
  );
}
