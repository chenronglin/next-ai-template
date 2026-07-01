import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getOAuthProviderStatuses } from "@/features/auth/oauth";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.auth.signIn.metadataTitle,
  };
}

export default async function SignInPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);
  const oauthProviders = getOAuthProviderStatuses();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{dictionary.auth.signIn.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-48 rounded-md bg-muted" />}>
          <SignInForm
            locale={locale}
            messages={dictionary.auth.signIn.form}
            oauthMessages={dictionary.auth.oauth}
            oauthProviders={oauthProviders}
            validationMessages={dictionary.auth.validation}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
