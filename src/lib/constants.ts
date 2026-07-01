import { localeLabels, locales } from "@/i18n/config";

// 这些常量同时供 Zod schema、表单选项和页面展示复用，避免同一组枚举在多处手写。
export const themeValues = ["system", "light", "dark"] as const;

// 语言枚举直接复用 i18n 配置，新增语种时只需要扩展 locale 配置和字典。
export const languageValues = locales;

export const aiModelValues = [
  "openai/gpt-4o-mini",
  "openai/gpt-4.1-mini",
  "anthropic/claude-3-5-haiku",
] as const;

export const themeLabels: Record<(typeof themeValues)[number], string> = {
  system: "跟随系统",
  light: "浅色",
  dark: "深色",
};

export const languageLabels: Record<(typeof languageValues)[number], string> = {
  ...localeLabels,
};

export const aiModelLabels: Record<(typeof aiModelValues)[number], string> = {
  "openai/gpt-4o-mini": "GPT-4o mini",
  "openai/gpt-4.1-mini": "GPT-4.1 mini",
  "anthropic/claude-3-5-haiku": "Claude 3.5 Haiku",
};

// 后台导航集中声明，AppShell 与快速入口可以共享同一份路由事实源；展示文案由当前 locale 的字典提供。
export const appNavigation = [
  { href: "/dashboard", labelKey: "dashboard" },
  { href: "/me", labelKey: "me" },
  { href: "/settings", labelKey: "settings" },
  { href: "/examples/notes", labelKey: "notes" },
  { href: "/ai", labelKey: "ai" },
] as const;
