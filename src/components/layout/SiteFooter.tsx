import { siteContent } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between lg:px-10">
        <p>© {new Date().getFullYear()} {siteContent.brand}</p>
        <div className="flex items-center gap-5">
          {siteContent.footerLinks.map((item) => (
            <a key={item.label} href={item.href} className="transition-colors hover:text-[var(--color-text)]">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
