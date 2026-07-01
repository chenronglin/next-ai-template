import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/25">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            返回首页
          </Link>
        </div>
        <div className="grid flex-1 place-items-center py-10">{children}</div>
      </div>
    </main>
  );
}
