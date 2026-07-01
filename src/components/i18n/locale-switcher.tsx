"use client";

import { Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  localeLabels,
  localeShortLabels,
  locales,
  localizePathname,
  type Locale,
} from "@/i18n/config";

type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
  currentLabel: string;
};

export function LocaleSwitcher({
  locale,
  label,
  currentLabel,
}: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 min-w-16 gap-2 px-2.5"
          aria-label={label}
        >
          <Languages className="size-4" />
          <span className="text-xs font-medium">{localeShortLabels[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuLabel>{currentLabel}</DropdownMenuLabel>
        {locales.map((item) => (
          <DropdownMenuItem key={item} asChild>
            {/* 用真实 Link 语义让切换语言保留 Next.js 客户端导航，同时由 proxy 写入语言 cookie。 */}
            <Link
              href={localizePathname(pathname, item)}
              aria-current={item === locale ? "page" : undefined}
            >
              {localeLabels[item]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
