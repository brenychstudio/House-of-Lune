"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { CustomerAddress } from "@/platform/db/repositories/addressRepository";

type AddressDraft = Omit<CustomerAddress, "id" | "customerId">;

const empty: AddressDraft = {
  kind: "SHIPPING", recipientName: "", line1: "", line2: null,
  city: "", region: null, postalCode: "", countryCode: "",
};

export function AddressBook({ addresses }: Readonly<{ addresses: readonly CustomerAddress[] }>) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(empty);
  const [message, setMessage] = useState("");
  const status = useRef<HTMLParagraphElement>(null);

  function edit(address: CustomerAddress) {
    setEditingId(address.id);
    setDraft({
      kind: address.kind, recipientName: address.recipientName, line1: address.line1,
      line2: address.line2 ?? null, city: address.city, region: address.region ?? null,
      postalCode: address.postalCode, countryCode: address.countryCode,
    });
  }

  function announce(value: string) {
    setMessage(value);
    requestAnimationFrame(() => status.current?.focus());
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
    const response = await fetch(endpoint, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, countryCode: draft.countryCode.toUpperCase() }),
    });
    if (!response.ok) return announce("Review the address fields and try again.");
    setEditingId(null);
    setDraft(empty);
    announce("Address saved.");
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (!response.ok) return announce("Address could not be removed.");
    if (editingId === id) { setEditingId(null); setDraft(empty); }
    announce("Address removed.");
    router.refresh();
  }

  return (
    <div className="address-book">
      {addresses.length === 0 ? <p className="empty-state">No saved addresses yet.</p> : (
        <ul className="address-list">
          {addresses.map((address) => (
            <li key={address.id}>
              <address>
                <strong>{address.recipientName}</strong><br />
                {address.line1}{address.line2 ? <><br />{address.line2}</> : null}<br />
                {address.city}, {address.postalCode}<br />
                {address.countryCode}
              </address>
              <div className="address-actions">
                <button className="text-button" type="button" onClick={() => edit(address)}>Edit</button>
                <button className="text-button" type="button" onClick={() => remove(address.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="address-form" onSubmit={save}>
        <h3>{editingId ? "Edit address" : "Add address"}</h3>
        <div className="account-field">
          <label htmlFor="address-kind">Address type</label>
          <select id="address-kind" value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value as AddressDraft["kind"] })}>
            <option value="SHIPPING">Shipping</option><option value="BILLING">Billing</option>
          </select>
        </div>
        <div className="account-field">
          <label htmlFor="recipient-name">Recipient name</label>
          <input id="recipient-name" autoComplete="name" required value={draft.recipientName} onChange={(event) => setDraft({ ...draft, recipientName: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="address-line-1">Address line 1</label>
          <input id="address-line-1" autoComplete="address-line1" required value={draft.line1} onChange={(event) => setDraft({ ...draft, line1: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="address-line-2">Address line 2 <span>(optional)</span></label>
          <input id="address-line-2" autoComplete="address-line2" value={draft.line2 ?? ""} onChange={(event) => setDraft({ ...draft, line2: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="address-city">City</label>
          <input id="address-city" autoComplete="address-level2" required value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="address-region">Region <span>(optional)</span></label>
          <input id="address-region" autoComplete="address-level1" value={draft.region ?? ""} onChange={(event) => setDraft({ ...draft, region: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="postal-code">Postal code</label>
          <input id="postal-code" autoComplete="postal-code" required value={draft.postalCode} onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })} />
        </div>
        <div className="account-field">
          <label htmlFor="country-code">Country code</label>
          <input id="country-code" autoComplete="country" inputMode="text" minLength={2} maxLength={2} required value={draft.countryCode} onChange={(event) => setDraft({ ...draft, countryCode: event.target.value })} />
        </div>
        <div className="address-actions">
          <button className="button button--primary" type="submit">{editingId ? "Save changes" : "Add address"}</button>
          {editingId ? <button className="button" type="button" onClick={() => { setEditingId(null); setDraft(empty); }}>Cancel</button> : null}
        </div>
        <p ref={status} className="account-status" role="status" aria-live="polite" tabIndex={-1}>{message}</p>
      </form>
    </div>
  );
}
