import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { ContactContent } from "@/types/contact";

export function AppointmentNote({ note, lang }: { note: ContactContent["appointmentNote"]; lang: Locale }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <div className="rounded-3xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.012)] p-6 text-center sm:p-8">
        <h2 className="font-serif text-2xl">{note.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">{note.description}</p>
        <div className="mt-7">
          <Button href={`/${lang}/collection`} variant="outline">
            {note.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
