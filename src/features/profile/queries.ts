import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";

export const getProfileDetails = cache(async (userId: string) => {
  // 用户资料、会话、偏好互不依赖，使用 Promise.all 避免串行等待。
  const [user, sessions, preference] = await Promise.all([
    db.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),
    db.session.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        updatedAt: true,
      },
    }),
    db.userPreference.findUnique({
      where: { userId },
    }),
  ]);

  return { user, sessions, preference };
});
