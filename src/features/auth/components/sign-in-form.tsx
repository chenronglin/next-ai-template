"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/features/auth/schema";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rememberMe, setRememberMe] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // 表单提交是明确交互，不需要 effect；先本地 Zod 校验，再调用 Better Auth。
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "登录信息不完整");
      return;
    }

    startTransition(async () => {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      });

      if (result.error) {
        toast.error(result.error.message ?? "登录失败");
        return;
      }

      toast.success("登录成功");
      router.push(searchParams.get("callbackUrl") ?? "/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
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
          <span>记住我</span>
        </label>
        <Link href="/forgot-password" className="text-primary hover:underline">
          忘记密码
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "登录中" : "登录"}
      </Button>
      <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        OAuth 登录区域已预留，可按项目需要接入 GitHub 或 Google。
      </div>
      <p className="text-center text-sm text-muted-foreground">
        还没有账户？{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          注册
        </Link>
      </p>
    </form>
  );
}
