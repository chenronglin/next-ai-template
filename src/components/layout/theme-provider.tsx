"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  appThemeValues,
  isAppTheme,
  themeStorageKey,
  type AppTheme,
  type ResolvedTheme,
} from "@/lib/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: AppTheme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme | ((theme: AppTheme) => AppTheme)) => void;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  themes: AppTheme[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = themeStorageKey,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(() =>
    typeof window === "undefined"
      ? defaultTheme
      : getStoredTheme(storageKey, defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme(),
  );

  const applyTheme = useCallback(
    (nextTheme: AppTheme, nextSystemTheme = systemTheme) => {
      const resolvedTheme: ResolvedTheme =
        nextTheme === "system"
          ? enableSystem
            ? nextSystemTheme
            : "light"
          : nextTheme;

      const removeTransitionStyle = disableTransitionOnChange
        ? disableCssTransitions()
        : undefined;

      // 主题只影响 html 根节点；保留字体变量等已有 class，仅替换 light/dark 两个主题 class。
      const root = document.documentElement;
      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);
      } else if (resolvedTheme) {
        root.setAttribute(attribute, resolvedTheme);
      }

      root.style.colorScheme = resolvedTheme;
      removeTransitionStyle?.();
    },
    [attribute, disableTransitionOnChange, enableSystem, systemTheme],
  );

  const setTheme = useCallback(
    (nextTheme: AppTheme | ((theme: AppTheme) => AppTheme)) => {
      const resolvedNextTheme =
        typeof nextTheme === "function" ? nextTheme(theme) : nextTheme;

      if (!isAppTheme(resolvedNextTheme)) {
        return;
      }

      try {
        window.localStorage.setItem(storageKey, resolvedNextTheme);
      } catch {
        // localStorage 在隐私模式或禁用存储时可能失败；主题仍应在当前页面内可用。
      }

      setThemeState(resolvedNextTheme);
    },
    [storageKey, theme],
  );

  useEffect(() => {
    applyTheme(theme, systemTheme);
  }, [applyTheme, systemTheme, theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const nextSystemTheme = event.matches ? "dark" : "light";
      setSystemTheme(nextSystemTheme);

      if (theme === "system" && enableSystem) {
        applyTheme("system", nextSystemTheme);
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [applyTheme, enableSystem, theme]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== storageKey) {
        return;
      }

      const nextTheme = isAppTheme(event.newValue) ? event.newValue : defaultTheme;
      setThemeState(nextTheme);
      applyTheme(nextTheme);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [applyTheme, defaultTheme, storageKey]);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (enableSystem ? systemTheme : "light") : theme;
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: appThemeValues.slice(),
    }),
    [resolvedTheme, setTheme, systemTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      theme: "system" as AppTheme,
      setTheme: () => undefined,
      resolvedTheme: "light" as ResolvedTheme,
      systemTheme: "light" as ResolvedTheme,
      themes: appThemeValues.slice(),
    };
  }

  return context;
}

function getStoredTheme(storageKey: string, defaultTheme: AppTheme) {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return isAppTheme(storedTheme) ? storedTheme : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function disableCssTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important;animation-duration:0s!important}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    window.setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}
