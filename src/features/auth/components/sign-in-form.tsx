"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSignInSchema } from "@/features/auth/schema";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { authClient } from "@/lib/auth-client";

type SignInFormProps = {
  locale: Locale;
  messages: Dictionary["auth"]["signIn"]["form"];
  validationMessages: Pick<
    Dictionary["auth"]["validation"],
    "invalidEmail" | "passwordMin"
  >;
};

export function SignInForm({
  locale,
  messages,
  validationMessages,
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rememberMe, setRememberMe] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // 表单提交是明确交互，不需要 effect；先本地 Zod 校验，再调用 Better Auth。
    const parsed = createSignInSchema(validationMessages).safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? messages.incomplete);
      return;
    }

    startTransition(async () => {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      });

      if (result.error) {
        toast.error(result.error.message ?? messages.failure);
        return;
      }

      toast.success(messages.success);
      router.push(getSafeCallbackUrl(searchParams.get("callbackUrl"), locale));
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{messages.email}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{messages.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
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
      <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        {messages.oauthPlaceholder}
      </div>
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
