import Link from "next/link";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {year} Next AI SaaS Starter. MIT License.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
          <Link href="https://github.com" className="hover:text-foreground">
            GitHub
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
