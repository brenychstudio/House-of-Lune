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
    <section id="inquiry" className="section-divider py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="surface-frame rounded-3xl px-5 py-10 sm:px-8 sm:py-12">
          <SectionHeading eyebrow={homeContent.inquiry.eyebrow} title={homeContent.inquiry.heading} description={homeContent.inquiry.body} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/${lang}/contact?type=appointment`}>{homeContent.inquiry.cta}</Button>
            <Button href={`/${lang}/contact?type=bespoke`} variant="outline">
              {homeContent.inquiry.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
