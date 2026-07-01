"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema } from "@/features/auth/schema";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const router = useRouter();
  const [terms, setTerms] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // Better Auth 会做最终认证校验；这里先用 Zod 给用户即时、统一的表单错误。
    const parsed = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      terms,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "注册信息不完整");
      return;
    }

    startTransition(async () => {
      const result = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        toast.error(result.error.message ?? "注册失败");
        return;
      }

      toast.success("注册成功");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">显示名称</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
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
          autoComplete="new-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认密码</Label>
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
        <span>我同意服务条款和隐私政策</span>
      </label>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "注册中" : "注册"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        已有账户？{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
