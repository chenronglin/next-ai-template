import Link from "next/link";
import {
  Bot,
  Code2,
  Database,
  KeyRound,
  Layers3,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stackItems = [
  "Next.js App Router",
  "Bun",
  "SQLite",
  "Prisma",
  "Better Auth",
  "AI SDK",
  "shadcn/ui",
  "Zod",
] as const;

const featureItems = [
  {
    icon: KeyRound,
    title: "认证",
    description: "邮箱密码注册登录、会话读取、退出登录和受保护后台。",
  },
  {
    icon: Database,
    title: "CRUD 示例",
    description: "Notes 模块展示 schema、query、action、component 的完整路径。",
  },
  {
    icon: Bot,
    title: "AI 调用",
    description: "Route Handler 中封装 AI SDK streaming，支持 Gateway 模型。",
  },
  {
    icon: Code2,
    title: "Codex-friendly",
    description: "内置 AGENTS.md 和 Skills，约束新增业务模块的开发方式。",
  },
] as const;

export default function MarketingHomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.10),transparent_38%,rgba(245,158,11,0.12))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl content-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5">
              AI-ready SaaS starter
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              Next AI SaaS Starter
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              AI-ready SaaS starter built with Next.js + Bun + Prisma + Better Auth.
              It ships the minimum shared product surface for Codex-driven iteration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/sign-up">注册</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">查看后台 Demo</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-background/92 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <div>
                <p className="text-sm font-medium">Template control room</p>
                <p className="text-xs text-muted-foreground">Next.js 16 · Bun · SQLite</p>
              </div>
              <Badge>Live</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Auth", "Ready", ShieldCheck],
                ["Prisma", "SQLite adapter", Database],
                ["AI SDK", "Streaming", Sparkles],
                ["Codex", "Guided", Terminal],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-md border p-3">
                  <Icon className="mb-4 size-5 text-primary" />
                  <p className="text-sm font-medium">{label as string}</p>
                  <p className="text-xs text-muted-foreground">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border bg-muted/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Layers3 className="size-4 text-primary" />
                Feature route map
              </div>
              <div className="grid gap-2 text-xs text-muted-foreground">
                <span>/dashboard · protected server page</span>
                <span>/examples/notes · Zod + Server Actions</span>
                <span>/api/ai/chat · streaming Route Handler</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" id="features">
        <div className="grid gap-4 md:grid-cols-4">
          {stackItems.map((item) => (
            <Card key={item} className="rounded-lg">
              <CardContent className="p-4 text-sm font-medium">{item}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/25">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-4">
          {featureItems.map((item) => (
            <Card key={item.title} className="rounded-lg">
              <CardHeader>
                <item.icon className="size-5 text-primary" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
