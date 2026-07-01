---
name: shadcn-product-ui
description: 新增产品 UI、后台页面、表单、表格、弹窗或状态视图时使用。
---

# shadcn-product-ui

## 规则

1. 优先使用 `src/components/ui` 里的 shadcn/ui 组件。
2. 后台页面采用低装饰、高可读、适合扫描的工具型布局。
3. 表单必须有 Label，失败状态需要能展示给用户。
4. 重复内容可以用 Card；不要把页面大区块都包成嵌套卡片。
5. 表格、按钮、输入框需要稳定尺寸，避免 hover、loading 或长文本导致布局跳动。
6. 空状态、加载状态、错误状态必须可见且可恢复。
