import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
    >
      {/* 使用简单几何标识承载模板品牌，避免引入额外图片资源和运行时依赖。 */}
      <span className="grid size-7 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
        AI
      </span>
      <span>Next AI SaaS</span>
    </Link>
  );
}
