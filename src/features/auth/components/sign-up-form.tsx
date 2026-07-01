"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

export function SignUpForm({
  locale,
  messages,
  validationMessages,
}: SignUpFormProps) {
  const router = useRouter();
  const [terms, setTerms] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // Better Auth 会做最终认证校验；这里先用 Zod 给用户即时、统一的表单错误。
    const parsed = createSignUpSchema(validationMessages).safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      terms,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? messages.incomplete);
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
        toast.error(result.error.message ?? messages.failure);
        return;
      }

      toast.success(messages.success);
      router.push(localizeHref("/dashboard", locale));
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{messages.name}</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
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
          autoComplete="new-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{messages.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={terms} onCheckedChange={(checked) => setTerms(checked === true)} />
        <span>{messages.terms}</span>
      </label>
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
