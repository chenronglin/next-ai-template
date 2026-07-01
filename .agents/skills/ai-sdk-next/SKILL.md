---
name: ai-sdk-next
description: 新增 AI 生成、AI streaming、模型选择或 AI 历史保存功能时使用。
---

# ai-sdk-next

## 规则

1. Streaming AI 请求走 `src/app/api/ai/chat/route.ts` Route Handler。
2. 普通文本生成封装在 `src/features/ai/service.ts`。
3. Prompt、模型和结构化输出必须先经过 Zod 校验。
4. AI provider 配置集中读取 `src/lib/env.ts`。
5. 生成历史保存到 `aiConversation` 和 `aiMessage`，不要从客户端直接写数据库。
6. 没有 AI key 时允许返回本地演示流，但 UI 必须清楚呈现这只是演示响应。
