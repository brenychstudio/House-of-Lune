import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line-soft)]/90 bg-[rgba(7,9,14,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#" className="font-serif text-[1.12rem] tracking-[0.11em]">
          {siteContent.brand}
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {siteContent.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]/90 transition-colors duration-300 hover:text-[var(--color-text)]"
            >
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
