"use server";

import { revalidatePath } from "next/cache";

import { updateProfileSchema } from "@/features/profile/schema";
import { db } from "@/lib/db";
import { actionFailure, actionSuccess, type ActionResult } from "@/server/action-result";
import { requireUser } from "@/server/require-user";

export async function updateProfileAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return actionFailure("个人资料更新失败", parsed.error.flatten().fieldErrors);
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image || null,
    },
  });

  revalidatePath("/me");
  revalidatePath("/dashboard");
  return actionSuccess("个人资料已更新");
}
