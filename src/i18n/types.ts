import type { Dictionary } from "@/i18n/messages/zh-CN";

// 共享字典类型独立于 server-only 的加载器，Client Component 可以安全地进行 type-only import。
export type { Dictionary };
