"use client";

import { createAuthClient } from "better-auth/react";

// 前端认证客户端唯一出口；默认使用相对路径，方便本地、VPS、反向代理共用同一份代码。
export const authClient = createAuthClient();
