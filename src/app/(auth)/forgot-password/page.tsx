import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "忘记密码",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>重置密码</CardTitle>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
