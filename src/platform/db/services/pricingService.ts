import type { Pool } from "pg";
import type { Currency, Market } from "@/modules/shared/valueObjects";
import { createPriceBook as validatePriceBook, validatePriceWindow } from "@/modules/pricing/domain";
import { appendAudit } from "@/platform/db/repositories/auditRepository";
import { createPriceBook, setVariantPrice, activatePriceBook, resolveVariantPrice } from "@/platform/db/repositories/pricingRepository";
import { withTransaction } from "@/platform/db/transaction";
import type { CommandActor } from "./catalogService";

type BookInput = { market: Market; currency: Currency; revision: string; effectiveFrom: Date; effectiveUntil?: Date };
function validateBook(input: BookInput) {
  const validation = validatePriceBook(input);
  if (!validation.ok) throw new Error(validation.error.message);
  validatePriceWindow(input.effectiveFrom, input.effectiveUntil ?? null);
}

export class PricingService {
  constructor(private readonly pool: Pool, private readonly actor: CommandActor) {
    if (!actor.actorId.trim() || !actor.correlationId.trim()) throw new Error("Command actor and correlation required");
  }
  async createBook(input: BookInput) {
    validateBook(input);
    return withTransaction(this.pool, async client => {
      const book = await createPriceBook(client, input);
      await appendAudit(client, { ...this.actor, actorType: "STAFF", action: "pricing.book.created",
        resourceType: "price_book", resourceId: book.id, result: "SUCCEEDED", afterState: { ...input } });
      return book;
    });
  }
  async updateBook(id: string, input: BookInput) {
    validateBook(input);
    return withTransaction(this.pool, async client => {
      const before = (await client.query("SELECT * FROM price_books WHERE id=$1 FOR UPDATE", [id])).rows[0];
      if (!before || before.state !== "DRAFT") throw new Error("Draft price book not found");
      await client.query(`UPDATE price_books SET market=$2,currency=$3,revision=$4,effective_from=$5,effective_until=$6 WHERE id=$1`,
        [id, input.market, input.currency, input.revision, input.effectiveFrom, input.effectiveUntil ?? null]);
      await appendAudit(client, { ...this.actor, actorType: "STAFF", action: "pricing.book.updated",
        resourceType: "price_book", resourceId: id, result: "SUCCEEDED", beforeState: before, afterState: { ...input } });
    });
  }
  async setPrice(input: { priceBookId: string; variantId: string; unitPriceMinor: bigint }) {
    if (input.unitPriceMinor < 0n || input.unitPriceMinor > 9223372036854775807n) throw new Error("Invalid minor-unit price");
    return withTransaction(this.pool, async client => {
      await client.query("SELECT id FROM price_books WHERE id=$1 FOR UPDATE", [input.priceBookId]);
      const before = (await client.query("SELECT unit_price_minor FROM price_book_entries WHERE price_book_id=$1 AND variant_id=$2",
        [input.priceBookId, input.variantId])).rows[0];
      await setVariantPrice(client, input);
      await appendAudit(client, { ...this.actor, actorType: "STAFF", action: "pricing.entry.updated",
        resourceType: "price_book", resourceId: input.priceBookId, result: "SUCCEEDED", beforeState: before,
        afterState: { variantId: input.variantId, minorUnits: input.unitPriceMinor.toString() } });
    });
  }
  publishBook(id: string) {
    return withTransaction(this.pool, async client => {
      await activatePriceBook(client, id);
      await appendAudit(client, { ...this.actor, actorType: "STAFF", action: "pricing.book.published",
        resourceType: "price_book", resourceId: id, result: "SUCCEEDED", afterState: { state: "PUBLISHED" } });
    });
  }
  resolvePrice(input: { variantId: string; market: Market; at: Date }) {
    return withTransaction(this.pool, client => resolveVariantPrice(client, input));
  }
}
