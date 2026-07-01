---
name: next-i18n
description: 为本 Next.js SaaS 项目新增、改造、扩展或修复多语言支持时使用；触发场景包括添加 locale、迁移路由到 `[locale]`、维护 `src/i18n` 字典、语言切换器、localized href、proxy 语言重定向、localized metadata、表单/Server Action/API/AI UI 的本地化消息，以及修复语言切换、html lang、主题脚本和动态 layout 相关问题。
---

# next-i18n

## 核心目标

把多语言能力做成可扩展的项目基础设施，而不是零散翻译字符串。默认支持 `zh-CN` 和 `en-US`，未来新增语言必须只扩展 locale 配置和完整字典，不复制业务逻辑。

## 开始前

1. 先读取 `AGENTS.md`，再按实际改动读取相关技能：路由或 layout 读 `next-saas-template`，UI 读 `shadcn-product-ui`，表单、Server Action 或 Route Handler 读 `zod-server-actions`，认证/数据库/AI 相关改动读取对应技能。
2. 写 Next.js App Router 相关代码前，优先查本地版本文档 `node_modules/next/dist/docs/`，重点确认 layout、Server Component、Route Handler、Proxy 和 Script 的当前约束。
3. 先用 `rg` 检查现状：`src/app`、`src/i18n`、`src/proxy.ts`、`src/components`、`src/features` 中已有 locale、硬编码文案、链接和重定向。

## 推荐结构

1. 把语言事实源放在 `src/i18n/config.ts`：包含 `locales`、`defaultLocale`、label、cookie 名称、locale 校验、路径本地化工具。
2. 把翻译放在 `src/i18n/messages/<locale>.ts`，用共享 `Dictionary` 类型约束结构；新增语言时必须补齐完整字典，避免运行时缺 key。
3. 用 `src/i18n/dictionaries.ts` 在 Server Component 中按 locale 加载字典；只把组件需要的最小 messages 片段传给 Client Component。
4. localized 路由放入 `src/app/[locale]/...`；未带语言前缀的访问由 `src/proxy.ts` 重定向到首选语言。
5. 导航和跳转统一走 `localizeHref`、`localizePathname` 等工具，保留 pathname、search 和 hash，避免手写 `/${locale}` 拼接散落在组件里。

## App Router 规则

1. 保留静态 `src/app/layout.tsx` 作为唯一输出 `<html>`、`<head>`、`<body>`、全局 provider、全局 CSS 和 `next/script` 的根 layout。
2. `src/app/[locale]/layout.tsx` 只做 locale 校验、`generateStaticParams`、localized metadata 和必要的轻量同步组件；不要在动态 locale layout 中渲染 `<Script>`、`<html>`、`<head>` 或 `<body>`。
3. 如果根 layout 不能直接读取动态 locale，用一个很小的 Client Component 同步 `document.documentElement.lang`；首屏需要提前修正时，只能把初始化脚本放在静态根 layout。
4. 对非法 locale 使用 `notFound()`，不要静默回退后继续渲染页面，否则会产生重复内容和错误的 URL 语义。
5. 页面级 `generateMetadata` 需要从当前 locale 字典读取标题和描述；默认 metadata 不能只保留单语言文案。

## Proxy 和语言记忆

1. `src/proxy.ts` 只做轻量语言路由、cookie 和认证预检，不引入重依赖。
2. matcher 必须排除 `api`、`_next/static`、`_next/image`、`favicon.ico` 等资源路径。
3. 无 locale 前缀时，先读语言 cookie，再解析 `Accept-Language`，最后回退到 `defaultLocale`。
4. 用户访问带 locale 的页面时写入 `NEXT_LOCALE`，让 `/` 能回到最后选择的语言。
5. 保护路由重定向登录页时保留 locale 和 `callbackUrl`，避免登录后丢失目标路径或语言。

## UI、表单和业务消息

1. 所有用户可见文案都进入字典：导航、按钮、空状态、loading、错误、toast、表单 label、schema 错误、AI streaming UI、metadata。品牌名、代码标识和不可翻译常量可以保留原文。
2. 语言切换器使用真实 `Link` 语义，目标由当前 pathname 计算，当前语言加 `aria-current`；切换后检查不会触发 console error。
3. 表单需要把 locale 作为隐藏字段或显式参数传入 Server Action；Server Action 内仍要校验并兜底解析 locale。
4. Zod schema 需要支持按 locale 生成错误消息，或由调用方传入本地化消息；不要在 schema 中写死单语言报错。
5. `redirect`、`revalidatePath`、邮件链接、认证 callback、API 返回消息都要使用 localized path 或 localized message。

## 扩展新语言

1. 在 `locales`、labels、short labels 和 Accept-Language 匹配中加入新 locale。
2. 新增完整 `messages/<locale>.ts`，保持和 `Dictionary` 完全一致。
3. 检查 `generateStaticParams`、locale switcher、proxy cookie、metadata、表单隐藏字段和测试是否自动覆盖新语言。
4. 用 `rg` 搜索新旧硬编码文案，确认没有只翻译首页而遗漏后台、认证、错误和加载状态。

## 常见风险

1. 不要把 `next/script` 或会输出 `<script>` 的 provider 放进动态 `[locale]` layout；客户端语言切换时 React 会报 “Encountered a script tag while rendering React component”。
2. 不要让 Client Component 自己导入整份字典；由 Server Component 传入需要的消息片段，减少 bundle 和序列化负担。
3. 不要在 proxy 中访问数据库、会话 API 或大型 i18n 库；proxy 只负责快速路由判断。
4. 不要把 locale 写入业务数据表，除非产品明确需要保存用户偏好；路由、cookie 和请求上下文通常足够。
5. 不要只验证刷新页面；必须验证客户端语言切换，因为很多 layout 和 Script 问题只在 client navigation 暴露。

## 验证

1. 完成代码修改后运行 `bun run typecheck`、`bun run lint`、`bun test`。
2. 涉及页面或 layout 时，在浏览器验证 `/zh-CN`、`/en-US`、无前缀 `/` 重定向、语言切换器、受保护路由跳转和 `html[lang]`。
3. 检查控制台不能有 hydration、script tag、missing dictionary key 或 locale 路由错误。
4. 若新增语言，至少抽查营销页、认证页、后台页、表单错误和一个 Server Action 返回路径。
