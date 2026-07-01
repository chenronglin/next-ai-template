"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import type { OAuthProviderStatus } from "@/features/auth/oauth-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSignInSchema } from "@/features/auth/schema";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type SignInFormProps = {
  locale: Locale;
  messages: Dictionary["auth"]["signIn"]["form"];
  oauthMessages: Dictionary["auth"]["oauth"];
  oauthProviders: OAuthProviderStatus[];
  validationMessages: Pick<
    Dictionary["auth"]["validation"],
    "invalidEmail" | "passwordMin"
  >;
};

// 登录只有邮箱和密码两个可纠正字段；认证失败也会收敛到其中一个字段下展示。
type SignInFieldErrors = Partial<Record<"email" | "password", string>>;

export function SignInForm({
  locale,
  messages,
  oauthMessages,
  oauthProviders,
  validationMessages,
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rememberMe, setRememberMe] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [statusMessage, setStatusMessage] = useState(
    searchParams.get("deleted") ? messages.accountDeleted : "",
  );
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  function clearFieldError(field: keyof SignInFieldErrors) {
    // 用户修改字段时只清理当前字段的旧错误，保留其他字段错误，避免表单反馈突然全部消失。
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
    // 登录失败时保留邮箱和密码输入；不用 form action，避免 React 在 action 返回后重置 uncontrolled 输入框。
    event.preventDefault();

    // 每次提交前清空旧错误，避免用户修正输入后仍看到上一轮字段提示。
    setFieldErrors({});
    setStatusMessage("");
    setVerificationEmail(null);

    const formData = new FormData(event.currentTarget);

    // 表单提交是明确交互，不需要 effect；先本地 Zod 校验，再调用 Better Auth。
    const parsed = createSignInSchema(validationMessages).safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const hasFieldError = Boolean(errors.email?.[0] || errors.password?.[0]);

      // 登录页只展示邮箱和密码两个字段错误；字段缺失时用表单级兜底文案落到邮箱下方。
      setFieldErrors({
        email: errors.email?.[0] ?? (!hasFieldError ? messages.incomplete : undefined),
        password: errors.password?.[0],
      });
      return;
    }

    startTransition(async () => {
      const callbackURL = getSafeCallbackUrl(searchParams.get("callbackUrl"), locale);
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
        callbackURL,
      });

      if (result.error) {
        if (result.error.code === "EMAIL_NOT_VERIFIED") {
          // Better Auth 在未验证邮箱时会自动触发一封验证邮件；这里给用户一个字段级、可操作的提示。
          setVerificationEmail(parsed.data.email);
          setFieldErrors({ email: messages.emailNotVerified });
          return;
        }

        // 登录失败不暴露“邮箱是否存在”，统一提示到密码框下方，符合主流产品的安全反馈方式。
        setFieldErrors({ password: messages.authFailure });
        return;
      }

      toast.success(messages.success);
      router.push(callbackURL);
      router.refresh();
    });
  }

  function handleResendVerification() {
    if (!verificationEmail) {
      return;
    }

    startResendTransition(async () => {
      // 重发接口对不存在或已验证邮箱也返回统一结果，避免前端泄漏账户枚举信息。
      const result = await authClient.sendVerificationEmail({
        email: verificationEmail,
        callbackURL: localizeHref("/dashboard", locale),
      });

      if (result.error) {
        setFieldErrors({ email: messages.resendVerificationFailure });
        return;
      }

      setStatusMessage(messages.resendVerificationSuccess);
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
          onChange={() => clearFieldError("email")}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "sign-in-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="sign-in-email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        ) : null}
        {verificationEmail ? (
          <Button
            type="button"
            variant="link"
            className="h-auto w-fit px-0"
            disabled={isResending}
            onClick={handleResendVerification}
          >
            {isResending
              ? messages.resendVerificationSubmitting
              : messages.resendVerification}
          </Button>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{messages.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          onChange={() => clearFieldError("password")}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "sign-in-password-error" : undefined}
        />
        {fieldErrors.password ? (
          <p id="sign-in-password-error" className="text-sm text-destructive">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <span>{messages.rememberMe}</span>
        </label>
        <Link
          href={localizeHref("/forgot-password", locale)}
          className="text-primary hover:underline"
        >
          {messages.forgotPassword}
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? messages.submitting : messages.submit}
      </Button>
      {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}
      <OAuthButtons
        locale={locale}
        mode="sign-in"
        providers={oauthProviders}
        messages={oauthMessages}
      />
      <p className="text-center text-sm text-muted-foreground">
        {messages.noAccount}{" "}
        <Link href={localizeHref("/sign-up", locale)} className="text-primary hover:underline">
          {messages.signUp}
        </Link>
      </p>
    </form>
  );
}

function getSafeCallbackUrl(callbackUrl: string | null, locale: Locale) {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return localizeHref("/dashboard", locale);
  }

  // callbackUrl 来自 URL 查询参数，只允许站内路径，避免登录后跳到外部地址。
  return localizeHref(callbackUrl, locale);
}
