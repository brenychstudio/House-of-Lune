"use client";

import { useState } from "react";

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

  return (
    <section className="rounded-3xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-7 lg:p-8">
      <h2 className="font-serif text-2xl">{form.title}</h2>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">{form.description}</p>
      <form
        className="mt-6 space-y-4"
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
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <span>{form.fields.name}</span>
            <input required name="name" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <span>{form.fields.email}</span>
            <input required type="email" name="email" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <span>{form.fields.inquiryType}</span>
            <select defaultValue={defaultType ?? modes[0]?.value} name="inquiryType" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]">
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <span>{form.fields.piece}</span>
            <input defaultValue={defaultPiece} name="piece" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
          </label>
        </div>
        <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          <span>{form.fields.timing}</span>
          <input name="timing" className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          <span>{form.fields.message}</span>
          <textarea required name="message" rows={5} className="w-full rounded-2xl border border-[var(--color-line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent-cool)]" />
        </label>
        <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 text-[0.67rem] uppercase tracking-[0.15em] text-black transition hover:border-[#d8ccae] hover:bg-[#d8ccae]">
          {form.submitLabel}
        </button>
      </form>
      {status !== "idle" ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">{status === "success" ? form.successLabel : form.errorLabel}</p>
      ) : null}
    </section>
  );
}
