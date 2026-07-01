---
name: next-saas-template
description: 新增 Next.js SaaS 页面、布局或业务模块时使用，约束 App Router、Server/Client Component 边界和 feature-first 结构。
---

# next-saas-template

## 规则

1. 新页面放入 `src/app`，使用 route group 保持 URL 清晰。
2. 默认写 Server Component；只有浏览器事件、状态、主题、toast、streaming UI 才写 Client Component。
3. 后台页面必须在 `(app)` 组内，依赖 `src/app/(app)/layout.tsx` 做权威认证校验。
4. 新业务模块放入 `src/features/<module>`，至少包含 `schema.ts`，有数据读取时增加 `queries.ts`，有写操作时增加 `actions.ts`。
5. 页面需要提供 loading、empty、error 状态；窄屏和桌面都不能出现文本溢出或控件重叠。
6. 需要图标时使用 `lucide-react`，不要手写内联 SVG 图标。
