import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docsItems = [
  "使用 Bun，不使用 npm/pnpm/yarn。",
  "使用 App Router 和 Server Components，只有交互组件声明 use client。",
  "业务数据访问只通过 Prisma，SQLite adapter 集中在 src/lib/db.ts。",
  "所有表单、Server Action、Route Handler 输入都先过 Zod。",
  "新增业务模块放入 src/features/<module>。",
] as const;

export const metadata: Metadata = {
  title: "Docs",
};

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Project Docs</h1>
      <p className="mt-3 text-muted-foreground">
        这里摘要展示模板约束，完整规则见仓库根目录 AGENTS.md 和 skills 目录。
      </p>
      <Card className="mt-8 rounded-lg">
        <CardHeader>
          <CardTitle>Codex 开发边界</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {docsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
