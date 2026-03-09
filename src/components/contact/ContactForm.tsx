"use client";

import { useId, useState } from "react";

import type { ContactContent } from "@/types/contact";

export function ContactForm({
  form,
  modes,
  defaultType,
  defaultPiece,
}: {
  form: ContactContent["form"];
  modes: ContactContent["options"]["modes"];
  defaultType?: string;
  defaultPiece?: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const idBase = useId();

  return (
    <section className="rounded-3xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-7 lg:p-8">
      <h2 className="font-serif text-2xl">{form.title}</h2>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">{form.description}</p>
      <form
        className="mt-6 space-y-4 sm:space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setStatus("idle");
          const data = new FormData(event.currentTarget);
          try {
            const response = await fetch("/api/inquiry", { method: "POST", body: data });
            if (!response.ok) throw new Error("Request failed");
            setStatus("success");
            event.currentTarget.reset();
          } catch {
            setStatus("error");
          }
        }}
      >
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={`${idBase}-name`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {form.fields.name}
            </label>
            <input id={`${idBase}-name`} required aria-required="true" name="name" autoComplete="name" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </div>
          <div className="space-y-2">
            <label htmlFor={`${idBase}-email`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {form.fields.email}
            </label>
            <input id={`${idBase}-email`} required aria-required="true" type="email" name="email" autoComplete="email" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </div>
          <div className="space-y-2">
            <label htmlFor={`${idBase}-type`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {form.fields.inquiryType}
            </label>
            <select id={`${idBase}-type`} defaultValue={defaultType ?? modes[0]?.value} name="inquiryType" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]">
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor={`${idBase}-piece`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {form.fields.piece}
            </label>
            <input id={`${idBase}-piece`} defaultValue={defaultPiece} name="piece" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idBase}-timing`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {form.fields.timing}
          </label>
          <input id={`${idBase}-timing`} name="timing" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idBase}-message`} className="block text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {form.fields.message}
          </label>
          <textarea id={`${idBase}-message`} required aria-required="true" name="message" rows={5} className="w-full rounded-2xl border border-[var(--color-line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
        </div>
        <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 text-[0.67rem] uppercase tracking-[0.15em] text-black transition hover:border-[#d8ccae] hover:bg-[#d8ccae]">
          {form.submitLabel}
        </button>
      </form>
      <p aria-live="polite" className="mt-4 text-sm text-[var(--color-text-muted)]">
        {status === "success" ? form.successLabel : status === "error" ? form.errorLabel : ""}
      </p>
    </section>
  );
}
