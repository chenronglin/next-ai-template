import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { UpdateProfileForm } from "@/features/profile/components/update-profile-form";
import { getProfileDetails } from "@/features/profile/queries";
import { formatDateTime, getInitials } from "@/lib/format";
import { requireUser } from "@/server/require-user";

export const metadata: Metadata = {
  title: "我的",
};

export default async function MePage() {
  const session = await requireUser();
  const { user, sessions } = await getProfileDetails(session.user.id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">我的账户</h1>
        <p className="mt-2 text-muted-foreground">
          验证认证、会话、表单提交、Zod 校验和 Prisma 更新的完整链路。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">账户摘要</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                创建于 {formatDateTime(user.createdAt)}
              </p>
            </div>
            <Separator />
            <SignOutButton />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">修改个人资料</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm user={user} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">当前登录会话</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {sessions.map((item) => (
              <div key={item.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{item.userAgent ?? "Unknown device"}</p>
                <p className="mt-1 text-muted-foreground">
                  更新于 {formatDateTime(item.updatedAt)}
                </p>
                <p className="mt-1 text-muted-foreground">
                  过期于 {formatDateTime(item.expiresAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="size-4" />
              修改密码
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            MVP 保留入口；接入邮件验证或二次确认后可启用 Better Auth change password。
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
