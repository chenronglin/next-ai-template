import "server-only";

import { cache } from "react";

import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export const getNotes = cache(async (userId: string, query: string) => {
  const where: Prisma.noteWhereInput = {
    userId,
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        }
      : {}),
  };

  return db.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
});

export const getRecentNotes = cache(async (userId: string) => {
  return db.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });
});

export const countNotes = cache(async (userId: string) => {
  return db.note.count({
    where: { userId },
  });
});
