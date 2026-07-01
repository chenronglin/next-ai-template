import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { UpdateProfileForm } from "@/features/profile/components/update-profile-form";
import { getProfileDetails } from "@/features/profile/queries";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDateTime, getInitials } from "@/lib/format";
import { requireUser } from "@/server/require-user";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.profile.metadataTitle,
  };
}

export default async function MePage({
  params,
}: {
  params: LocaleRouteParams;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const messages = dictionary.profile;
  const { user, sessions } = await getProfileDetails(session.user.id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{messages.title}</h1>
        <p className="mt-2 text-muted-foreground">{messages.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.summaryTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {messages.createdAt.replace(
                  "{date}",
                  formatDateTime(user.createdAt, locale),
                )}
              </p>
            </div>
            <Separator />
            <SignOutButton locale={locale} messages={dictionary.appShell.signOut} />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.editTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm
              user={user}
              locale={locale}
              messages={messages.form}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">{messages.sessionsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {sessions.map((item) => (
              <div key={item.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{item.userAgent ?? messages.unknownDevice}</p>
                <p className="mt-1 text-muted-foreground">
                  {messages.updatedAt.replace(
                    "{date}",
                    formatDateTime(item.updatedAt, locale),
                  )}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {messages.expiresAt.replace(
                    "{date}",
                    formatDateTime(item.expiresAt, locale),
                  )}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="size-4" />
              {messages.changePasswordTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm
              locale={locale}
              messages={messages.changePassword}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
