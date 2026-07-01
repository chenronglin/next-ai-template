import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
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
    title: dictionary.auth.signUp.metadataTitle,
  };
}

export default async function SignUpPage({
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
        <CardTitle>{dictionary.auth.signUp.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm
          locale={locale}
          messages={dictionary.auth.signUp.form}
          oauthMessages={dictionary.auth.oauth}
          oauthProviders={oauthProviders}
          validationMessages={dictionary.auth.validation}
        />
      </CardContent>
    </Card>
  );
}
