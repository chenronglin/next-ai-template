"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/features/profile/actions";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type UpdateProfileFormProps = {
  user: {
    name: string;
    image?: string | null;
  };
};

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">显示名称</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
        {state.fieldErrors?.name ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">头像 URL</Label>
        <Input id="image" name="image" defaultValue={user.image ?? ""} />
        {state.fieldErrors?.image ? (
          <p className="text-sm text-destructive">{state.fieldErrors.image[0]}</p>
        ) : null}
      </div>
      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-fit" disabled={isPending}>
        <Save data-icon="inline-start" />
        {isPending ? "保存中" : "保存资料"}
      </Button>
    </form>
  );
}
