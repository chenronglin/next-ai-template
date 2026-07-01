"use client";

import { CircleUserRound, Globe } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type {
  OAuthProviderId,
  OAuthProviderStatus,
} from "@/features/auth/oauth-types";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type OAuthButtonsProps = {
  locale: Locale;
  mode: "sign-in" | "sign-up";
  providers: OAuthProviderStatus[];
  messages: Dictionary["auth"]["oauth"];
};

const providerIcons = {
  github: CircleUserRound,
  google: Globe,
} satisfies Record<OAuthProviderId, typeof CircleUserRound>;

export function OAuthButtons({
  locale,
  mode,
  providers,
  messages,
}: OAuthButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function handleOAuth(provider: OAuthProviderStatus) {
    if (!provider.enabled || isPending) {
      return;
    }

    startTransition(async () => {
      // OAuth 跳转和 state 校验由 Better Auth 处理，前端只传 provider 和本地化回调地址。
      const result = await authClient.signIn.social({
        provider: provider.id,
        callbackURL: localizeHref("/dashboard", locale),
        errorCallbackURL: localizeHref("/sign-in", locale),
      });

      if (result.error) {
        toast.error(messages.failure);
      }
    });
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted-foreground">
        <Separator />
        <span>{messages.divider}</span>
        <Separator />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {providers.map((provider) => {
          const Icon = providerIcons[provider.id];
          // 同一组按钮同时服务登录和注册页，按钮动词按场景切换，provider 名称来自服务端状态。
          const labelTemplate =
            mode === "sign-in" ? messages.signInWith : messages.signUpWith;
          const label = labelTemplate.replace("{provider}", provider.label);

          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              disabled={!provider.enabled || isPending}
              title={provider.enabled ? label : messages.unavailable}
              onClick={() => handleOAuth(provider)}
            >
              <Icon data-icon="inline-start" />
              {provider.enabled ? label : messages.unavailableWith.replace(
                "{provider}",
                provider.label,
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
