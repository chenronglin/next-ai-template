import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ResetPasswordSearchParams = Promise<{
  token?: string;
  error?: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.auth.resetPassword.metadataTitle,
  };
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: LocaleRouteParams;
  searchParams: ResetPasswordSearchParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, query] = await Promise.all([
    getDictionary(locale),
    searchParams,
  ]);

  // Better Auth 校验 reset token 后才会回跳到这个页面；error 存在时说明 token 无效或过期。
  const token = typeof query.token === "string" ? query.token : undefined;
  const hasTokenError = Boolean(query.error);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{dictionary.auth.resetPassword.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm
          locale={locale}
          token={token}
          hasTokenError={hasTokenError}
          messages={dictionary.auth.resetPassword.form}
          validationMessages={dictionary.auth.validation}
        />
      </CardContent>
    </Card>
  );
}
