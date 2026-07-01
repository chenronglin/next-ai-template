"use client";

import { KeyRound } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/features/profile/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type ChangePasswordFormProps = {
  locale: Locale;
  messages: Dictionary["profile"]["changePassword"];
};

export function ChangePasswordForm({ locale, messages }: ChangePasswordFormProps) {
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      {/* Checkbox 不稳定提交 false 值，使用隐藏字段把当前布尔状态显式传给 Server Action。 */}
      <input
        type="hidden"
        name="revokeOtherSessions"
        value={String(revokeOtherSessions)}
      />
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">{messages.currentPassword}</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
        />
        {state.fieldErrors?.currentPassword ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.currentPassword[0]}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">{messages.newPassword}</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
        />
        {state.fieldErrors?.newPassword ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.newPassword[0]}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">{messages.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
      </div>
      <label className="flex items-start gap-2 text-sm">
        <Checkbox
          checked={revokeOtherSessions}
          onCheckedChange={(checked) => setRevokeOtherSessions(checked === true)}
        />
        <span>{messages.revokeOtherSessions}</span>
      </label>
      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-fit" disabled={isPending}>
        <KeyRound data-icon="inline-start" />
        {isPending ? messages.submitting : messages.submit}
      </Button>
    </form>
  );
}
