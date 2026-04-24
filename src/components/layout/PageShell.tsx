import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

type PageShellProps = {
  children: ReactNode;
  dictionary: Dictionary;
  lang: Locale;
};

export function PageShell({ children }: PageShellProps) {
  return <>{children}</>;
}
