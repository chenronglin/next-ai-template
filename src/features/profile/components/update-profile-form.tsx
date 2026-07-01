"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/features/profile/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
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
  locale: Locale;
  messages: Dictionary["profile"]["form"];
};

export function UpdateProfileForm({ user, locale, messages }: UpdateProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-2">
        <Label htmlFor="name">{messages.name}</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
        {state.fieldErrors?.name ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">{messages.image}</Label>
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
        {isPending ? messages.submitting : messages.submit}
      </Button>
    </form>
  );
}
