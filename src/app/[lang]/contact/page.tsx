import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppointmentNote } from "@/components/contact/AppointmentNote";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { InquiryOptions } from "@/components/contact/InquiryOptions";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialReveal } from "@/components/motion/EditorialReveal";
import { ImageDrift } from "@/components/motion/ImageDrift";
import { getContactContent } from "@/content/contact";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return buildPageMetadata({
    lang,
    path: "/contact",
    title: dictionary.pages.contact.title,
    description: dictionary.pages.contact.description,
  });
}

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
      <EditorialReveal variant="image">
        <ImageDrift>
          <ContactHero hero={contactContent.hero} />
        </ImageDrift>
      </EditorialReveal>
      <EditorialReveal variant="section" delay={0.04}>
        <InquiryOptions options={contactContent.options} lang={lang} />
      </EditorialReveal>

      <EditorialReveal variant="section" delay={0.08}>
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-2 sm:px-6 lg:px-10 lg:pb-16 lg:pt-6">
          <div className="grid items-start gap-10 border-t border-white/8 pt-10 lg:grid-cols-[0.58fr_0.42fr] lg:gap-16">
            <ContactForm
              form={contactContent.form}
              modes={contactContent.options.modes}
              defaultType={search.type}
              defaultPiece={search.piece}
            />
            <ContactDetails details={contactContent.details} />
          </div>
        </section>
      </EditorialReveal>

      <EditorialReveal variant="section" delay={0.1}>
        <AppointmentNote note={contactContent.appointmentNote} lang={lang} />
      </EditorialReveal>
    </PageShell>
  );
}
