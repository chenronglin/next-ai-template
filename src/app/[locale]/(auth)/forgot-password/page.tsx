import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
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
    title: dictionary.auth.forgotPassword.metadataTitle,
  };
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{dictionary.auth.forgotPassword.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm
          messages={dictionary.auth.forgotPassword.form}
          validationMessages={dictionary.auth.validation}
        />
      </CardContent>
    </Card>
  );
}
