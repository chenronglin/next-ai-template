"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResetPasswordSchema } from "@/features/auth/schema";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type ResetPasswordFormProps = {
  locale: Locale;
  token?: string;
  hasTokenError: boolean;
  messages: Dictionary["auth"]["resetPassword"]["form"];
  validationMessages: Pick<
    Dictionary["auth"]["validation"],
    "passwordMin" | "confirmPasswordMin" | "passwordMismatch"
  >;
};

type ResetPasswordFieldErrors = Partial<
  Record<"password" | "confirmPassword" | "token", string>
>;

export function ResetPasswordForm({
  locale,
  token,
  hasTokenError,
  messages,
  validationMessages,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>(
    hasTokenError || !token ? { token: messages.invalidToken } : {},
  );
  const [isPending, startTransition] = useTransition();

  function clearFieldError(field: keyof ResetPasswordFieldErrors) {
    // 只清理正在编辑字段的错误，避免确认密码错误被输入新密码时过早隐藏。
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 重置失败时保留两次密码输入，让用户可以直接修正。
    event.preventDefault();
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = createResetPasswordSchema(validationMessages).safeParse({
      token,
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        token: errors.token?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      });
      return;
    }

    startTransition(async () => {
      // token 由 Better Auth 一次性消费；成功后其他会话会按服务端配置被撤销。
      const result = await authClient.resetPassword({
        token: parsed.data.token,
        newPassword: parsed.data.password,
      });

      if (result.error) {
        setFieldErrors({ token: messages.invalidToken });
        return;
      }

      toast.success(messages.success);
      router.push(localizeHref("/sign-in", locale));
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {fieldErrors.token ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {fieldErrors.token}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="password">{messages.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={!token || hasTokenError}
          onChange={() => clearFieldError("password")}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "reset-password-password-error" : undefined
          }
        />
        {fieldErrors.password ? (
          <p id="reset-password-password-error" className="text-sm text-destructive">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{messages.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={!token || hasTokenError}
          onChange={() => clearFieldError("confirmPassword")}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword
              ? "reset-password-confirm-password-error"
              : undefined
          }
        />
        {fieldErrors.confirmPassword ? (
          <p
            id="reset-password-confirm-password-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isPending || !token || hasTokenError}>
        {isPending ? messages.submitting : messages.submit}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href={localizeHref("/sign-in", locale)} className="text-primary hover:underline">
          {messages.backToSignIn}
        </Link>
      </p>
    </form>
  );
}
