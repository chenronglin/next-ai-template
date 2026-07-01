import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccountForm } from "@/features/settings/components/delete-account-form";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { getUserPreference } from "@/features/settings/queries";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireUser } from "@/server/require-user";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.settings.metadataTitle,
  };
}

export default async function SettingsPage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const messages = dictionary.settings;
  const preference = await getUserPreference(session.user.id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{messages.title}</h1>
        <p className="mt-2 text-muted-foreground">{messages.description}</p>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">{messages.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            preference={preference}
            locale={locale}
            messages={messages.form}
          />
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTitle>{messages.dangerTitle}</AlertTitle>
        <AlertDescription className="grid gap-3">
          <p>{messages.dangerDescription}</p>
          <DeleteAccountForm
            locale={locale}
            email={session.user.email}
            messages={messages.danger}
          />
        </AlertDescription>
      </Alert>
    </div>
  );
}
