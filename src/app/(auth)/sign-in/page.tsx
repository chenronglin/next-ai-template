import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "登录",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>登录后台</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-48 rounded-md bg-muted" />}>
          <SignInForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
