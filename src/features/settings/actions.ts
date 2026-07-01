"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createDeleteAccountSchema,
  settingsSchema,
} from "@/features/settings/schema";
import { getLocaleFromFormData, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function updateSettingsAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = settingsSchema.safeParse({
    theme: formData.get("theme"),
    defaultModel: formData.get("defaultModel"),
    language: formData.get("language"),
    notifications: formData.get("notifications") === "true",
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.settings.actions.failure,
      parsed.error.flatten().fieldErrors,
    );
  }

  await db.userPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...parsed.data,
    },
    update: parsed.data,
  });

  revalidatePath(localizeHref("/settings", locale));
  revalidatePath(localizeHref("/dashboard", locale));
  return actionSuccess(dictionary.settings.actions.success);
}

export async function requestDeleteAccountAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createDeleteAccountSchema(
    dictionary.settings.danger.validation,
    session.user.email,
  ).safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.settings.danger.actions.failure,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    // Better Auth 会验证当前密码并创建一次性删除 token；真正删除要等用户点击邮件确认链接。
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        password: parsed.data.password,
        callbackURL: localizeHref("/sign-in?deleted=1", locale),
      },
    });
  } catch {
    return actionFailure(dictionary.settings.danger.actions.failure, {
      password: [dictionary.settings.danger.validation.invalidPassword],
    });
  }

  return actionSuccess(dictionary.settings.danger.actions.success);
}
