// i18n 配置刻意保持为纯 TypeScript 常量，方便 Server Component、Client Component 和 proxy 共享同一份事实源。
export const locales = ["zh-CN", "en-US"] as const;

export type Locale = (typeof locales)[number];

// 沿用项目既有中文默认体验；浏览器或 cookie 命中英文时，proxy 会切换到英文路由。
export const defaultLocale: Locale = "zh-CN";

// locale cookie 只保存用户最后访问的语言，避免每次访问根路径都重新依赖 Accept-Language。
export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
};

export const localeShortLabels: Record<Locale, string> = {
  "zh-CN": "中",
  "en-US": "EN",
};

export type LocaleRouteParams = Promise<{
  locale: string;
}>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (isLocale(value ?? undefined)) {
    return value as Locale;
  }

  return defaultLocale;
}

export async function getLocaleFromRouteParams(params: LocaleRouteParams) {
  const { locale } = await params;
  return resolveLocale(locale);
}

export function getLocaleFromFormData(formData: FormData) {
  const value = formData.get("locale");

  // 隐藏字段来自客户端表单，仍要兜底校验，避免伪造值进入 revalidatePath 或消息字典选择。
  return resolveLocale(typeof value === "string" ? value : undefined);
}

export function getPathLocale(pathname: string) {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : undefined;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getPathLocale(pathname);

  if (!locale) {
    return pathname || "/";
  }

  const stripped = pathname.slice(locale.length + 1);
  return stripped.startsWith("/") ? stripped || "/" : `/${stripped}`;
}

export function localizePathname(pathname: string, locale: Locale) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathnameWithoutLocale = stripLocaleFromPathname(normalizedPathname);

  return pathnameWithoutLocale === "/"
    ? `/${locale}`
    : `/${locale}${pathnameWithoutLocale}`;
}

export function localizeHref(href: string, locale: Locale) {
  if (isExternalHref(href) || href.startsWith("#")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hrefWithoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const queryIndex = hrefWithoutHash.indexOf("?");
  const pathname = queryIndex >= 0 ? hrefWithoutHash.slice(0, queryIndex) : hrefWithoutHash;
  const query = queryIndex >= 0 ? hrefWithoutHash.slice(queryIndex) : "";

  // Link 只需要 pathname/search/hash，绝不在这里拼 origin，避免破坏 Next.js 的客户端导航。
  return `${localizePathname(pathname || "/", locale)}${query}${hash}`;
}

function isExternalHref(href: string) {
  return /^[a-z][a-z\d+\-.]*:/i.test(href);
}
