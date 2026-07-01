"use server";

import { revalidatePath } from "next/cache";

import {
  createNoteCreateSchema,
  createNoteDeleteSchema,
  createNoteUpdateSchema,
} from "@/features/notes/schema";
import { getLocaleFromFormData, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function createNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createNoteCreateSchema(dictionary.notes.validation).safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.notes.actions.createFailure,
      parsed.error.flatten().fieldErrors,
    );
  }

  await db.note.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  revalidatePath(localizeHref("/examples/notes", locale));
  revalidatePath(localizeHref("/dashboard", locale));
  return actionSuccess(dictionary.notes.actions.createSuccess);
}

export async function updateNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createNoteUpdateSchema(dictionary.notes.validation).safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.notes.actions.updateFailure,
      parsed.error.flatten().fieldErrors,
    );
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
    return actionFailure(dictionary.notes.actions.updateMissing);
  }

  revalidatePath(localizeHref("/examples/notes", locale));
  revalidatePath(localizeHref("/dashboard", locale));
  return actionSuccess(dictionary.notes.actions.updateSuccess);
}

export async function deleteNoteAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createNoteDeleteSchema(dictionary.notes.validation).safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.notes.actions.deleteFailure,
      parsed.error.flatten().fieldErrors,
    );
  }

  const result = await db.note.deleteMany({
    where: {
      id: parsed.data.id,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    return actionFailure(dictionary.notes.actions.deleteMissing);
  }

  revalidatePath(localizeHref("/examples/notes", locale));
  revalidatePath(localizeHref("/dashboard", locale));
  return actionSuccess(dictionary.notes.actions.deleteSuccess);
}
