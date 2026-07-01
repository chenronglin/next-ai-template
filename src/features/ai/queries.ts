import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";

export const getAiHistory = cache(async (userId: string) => {
  return db.aiConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 8,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 2,
      },
    },
  });
});

export const countAiConversations = cache(async (userId: string) => {
  return db.aiConversation.count({
    where: { userId },
  });
});
