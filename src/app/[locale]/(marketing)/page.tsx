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
import { getLocaleFromRouteParams, localizeHref, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const featureItems = [
  {
    key: "auth",
    icon: KeyRound,
  },
  {
    key: "crud",
    icon: Database,
  },
  {
    key: "ai",
    icon: Bot,
  },
  {
    key: "codex",
    icon: Code2,
  },
] as const;

const controlRoomIcons = [ShieldCheck, Database, Sparkles, Terminal] as const;

export default async function MarketingHomePage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);
  const messages = dictionary.marketing.home;

  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.10),transparent_38%,rgba(245,158,11,0.12))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl content-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5">
              {messages.badge}
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              {messages.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {messages.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={localizeHref("/sign-up", locale)}>{messages.primaryCta}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={localizeHref("/dashboard", locale)}>
                  {messages.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-background/92 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <div>
                <p className="text-sm font-medium">{messages.controlRoom.title}</p>
                <p className="text-xs text-muted-foreground">{messages.controlRoom.subtitle}</p>
              </div>
              <Badge>{messages.controlRoom.status}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {messages.controlRoom.items.map((item, index) => {
                const Icon = controlRoomIcons[index] ?? ShieldCheck;

                return (
                  <div key={item.label} className="rounded-md border p-3">
                    <Icon className="mb-4 size-5 text-primary" />
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-md border bg-muted/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Layers3 className="size-4 text-primary" />
                {messages.controlRoom.routeMapTitle}
              </div>
              <div className="grid gap-2 text-xs text-muted-foreground">
                {messages.controlRoom.routes.map((route) => (
                  <span key={route}>{route}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" id="features">
        <div className="grid gap-4 md:grid-cols-4">
          {messages.stackItems.map((item) => (
            <Card key={item} className="rounded-lg">
              <CardContent className="p-4 text-sm font-medium">{item}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/25">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-4">
          {featureItems.map((item) => (
            <Card key={item.key} className="rounded-lg">
              <CardHeader>
                <item.icon className="size-5 text-primary" />
                <CardTitle className="text-base">
                  {messages.features[item.key].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {messages.features[item.key].description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
