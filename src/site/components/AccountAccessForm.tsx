"use client";

import { FormEvent, useRef, useState } from "react";

const generic = "If this address is eligible, an access link will be sent.";

export function AccountAccessForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const status = useRef<HTMLParagraphElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/account/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), locale: "en" }),
      });
      setMessage(response.status === 403 ? "The request could not be accepted." : generic);
    } catch {
      setMessage("Collector Space access is temporarily unavailable.");
    } finally {
      setPending(false);
      requestAnimationFrame(() => status.current?.focus());
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      <div className="account-field">
        <label htmlFor="account-email">Email address</label>
        <input id="account-email" name="email" type="email" autoComplete="email" required />
      </div>
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? "Requesting…" : "Request access link"}
      </button>
      <p ref={status} className="account-status" role="status" aria-live="polite" tabIndex={-1}>
        {message}
      </p>
    </form>
  );
}
