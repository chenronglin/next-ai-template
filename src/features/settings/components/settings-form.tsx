"use client";

import { Save } from "lucide-react";
import { useActionState, useState } from "react";
import { useTheme } from "next-themes";

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
import {
  aiModelLabels,
  aiModelValues,
  languageLabels,
  languageValues,
  themeLabels,
  themeValues,
} from "@/lib/constants";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type SettingsFormProps = {
  preference: PreferenceView;
};

export function SettingsForm({ preference }: SettingsFormProps) {
  const { setTheme } = useTheme();
  const [notifications, setNotifications] = useState(preference.notifications);
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <Label>主题</Label>
        <Select
          name="theme"
          defaultValue={preference.theme}
          onValueChange={(value) => setTheme(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themeValues.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {themeLabels[theme]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>默认 AI 模型</Label>
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
        <Label>默认语言</Label>
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
        <span>接收产品通知</span>
      </label>

      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        <Save data-icon="inline-start" />
        {isPending ? "保存中" : "保存设置"}
      </Button>
    </form>
  );
}
