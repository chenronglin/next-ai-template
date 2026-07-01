"use client";

import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createForgotPasswordSchema } from "@/features/auth/schema";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type ForgotPasswordFormProps = {
  locale: Locale;
  messages: Dictionary["auth"]["forgotPassword"]["form"];
  validationMessages: Pick<Dictionary["auth"]["validation"], "invalidEmail">;
};

export function ForgotPasswordForm({
  locale,
  messages,
  validationMessages,
}: ForgotPasswordFormProps) {
  const [emailError, setEmailError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 密码重置失败时保留用户输入，避免用户重新键入邮箱。
    event.preventDefault();
    setEmailError("");
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    const parsed = createForgotPasswordSchema(validationMessages).safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? messages.missingEmail);
      return;
    }

    startTransition(async () => {
      // Better Auth 对不存在的邮箱也返回统一成功，前端展示同一提示，避免账户枚举。
      const result = await authClient.requestPasswordReset({
        email: parsed.data.email,
        redirectTo: localizeHref("/reset-password", locale),
      });

      if (result.error) {
        setEmailError(messages.failure);
        return;
      }

      setStatusMessage(messages.success);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">{messages.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          onChange={() => setEmailError("")}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "forgot-password-email-error" : undefined}
        />
        {emailError ? (
          <p id="forgot-password-email-error" className="text-sm text-destructive">
            {emailError}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? messages.submitting : messages.submit}
      </Button>
      {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}
    </form>
  );
}
