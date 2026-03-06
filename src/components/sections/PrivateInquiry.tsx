import { homeContent } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PrivateInquiry() {
  return (
    <section id="inquiry" className="border-t border-[var(--color-line)] py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading eyebrow="Private Inquiry" title={homeContent.inquiry.heading} description={homeContent.inquiry.body} />
        <div className="mt-8">
          <Button href="#">{homeContent.inquiry.cta}</Button>
        </div>
      </div>
    </section>
  );
}
