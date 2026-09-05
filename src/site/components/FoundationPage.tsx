import type { ReactNode } from "react";

import type { PageIntro } from "@/site/content";

type FoundationPageProps = Readonly<{
  intro: PageIntro;
  children?: ReactNode;
}>;

export function FoundationPage({ intro, children }: FoundationPageProps) {
  return (
    <main id="main-content" className="foundation-page">
      <section className="foundation-intro">
        <p className="eyebrow">{intro.eyebrow}</p>
        <h1>{intro.title}</h1>
        <p className="lede">{intro.description}</p>
      </section>
      {children}
    </main>
  );
}
