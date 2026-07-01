"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSignUpSchema } from "@/features/auth/schema";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type SignUpFormProps = {
  locale: Locale;
  messages: Dictionary["auth"]["signUp"]["form"];
  validationMessages: Dictionary["auth"]["validation"];
};

// 注册表单把每个用户可修正的问题绑定到具体字段，便于在输入框下方展示。
type SignUpFieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>
>;

export function SignUpForm({
  locale,
  messages,
  validationMessages,
}: SignUpFormProps) {
  const router = useRouter();
  const [terms, setTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function clearFieldError(field: keyof SignUpFieldErrors) {
    // 字段重新编辑时只清掉对应错误；其他字段的校验结果继续保留，用户能逐项修正。
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
    // 注册失败时必须保留用户已输入内容；不要使用 form action，避免 React 在 action 返回后重置 uncontrolled 输入框。
    event.preventDefault();

    // 每次提交前清空旧错误，保证输入框下方只展示当前这轮校验结果。
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    // Better Auth 会做最终认证校验；这里先用 Zod 给用户即时、统一的表单错误。
    const parsed = createSignUpSchema(validationMessages).safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      terms,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const hasFieldError = Boolean(
        errors.name?.[0] ||
          errors.email?.[0] ||
          errors.password?.[0] ||
          errors.confirmPassword?.[0] ||
          errors.terms?.[0],
      );

      // Zod 的字段错误直接映射到各输入框下方；没有字段错误时才使用邮箱下方的兜底文案。
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0] ?? (!hasFieldError ? messages.incomplete : undefined),
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
        terms: errors.terms?.[0],
      });
      return;
    }

    startTransition(async () => {
      const result = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: localizeHref("/dashboard", locale),
      });

      if (result.error) {
        // 注册失败最常见是邮箱已存在或被认证服务拒绝，统一放在邮箱字段下方，避免顶部 toast 太笼统。
        setFieldErrors({ email: messages.emailUnavailable });
        return;
      }

      toast.success(messages.success);
      router.push(localizeHref("/dashboard", locale));
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">{messages.name}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          onChange={() => clearFieldError("name")}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "sign-up-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="sign-up-name-error" className="text-sm text-destructive">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{messages.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          onChange={() => clearFieldError("email")}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "sign-up-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="sign-up-email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{messages.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          onChange={() => clearFieldError("password")}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "sign-up-password-error" : undefined}
        />
        {fieldErrors.password ? (
          <p id="sign-up-password-error" className="text-sm text-destructive">
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
          onChange={() => clearFieldError("confirmPassword")}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword ? "sign-up-confirm-password-error" : undefined
          }
        />
        {fieldErrors.confirmPassword ? (
          <p id="sign-up-confirm-password-error" className="text-sm text-destructive">
            {fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={terms}
            onCheckedChange={(checked) => {
              clearFieldError("terms");
              setTerms(checked === true);
            }}
            aria-invalid={Boolean(fieldErrors.terms)}
            aria-describedby={fieldErrors.terms ? "sign-up-terms-error" : undefined}
          />
          <span>{messages.terms}</span>
        </label>
        {fieldErrors.terms ? (
          <p id="sign-up-terms-error" className="text-sm text-destructive">
            {fieldErrors.terms}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? messages.submitting : messages.submit}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {messages.hasAccount}{" "}
        <Link href={localizeHref("/sign-in", locale)} className="text-primary hover:underline">
          {messages.signIn}
        </Link>
      </p>
    </form>
  );
}
