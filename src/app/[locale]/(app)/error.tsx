"use client";

import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getPathLocale, resolveLocale } from "@/i18n/config";
import { enUSDictionary } from "@/i18n/messages/en-US";
import { zhCNDictionary } from "@/i18n/messages/zh-CN";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = resolveLocale(getPathLocale(usePathname()));
  // error.tsx 运行在客户端，直接用内置字典按路径选择文案，避免错误态再触发异步加载。
  const dictionary = locale === "en-US" ? enUSDictionary : zhCNDictionary;
  const messages = dictionary.errors.app;

  return (
    <div className="grid min-h-96 place-items-center rounded-lg border bg-background p-6 text-center">
      <div>
        <h2 className="text-lg font-semibold">{messages.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{messages.description}</p>
        <Button type="button" className="mt-4" onClick={reset}>
          {dictionary.common.actions.retry}
        </Button>
      </div>
    </div>
  );
}
