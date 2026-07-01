"use server";

import { revalidatePath } from "next/cache";

import { settingsSchema } from "@/features/settings/schema";
import { getLocaleFromFormData, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
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
