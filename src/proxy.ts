import { NextRequest, NextResponse } from "next/server";

import {
  defaultLocale,
  getPathLocale,
  isLocale,
  localeCookieName,
  localizePathname,
  stripLocaleFromPathname,
  type Locale,
} from "@/i18n/config";

// 受保护路由只在 proxy 做轻量 cookie 预检；真正 session 校验放在 `(app)/layout.tsx`。
const protectedPrefixes = [
  "/dashboard",
  "/me",
  "/settings",
  "/ai",
  "/examples",
];

// Better Auth 在开发/生产和旧兼容模式下可能使用这些 session cookie 名称。
const sessionCookieNames = [
  "better-auth.session_token",
  "better-auth-session_token",
  "__Secure-better-auth.session_token",
  "__Secure-better-auth-session_token",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getPathLocale(pathname);

  if (!locale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePathname(pathname, getPreferredLocale(request));
    return NextResponse.redirect(redirectUrl);
  }

  const pathnameWithoutLocale = stripLocaleFromPathname(pathname);
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathnameWithoutLocale === prefix || pathnameWithoutLocale.startsWith(`${prefix}/`),
  );

  if (!isProtectedRoute) {
    return withLocaleCookie(NextResponse.next(), locale);
  }

  const hasSessionCookie = sessionCookieNames.some((cookieName) =>
    request.cookies.has(cookieName),
  );

  if (hasSessionCookie) {
    return withLocaleCookie(NextResponse.next(), locale);
  }

  const signInUrl = new URL(localizePathname("/sign-in", locale), request.url);
  signInUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
  return withLocaleCookie(NextResponse.redirect(signInUrl), locale);
}

export const config = {
  // 排除静态资源和 API，避免 proxy 对资源请求做无意义判断。
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Accept-Language 可能包含权重和区域变体，这里只做轻量匹配，避免额外依赖进入 proxy runtime。
  const acceptedLanguages = request.headers
    .get("accept-language")
    ?.split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  const matchedLanguage = acceptedLanguages?.find((language) =>
    language === "zh-cn" || language.startsWith("zh") || language.startsWith("en"),
  );

  if (matchedLanguage?.startsWith("en")) {
    return "en-US";
  }

  if (matchedLanguage?.startsWith("zh")) {
    return "zh-CN";
  }

  return defaultLocale;
}

function withLocaleCookie(response: NextResponse, locale: Locale) {
  // 写入 cookie 后，用户访问 `/` 时能回到最后选择的语言；maxAge 仅影响语言记忆，不影响认证。
  response.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
