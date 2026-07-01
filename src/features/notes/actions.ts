"use server";

import { revalidatePath } from "next/cache";

import {
  noteCreateSchema,
  noteDeleteSchema,
  noteUpdateSchema,
} from "@/features/notes/schema";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function createNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = noteCreateSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return actionFailure("创建 Note 失败", parsed.error.flatten().fieldErrors);
  }

  await db.note.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  revalidatePath("/examples/notes");
  revalidatePath("/dashboard");
  return actionSuccess("Note 已创建");
}

export async function updateNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = noteUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return actionFailure("更新 Note 失败", parsed.error.flatten().fieldErrors);
  }

  const result = await db.note.updateMany({
    where: {
      id: parsed.data.id,
      userId: session.user.id,
    },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  if (result.count === 0) {
    return actionFailure("没有找到可更新的 Note");
  }

  revalidatePath("/examples/notes");
  revalidatePath("/dashboard");
  return actionSuccess("Note 已更新");
}

export async function deleteNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = noteDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return actionFailure("删除 Note 失败", parsed.error.flatten().fieldErrors);
  }

  const result = await db.note.deleteMany({
    where: {
      id: parsed.data.id,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    return actionFailure("没有找到可删除的 Note");
  }

  revalidatePath("/examples/notes");
  revalidatePath("/dashboard");
  return actionSuccess("Note 已删除");
}
