"use server";

import { revalidatePath } from "next/cache";

import { settingsSchema } from "@/features/settings/schema";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function updateSettingsAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = settingsSchema.safeParse({
    theme: formData.get("theme"),
    defaultModel: formData.get("defaultModel"),
    language: formData.get("language"),
    notifications: formData.get("notifications") === "true",
  });

  if (!parsed.success) {
    return actionFailure("设置保存失败", parsed.error.flatten().fieldErrors);
  }

  await db.userPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...parsed.data,
    },
    update: parsed.data,
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return actionSuccess("设置已保存");
}
