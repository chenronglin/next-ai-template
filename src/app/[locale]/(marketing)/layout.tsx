import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader locale={locale} messages={dictionary.common} />
      {children}
      <MarketingFooter
        locale={locale}
        messages={dictionary.common.nav.footer}
        brand={dictionary.common.brand}
      />
    </div>
  );
}
