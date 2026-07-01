"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n/config";

type LocaleDocumentSyncProps = {
  locale: Locale;
};

export function LocaleDocumentSync({ locale }: LocaleDocumentSyncProps) {
  useEffect(() => {
    // 根 layout 是静态的，客户端语言切换后需要同步 html[lang]，方便浏览器、无障碍工具和样式选择器读取当前语言。
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
