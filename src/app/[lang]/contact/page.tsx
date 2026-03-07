import { notFound } from "next/navigation";

import { AppointmentNote } from "@/components/contact/AppointmentNote";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { InquiryOptions } from "@/components/contact/InquiryOptions";
import { PageShell } from "@/components/layout/PageShell";
import { getContactContent } from "@/content/contact";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string; piece?: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);
  const search = await searchParams;
  const contactContent = getContactContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <ContactHero hero={contactContent.hero} />
      <InquiryOptions options={contactContent.options} />
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <ContactForm form={contactContent.form} modes={contactContent.options.modes} defaultType={search.type} defaultPiece={search.piece} />
        <ContactDetails details={contactContent.details} />
      </section>
      <AppointmentNote note={contactContent.appointmentNote} lang={lang} />
    </PageShell>
  );
}
