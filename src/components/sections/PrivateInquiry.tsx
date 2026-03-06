import { getHomeContent } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";

type PrivateInquiryProps = {
  homeContent: ReturnType<typeof getHomeContent>;
  lang: Locale;
};

export function PrivateInquiry({ homeContent, lang }: PrivateInquiryProps) {
  return (
    <section id="inquiry" className="section-divider py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="surface-frame rounded-3xl px-8 py-12">
          <SectionHeading eyebrow={homeContent.inquiry.eyebrow} title={homeContent.inquiry.heading} description={homeContent.inquiry.body} />
          <div className="mt-8">
            <Button href={`/${lang}/contact`}>{homeContent.inquiry.cta}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
