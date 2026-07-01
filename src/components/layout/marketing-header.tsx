import Link from "next/link";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const marketingLinks = [
  { href: "/#features", labelKey: "features" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/docs", labelKey: "docs" },
] as const;

type MarketingHeaderProps = {
  locale: Locale;
  messages: Dictionary["common"];
};

export function MarketingHeader({ locale, messages }: MarketingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo locale={locale} />
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {marketingLinks.map((link) => (
            <Link
              key={link.href}
              href={localizeHref(link.href, locale)}
              className="transition-colors hover:text-foreground"
            >
              {messages.nav.marketing[link.labelKey]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher
            locale={locale}
            label={messages.localeSwitcher.label}
            currentLabel={messages.localeSwitcher.current}
          />
          <Button asChild variant="ghost" size="sm">
            <Link href={localizeHref("/sign-in", locale)}>
              {messages.nav.marketing.signIn}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={localizeHref("/sign-up", locale)}>
              {messages.nav.marketing.getStarted}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
