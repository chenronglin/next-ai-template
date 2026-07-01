import Link from "next/link";

import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { getLocaleFromRouteParams, localizeHref, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-muted/25">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Logo locale={locale} />
          <div className="flex items-center gap-2">
            <LocaleSwitcher
              locale={locale}
              label={dictionary.common.localeSwitcher.label}
              currentLabel={dictionary.common.localeSwitcher.current}
            />
            <Link
              href={localizeHref("/", locale)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {dictionary.auth.layout.backHome}
            </Link>
          </div>
        </div>
        <div className="grid flex-1 place-items-center py-10">{children}</div>
      </div>
    </main>
  );
}
