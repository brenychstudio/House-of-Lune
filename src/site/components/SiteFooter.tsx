import Link from "next/link";

import type { SiteContent } from "@/site/content";

type SiteFooterProps = Readonly<{
  content: SiteContent;
}>;

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div>
        <Link href={`/${content.locale}`} className="wordmark">
          {content.identity.name}
        </Link>
        <p>{content.footer.statement}</p>
      </div>
      <p className="site-footer__note">
        Independent commerce foundation · English development locale
      </p>
    </footer>
  );
}
