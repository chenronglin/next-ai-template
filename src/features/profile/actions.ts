"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createChangePasswordSchema,
  createUpdateProfileSchema,
} from "@/features/profile/schema";
import { getLocaleFromFormData, localizeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { auth } from "@/lib/auth";
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

export async function changePasswordAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = getLocaleFromFormData(formData);
  const [dictionary] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const parsed = createChangePasswordSchema({
    currentPasswordRequired: dictionary.profile.validation.currentPasswordRequired,
    passwordMin: dictionary.auth.validation.passwordMin,
    confirmPasswordMin: dictionary.auth.validation.confirmPasswordMin,
    passwordMismatch: dictionary.auth.validation.passwordMismatch,
  }).safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
    revokeOtherSessions: formData.get("revokeOtherSessions") === "true",
  });

  if (!parsed.success) {
    return actionFailure(
      dictionary.profile.actions.changePasswordFailure,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    // headers() 把当前请求的 session cookie 交给 Better Auth，由它完成密码校验和会话更新。
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: parsed.data.revokeOtherSessions,
      },
    });
  } catch {
    return actionFailure(dictionary.profile.actions.changePasswordFailure, {
      currentPassword: [dictionary.profile.validation.invalidCurrentPassword],
    });
  }

  revalidatePath(localizeHref("/me", locale));
  return actionSuccess(dictionary.profile.actions.changePasswordSuccess);
}
