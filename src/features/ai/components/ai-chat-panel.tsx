"use client";

import { Bot, Save, Send, Trash2 } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAiPromptSchema } from "@/features/ai/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { formatDateTime } from "@/lib/format";

type ModelOption = {
  value: string;
  label: string;
};

type AiHistoryItem = {
  id: string;
  title: string;
  model: string;
  updatedAt: Date;
  messages: Array<{
    id: string;
    role: string;
    content: string;
  }>;
};

type AiChatPanelProps = {
  models: ModelOption[];
  defaultModel: string;
  history: AiHistoryItem[];
  locale: Locale;
  messages: Dictionary["ai"];
};

export function AiChatPanel({
  models,
  defaultModel,
  history,
  locale,
  messages,
}: AiChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(defaultModel);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOutput("");

    const parsed = createAiPromptSchema(messages.validation).safeParse({ prompt, model });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? messages.form.invalidPrompt);
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsed.data,
          locale,
        }),
      });

      if (!response.ok || !response.body) {
        setError(messages.form.requestFailure);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        // 使用函数式 setState 累加流式 chunk，避免闭包里读取过期 output。
        setOutput((current) => current + decoder.decode(value, { stream: true }));
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="rounded-lg border bg-background p-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>{messages.form.model}</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prompt">{messages.form.prompt}</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={messages.form.promptPlaceholder}
              className="min-h-36"
            />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending}>
              <Send data-icon="inline-start" />
              {isPending ? messages.form.submitting : messages.form.submit}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOutput("")}>
              <Trash2 data-icon="inline-start" />
              {messages.form.clear}
            </Button>
            <Button type="button" variant="ghost" disabled>
              <Save data-icon="inline-start" />
              {messages.form.autoSave}
            </Button>
          </div>
        </form>

        <div className="mt-6 min-h-60 rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Bot className="size-4 text-primary" />
            {messages.form.outputTitle}
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
            {output || messages.form.waiting}
          </pre>
        </div>
      </div>

      <aside className="rounded-lg border bg-background p-4">
        <h2 className="text-base font-semibold">{messages.history.title}</h2>
        <div className="mt-4 grid gap-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">{messages.history.empty}</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.model}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(item.updatedAt, locale)}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
