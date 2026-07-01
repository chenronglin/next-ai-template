"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestDeleteAccountAction } from "@/features/settings/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type DeleteAccountFormProps = {
  locale: Locale;
  email: string;
  messages: Dictionary["settings"]["danger"];
};

export function DeleteAccountForm({
  locale,
  email,
  messages,
}: DeleteAccountFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestDeleteAccountAction,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-fit">
          <Trash2 data-icon="inline-start" />
          {messages.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{messages.dialogTitle}</DialogTitle>
          <DialogDescription>
            {messages.dialogDescription.replace("{email}", email)}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="locale" value={locale} />
          {/* 弹窗内仍保留密码和邮箱文本双确认，邮件链接只是最终删除确认，不替代本地防误触。 */}
          <div className="grid gap-2">
            <Label htmlFor="deleteAccountPassword">{messages.password}</Label>
            <Input
              id="deleteAccountPassword"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            {state.fieldErrors?.password ? (
              <p className="text-sm text-destructive">
                {state.fieldErrors.password[0]}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deleteAccountConfirmation">
              {messages.confirmationLabel}
            </Label>
            <Input
              id="deleteAccountConfirmation"
              name="confirmation"
              autoComplete="off"
              placeholder={email}
            />
            {state.fieldErrors?.confirmation ? (
              <p className="text-sm text-destructive">
                {state.fieldErrors.confirmation[0]}
              </p>
            ) : null}
          </div>
          {state.message ? (
            <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
              {state.message}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={isPending}>
              <Trash2 data-icon="inline-start" />
              {isPending ? messages.submitting : messages.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
