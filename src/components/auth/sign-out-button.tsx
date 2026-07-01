"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    // 退出登录是用户交互触发的副作用，放在事件处理器里比 effect 更稳定。
    startTransition(async () => {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message ?? "退出登录失败");
        return;
      }

      toast.success("已退出登录");
      router.push("/");
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
      {isPending ? "退出中" : "退出"}
    </Button>
  );
}
