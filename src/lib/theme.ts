export const themeStorageKey = "theme";

export const appThemeValues = ["light", "dark", "system"] as const;

export type AppTheme = (typeof appThemeValues)[number];

export type ResolvedTheme = Exclude<AppTheme, "system">;

export function isAppTheme(value: string | null | undefined): value is AppTheme {
  return appThemeValues.some((theme) => theme === value);
}

// 这段脚本由 next/script 的 beforeInteractive 策略执行，先于 hydration 给 html 加主题类，避免首屏闪烁。
export const themeInitScript = `
(() => {
  try {
    const storageKey = "${themeStorageKey}";
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme = storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "system";
    const resolvedTheme = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  } catch (_) {}
})();
`;
