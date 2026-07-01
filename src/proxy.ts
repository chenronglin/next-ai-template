import { NextRequest, NextResponse } from "next/server";

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
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie = sessionCookieNames.some((cookieName) =>
    request.cookies.has(cookieName),
  );

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  // 排除静态资源和 API，避免 proxy 对资源请求做无意义判断。
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
