"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes 是浏览器交互能力，必须隔离在 Client Component 中。
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
