"use client";

import { Button } from "@/components/ui/button";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-96 place-items-center rounded-lg border bg-background p-6 text-center">
      <div>
        <h2 className="text-lg font-semibold">后台页面加载失败</h2>
        <p className="mt-2 text-sm text-muted-foreground">请重试，或检查认证和数据库配置。</p>
        <Button type="button" className="mt-4" onClick={reset}>
          重试
        </Button>
      </div>
    </div>
  );
}
