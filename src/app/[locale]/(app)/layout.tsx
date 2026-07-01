import { AppShell } from "@/components/layout/app-shell";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireUser } from "@/server/require-user";

export default async function ProtectedAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);

  return (
    <AppShell
      user={session.user}
      locale={locale}
      messages={{
        common: dictionary.common,
        appShell: dictionary.appShell,
      }}
    >
      {children}
    </AppShell>
  );
}
