import "server-only";

import { cache } from "react";

import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  "zh-CN": () => import("@/i18n/messages/zh-CN").then((module) => module.zhCNDictionary),
  "en-US": () => import("@/i18n/messages/en-US").then((module) => module.enUSDictionary),
};

// 字典加载只在服务端发生，并用 React cache 避免同一次请求内 layout、page 重复动态 import。
export const getDictionary = cache(async (locale: Locale) => {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  return loader();
});

export type { Dictionary };
