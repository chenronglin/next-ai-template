import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "注册",
};

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>创建账户</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
