export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type DomainError = Readonly<{
  code: string;
  message: string;
}>;

export type Result<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: DomainError }>;

export type Currency = "EUR" | "GBP" | "USD";
export type Market = "EU" | "UK" | "US";
export type Money = Readonly<{ minorUnits: bigint; currency: Currency }>;
export type Sku = Brand<string, "Sku">;
export type Slug = Brand<string, "Slug">;
export type NormalizedEmail = Brand<string, "NormalizedEmail">;
export type UtcTimestamp = Brand<string, "UtcTimestamp">;
export type EntityId = Brand<string, "EntityId">;
export type CorrelationId = Brand<string, "CorrelationId">;
export type IdempotencyKey = Brand<string, "IdempotencyKey">;
export type ActorId = Brand<string, "ActorId">;

const currencies = new Set<Currency>(["EUR", "GBP", "USD"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalid(code: string, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export function createMoney(minorUnits: bigint | number, currency: string): Result<Money> {
  if (typeof minorUnits === "number" && !Number.isSafeInteger(minorUnits)) {
    return invalid("INVALID_MINOR_UNITS", "Money must use safe integer minor units");
  }

  const units = typeof minorUnits === "bigint" ? minorUnits : BigInt(minorUnits);
  if (units < 0n) {
    return invalid("NEGATIVE_MONEY", "Money cannot be negative");
  }
  if (!currencies.has(currency as Currency)) {
    return invalid("UNSUPPORTED_CURRENCY", `Unsupported currency: ${currency}`);
  }

  return { ok: true, value: Object.freeze({ minorUnits: units, currency: currency as Currency }) };
}

export function moneyToJSON(money: Money) {
  return { minorUnits: money.minorUnits.toString(10), currency: money.currency } as const;
}

export function addMoney(left: Money, right: Money): Result<Money> {
  if (left.currency !== right.currency) {
    return invalid("CURRENCY_MISMATCH", "Money currencies must match");
  }
  return createMoney(left.minorUnits + right.minorUnits, left.currency);
}

export function subtractMoney(left: Money, right: Money): Result<Money> {
  if (left.currency !== right.currency) {
    return invalid("CURRENCY_MISMATCH", "Money currencies must match");
  }
  return createMoney(left.minorUnits - right.minorUnits, left.currency);
}

export function parseSku(value: string): Result<Sku> {
  return /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(value)
    ? { ok: true, value: value as Sku }
    : invalid("INVALID_SKU", "SKU must contain uppercase alphanumeric segments separated by hyphens");
}

export function parseSlug(value: string): Result<Slug> {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? { ok: true, value: value as Slug }
    : invalid("INVALID_SLUG", "Slug must be lowercase kebab case");
}

export function normalizeEmail(value: string): Result<NormalizedEmail> {
  const normalized = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? { ok: true, value: normalized as NormalizedEmail }
    : invalid("INVALID_EMAIL", "Email address is invalid");
}

export function parseUtcTimestamp(value: string): Result<UtcTimestamp> {
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    return invalid("MISSING_UTC_OFFSET", "Timestamp must include Z or an explicit UTC offset");
  }
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) {
    return invalid("INVALID_TIMESTAMP", "Timestamp is invalid");
  }
  return { ok: true, value: instant.toISOString() as UtcTimestamp };
}

export function parseEntityId(value: string): Result<EntityId> {
  return uuidPattern.test(value)
    ? { ok: true, value: value.toLowerCase() as EntityId }
    : invalid("INVALID_ENTITY_ID", "Entity ID must be a UUID");
}

function parseOpaqueValue<Name extends "CorrelationId" | "IdempotencyKey" | "ActorId">(
  value: string,
  name: Name,
): Result<Brand<string, Name>> {
  const trimmed = value.trim();
  if (trimmed.length < 8 || trimmed.length > 200 || /\s/.test(trimmed)) {
    return invalid(`INVALID_${name.toUpperCase()}`, `${name} must be 8-200 non-space characters`);
  }
  return { ok: true, value: trimmed as Brand<string, Name> };
}

export const parseCorrelationId = (value: string) => parseOpaqueValue(value, "CorrelationId");
export const parseIdempotencyKey = (value: string) => parseOpaqueValue(value, "IdempotencyKey");
export const parseActorId = (value: string) => parseOpaqueValue(value, "ActorId");
