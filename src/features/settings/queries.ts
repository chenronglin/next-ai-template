import "server-only";

import { cache } from "react";

import type { userPreference } from "@/generated/prisma/client";
import { defaultLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { aiModelValues } from "@/lib/constants";

export type PreferenceView = Pick<
  userPreference,
  "theme" | "defaultModel" | "language" | "notifications"
>;

const defaultPreference: PreferenceView = {
  theme: "system",
  defaultModel: aiModelValues[0],
  language: defaultLocale,
  notifications: true,
};

// 读偏好时不主动写库，避免 Server Component 渲染阶段产生隐藏 mutation。
export const getUserPreference = cache(async (userId: string) => {
  const preference = await db.userPreference.findUnique({
    where: { userId },
    select: {
      theme: true,
      defaultModel: true,
      language: true,
      notifications: true,
    },
  });

  return preference ?? defaultPreference;
});
