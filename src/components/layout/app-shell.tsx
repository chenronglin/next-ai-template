import Link from "next/link";
import { Bot, Database, LayoutDashboard, Settings, UserRound } from "lucide-react";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { appNavigation } from "@/lib/constants";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  locale: Locale;
  messages: {
    common: Dictionary["common"];
    appShell: Dictionary["appShell"];
  };
};

const navIconMap = {
  "/dashboard": LayoutDashboard,
  "/me": UserRound,
  "/settings": Settings,
  "/examples/notes": Database,
  "/ai": Bot,
} as const;

export function AppShell({ children, user, locale, messages }: AppShellProps) {
  return (
    <div className="min-h-screen bg-muted/25">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-14 items-center px-4">
          <Logo locale={locale} />
        </div>
        <Separator />
        <nav className="space-y-1 p-3">
          {appNavigation.map((item) => {
            const Icon = navIconMap[item.href];

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn("w-full justify-start gap-2")}
              >
                <Link href={localizeHref(item.href, locale)}>
                  <Icon data-icon="inline-start" />
                  {messages.common.nav.app[item.labelKey]}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              <Logo locale={locale} />
            </div>
            <nav className="hidden items-center gap-2 lg:flex">
              {appNavigation.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link href={localizeHref(item.href, locale)}>
                    {messages.common.nav.app[item.labelKey]}
                  </Link>
                </Button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <LocaleSwitcher
                locale={locale}
                label={messages.common.localeSwitcher.label}
                currentLabel={messages.common.localeSwitcher.current}
              />
              <Avatar className="size-8">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium leading-none">{user.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
              </div>
              <SignOutButton locale={locale} messages={messages.appShell.signOut} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
