"use client";

import { Button } from "@/components/ui/button";

export default function NotesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border bg-background p-6 text-center">
      <div>
        <h2 className="text-lg font-semibold">Notes 加载失败</h2>
        <p className="mt-2 text-sm text-muted-foreground">请重试或检查数据库连接。</p>
        <Button type="button" className="mt-4" onClick={reset}>
          重试
        </Button>
      </div>
    </div>
  );
}
