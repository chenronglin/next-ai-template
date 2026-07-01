import { defaultLocale, type Locale } from "@/i18n/config";

const dateTimeFormatters = new Map<Locale, Intl.DateTimeFormat>();

function getDateTimeFormatter(locale: Locale) {
  const cachedFormatter = dateTimeFormatters.get(locale);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  // Intl.DateTimeFormat 创建成本不低，按 locale 缓存后可让列表、历史记录等重复格式化更稳定。
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  dateTimeFormatters.set(locale, formatter);
  return formatter;
}

export function formatDateTime(value: Date | string, locale: Locale = defaultLocale) {
  return getDateTimeFormatter(locale).format(new Date(value));
}

export function getInitials(nameOrEmail: string) {
  // 头像兜底只取前两个可见字符，保证中文名、邮箱和英文名都能稳定显示。
  return nameOrEmail.trim().slice(0, 2).toUpperCase() || "U";
}
