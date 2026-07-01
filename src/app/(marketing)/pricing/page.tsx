import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="mt-3 text-muted-foreground">
          MVP 模板不内置支付，保留清晰的商业化扩展入口。
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Starter", "Growth", "Scale"].map((plan) => (
          <Card key={plan} className="rounded-lg">
            <CardHeader>
              <CardTitle>{plan}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                用于展示未来 Stripe 或 Lemon Squeezy 集成位置。
              </p>
              <Button asChild className="w-full" variant={plan === "Growth" ? "default" : "outline"}>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
