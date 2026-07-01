import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

// Better Auth 官方 Next.js handler；所有认证请求都集中到这一条 Route Handler。
export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
