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
    <section
      id="private-form"
      className="border-t border-white/8 pt-7"
    >
      <div className="max-w-[34rem]">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">
          Private form
        </p>

        <h2 className="mt-3 font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]">
          {form.title}
        </h2>

        <p className="mt-3 text-[0.96rem] leading-7 text-white/64">
          {form.description}
        </p>
      </div>

      <form
        className="mt-7 space-y-5 border-t border-white/8 pt-7"
        onSubmit={async (event) => {
          event.preventDefault();
          setStatus("idle");
          const data = new FormData(event.currentTarget);

          try {
            const response = await fetch("/api/inquiry", {
              method: "POST",
              body: data,
            });
            if (!response.ok) throw new Error("Request failed");
            setStatus("success");
            event.currentTarget.reset();
          } catch {
            setStatus("error");
          }
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={`${idBase}-name`}
              className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
            >
              {form.fields.name}
            </label>
            <input
              id={`${idBase}-name`}
              required
              aria-required="true"
              name="name"
              autoComplete="name"
              className="h-11 w-full rounded-[0.95rem] border border-[var(--color-line)] bg-transparent px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`${idBase}-email`}
              className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
            >
              {form.fields.email}
            </label>
            <input
              id={`${idBase}-email`}
              required
              aria-required="true"
              type="email"
              name="email"
              autoComplete="email"
              className="h-11 w-full rounded-[0.95rem] border border-[var(--color-line)] bg-transparent px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`${idBase}-type`}
              className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
            >
              {form.fields.inquiryType}
            </label>
            <select
              id={`${idBase}-type`}
              defaultValue={defaultType ?? modes[0]?.value}
              name="inquiryType"
              className="h-11 w-full rounded-[0.95rem] border border-[var(--color-line)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
            >
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`${idBase}-piece`}
              className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
            >
              {form.fields.piece}
            </label>
            <input
              id={`${idBase}-piece`}
              defaultValue={defaultPiece}
              name="piece"
              className="h-11 w-full rounded-[0.95rem] border border-[var(--color-line)] bg-transparent px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${idBase}-timing`}
            className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
          >
            {form.fields.timing}
          </label>
          <input
            id={`${idBase}-timing`}
            name="timing"
              className="h-11 w-full rounded-[0.95rem] border border-[var(--color-line)] bg-transparent px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${idBase}-message`}
            className="block text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
          >
            {form.fields.message}
          </label>
          <textarea
            id={`${idBase}-message`}
            required
            aria-required="true"
            name="message"
            rows={6}
            className="min-h-[10rem] w-full rounded-[1.15rem] border border-[var(--color-line)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent-cool)]"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 text-[0.67rem] uppercase tracking-[0.15em] text-black transition hover:border-[#d8ccae] hover:bg-[#d8ccae]"
          >
            {form.submitLabel}
          </button>

          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34">
            Responses handled discreetly
          </p>
        </div>
      </form>

      <p
        aria-live="polite"
        className={`mt-4 text-sm ${
          status === "success"
            ? "text-[var(--color-accent)]"
            : status === "error"
              ? "text-[#d7aaaa]"
              : "text-transparent"
        }`}
      >
        {status === "success"
          ? form.successLabel
          : status === "error"
            ? form.errorLabel
            : "."}
      </p>
    </section>
  );
}
