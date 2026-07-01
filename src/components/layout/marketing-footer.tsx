import Link from "next/link";

import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type MarketingFooterProps = {
  locale: Locale;
  messages: Dictionary["common"]["nav"]["footer"];
  brand: string;
};

export function MarketingFooter({ locale, messages, brand }: MarketingFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {year} {brand}. {messages.license}.</p>
        <div className="flex flex-wrap gap-4">
          <Link href={localizeHref("/docs", locale)} className="hover:text-foreground">
            {messages.docs}
          </Link>
          <Link href="https://github.com" className="hover:text-foreground">
            {messages.github}
          </Link>
          <Link href={localizeHref("/pricing", locale)} className="hover:text-foreground">
            {messages.pricing}
          </Link>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
