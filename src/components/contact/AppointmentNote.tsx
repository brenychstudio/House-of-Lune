import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { ContactContent } from "@/types/contact";

export function AppointmentNote({
  note,
  lang,
}: {
  note: ContactContent["appointmentNote"];
  lang: Locale;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-18 pt-4 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28 lg:pt-8">
      <div className="flex flex-col gap-7 border-t border-white/8 pt-9 lg:grid lg:grid-cols-[0.68fr_0.32fr] lg:items-end lg:gap-12">
        <div className="max-w-[42rem]">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">
            Private salons
          </p>

          <h2 className="mt-4 font-serif text-[1.75rem] leading-[1.04] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2rem]">
            {note.title}
          </h2>

          <p className="mt-4 max-w-[44rem] text-[0.96rem] leading-7 text-white/64">
            {note.description}
          </p>
        </div>

        <div className="lg:justify-self-end">
          <Button href={`/${lang}/collection`} variant="outline">
            {note.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
