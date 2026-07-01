import { defaultLocale, locales } from "@/i18n/config";

// 根 layout 不能读取动态 `[locale]` 参数；这段脚本在 hydration 前根据 URL 第一段修正 html[lang]。
export const localeInitScript = `
(() => {
  try {
    const supportedLocales = ${JSON.stringify(locales)};
    const pathLocale = window.location.pathname.split("/")[1];
    const locale = supportedLocales.includes(pathLocale) ? pathLocale : "${defaultLocale}";
    document.documentElement.lang = locale;
  } catch (_) {}
})();
`;
