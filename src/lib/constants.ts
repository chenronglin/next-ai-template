// 这些常量同时供 Zod schema、表单选项和页面展示复用，避免同一组枚举在多处手写。
export const themeValues = ["system", "light", "dark"] as const;

export const languageValues = ["zh-CN", "en-US"] as const;

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
  "zh-CN": "简体中文",
  "en-US": "English",
};

export const aiModelLabels: Record<(typeof aiModelValues)[number], string> = {
  "openai/gpt-4o-mini": "GPT-4o mini",
  "openai/gpt-4.1-mini": "GPT-4.1 mini",
  "anthropic/claude-3-5-haiku": "Claude 3.5 Haiku",
};

// 后台导航集中声明，AppShell 与快速入口可以共享同一份路由事实源。
export const appNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/me", label: "我的" },
  { href: "/settings", label: "设置" },
  { href: "/examples/notes", label: "Notes" },
  { href: "/ai", label: "AI" },
] as const;
