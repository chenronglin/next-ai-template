---
name: zod-server-actions
description: 新增表单、Server Action、CRUD 或 Route Handler 输入校验时使用。
---

# zod-server-actions

## 规则

1. 先写 `schema.ts`，再写 action、route 或 UI。
2. Server Action 必须返回 `ActionResult<T>`，方便客户端稳定展示结果。
3. 写操作必须先 `requireUser()` 或做等价认证检查。
4. Server Action 不从 Client Component 直接访问 Prisma。
5. 表单字段错误使用 `parsed.error.flatten().fieldErrors` 返回。
6. 只有用户提交、点击、输入等交互逻辑放在事件处理器里，不用 effect 触发 mutation。
