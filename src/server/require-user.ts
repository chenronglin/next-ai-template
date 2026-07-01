import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, localizeHref, type Locale } from "@/i18n/config";
import { auth } from "@/lib/auth";

// 读取当前请求的 Better Auth session；只在 Server Component、Server Action、Route Handler 中调用。
export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

// 后台页面的权威保护入口；proxy 只做轻量预检，这里才真正读取认证状态。
export async function requireUser(locale: Locale = defaultLocale) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(localizeHref("/sign-in", locale));
  }

  return session;
}
