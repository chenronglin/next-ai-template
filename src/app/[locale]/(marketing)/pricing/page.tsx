import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocaleFromRouteParams, localizeHref, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.marketing.pricing.metadataTitle,
  };
}

export default async function PricingPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);
  const messages = dictionary.marketing.pricing;

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold">{messages.title}</h1>
        <p className="mt-3 text-muted-foreground">{messages.description}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {messages.plans.map((plan) => (
          <Card key={plan.name} className="rounded-lg">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <Button
                asChild
                className="w-full"
                variant={plan.name === "Growth" ? "default" : "outline"}
              >
                <Link href={localizeHref("/sign-up", locale)}>{messages.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
