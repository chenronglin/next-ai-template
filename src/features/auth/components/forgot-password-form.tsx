"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createForgotPasswordSchema } from "@/features/auth/schema";
import type { Dictionary } from "@/i18n/types";

type ForgotPasswordFormProps = {
  messages: Dictionary["auth"]["forgotPassword"]["form"];
  validationMessages: Pick<Dictionary["auth"]["validation"], "invalidEmail">;
};

export function ForgotPasswordForm({
  messages,
  validationMessages,
}: ForgotPasswordFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const parsed = createForgotPasswordSchema(validationMessages).safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? messages.missingEmail);
      return;
    }

    // MVP 只保留入口和校验链路，后续接入邮件服务后在这里调用 Better Auth reset password。
    startTransition(() => {
      toast.info(messages.reserved);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{messages.email}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? messages.submitting : messages.submit}
      </Button>
    </form>
  );
}
