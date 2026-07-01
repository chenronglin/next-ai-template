"use server";

import { revalidatePath } from "next/cache";

import { createUpdateProfileSchema } from "@/features/profile/schema";
import { getLocaleFromFormData, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function updateProfileAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createUpdateProfileSchema(dictionary.profile.validation).safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.profile.actions.failure,
      parsed.error.flatten().fieldErrors,
    );
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image || null,
    },
  });

  revalidatePath(localizeHref("/me", locale));
  revalidatePath(localizeHref("/dashboard", locale));
  return actionSuccess(dictionary.profile.actions.success);
}
