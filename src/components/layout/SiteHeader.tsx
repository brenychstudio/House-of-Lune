import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)]/70 bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#" className="font-serif text-lg tracking-[0.08em]">
          {siteContent.brand}
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {siteContent.navigation.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
              {item.label}
            </a>
          ))}
        </nav>
        <Button href="#inquiry" variant="outline" size="sm">
          {siteContent.cta.inquiry}
        </Button>
      </div>
    </header>
  );
}
