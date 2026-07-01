"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/features/auth/schema";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const parsed = forgotPasswordSchema.safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "请输入邮箱");
      return;
    }

    // MVP 只保留入口和校验链路，后续接入邮件服务后在这里调用 Better Auth reset password。
    startTransition(() => {
      toast.info("重置密码邮件功能已预留，请接入邮件服务后启用。");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "处理中" : "发送重置邮件"}
      </Button>
    </form>
  );
}
