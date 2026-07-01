"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type SignOutButtonProps = {
  locale: Locale;
  messages: Dictionary["appShell"]["signOut"];
};

export function SignOutButton({ locale, messages }: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    // 退出登录是用户交互触发的副作用，放在事件处理器里比 effect 更稳定。
    startTransition(async () => {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message ?? messages.failure);
        return;
      }

      toast.success(messages.success);
      router.push(localizeHref("/", locale));
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
    >
      <LogOut data-icon="inline-start" />
      {isPending ? messages.pending : messages.button}
    </Button>
  );
}
