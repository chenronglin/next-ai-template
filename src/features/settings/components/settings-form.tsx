"use client";

import { Save } from "lucide-react";
import { useActionState, useState } from "react";

import { useTheme } from "@/components/layout/theme-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettingsAction } from "@/features/settings/actions";
import type { PreferenceView } from "@/features/settings/queries";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  aiModelLabels,
  aiModelValues,
  languageLabels,
  languageValues,
  themeValues,
} from "@/lib/constants";
import { isAppTheme } from "@/lib/theme";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type SettingsFormProps = {
  preference: PreferenceView;
  locale: Locale;
  messages: Dictionary["settings"]["form"];
};

export function SettingsForm({ preference, locale, messages }: SettingsFormProps) {
  const { setTheme } = useTheme();
  const [notifications, setNotifications] = useState(preference.notifications);
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-2">
        <Label>{messages.theme}</Label>
        <Select
          name="theme"
          defaultValue={preference.theme}
          onValueChange={(value) => {
            // Select 返回 string，切换主题前再收窄一次，避免无效值写入 localStorage 或 html class。
            if (isAppTheme(value)) {
              setTheme(value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themeValues.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {messages.themes[theme]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>{messages.defaultModel}</Label>
        <Select name="defaultModel" defaultValue={preference.defaultModel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aiModelValues.map((model) => (
              <SelectItem key={model} value={model}>
                {aiModelLabels[model]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>{messages.language}</Label>
        <Select name="language" defaultValue={preference.language}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languageValues.map((language) => (
              <SelectItem key={language} value={language}>
                {languageLabels[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="hidden" name="notifications" value={String(notifications)} />
        <Checkbox
          checked={notifications}
          onCheckedChange={(checked) => setNotifications(checked === true)}
        />
        <span>{messages.notifications}</span>
      </label>

      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        <Save data-icon="inline-start" />
        {isPending ? messages.submitting : messages.submit}
      </Button>
    </form>
  );
}
