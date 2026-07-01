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
import { aiPromptSchema } from "@/features/ai/schema";
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
};

export function AiChatPanel({ models, defaultModel, history }: AiChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(defaultModel);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOutput("");

    const parsed = aiPromptSchema.safeParse({ prompt, model });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Prompt 无效");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok || !response.body) {
        setError("AI 请求失败，请稍后重试");
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
            <Label>模型</Label>
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
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="让 AI 生成一段产品文案、SQL 查询或功能拆解..."
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
              {isPending ? "生成中" : "生成"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOutput("")}>
              <Trash2 data-icon="inline-start" />
              清空会话
            </Button>
            <Button type="button" variant="ghost" disabled>
              <Save data-icon="inline-start" />
              自动保存
            </Button>
          </div>
        </form>

        <div className="mt-6 min-h-60 rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Bot className="size-4 text-primary" />
            Streaming 输出
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
            {output || "等待输入 Prompt 后开始生成。"}
          </pre>
        </div>
      </div>

      <aside className="rounded-lg border bg-background p-4">
        <h2 className="text-base font-semibold">生成历史</h2>
        <div className="mt-4 grid gap-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无历史记录。</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.model}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(item.updatedAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
