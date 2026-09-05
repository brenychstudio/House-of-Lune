function canonicalize(value: unknown, seen: Set<object>): string {
  if (value === null) return "null";
  if (typeof value === "bigint") return JSON.stringify(value.toString(10));
  if (typeof value === "string" || typeof value === "boolean" || typeof value === "number") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new TypeError("Request fingerprints do not support non-finite numbers");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "undefined") return "null";
  if (typeof value !== "object") {
    throw new TypeError(`Request fingerprints do not support ${typeof value}`);
  }
  if (seen.has(value)) throw new TypeError("Request fingerprints do not support circular input");
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return `[${value.map((item) => canonicalize(item, seen)).join(",")}]`;
    }
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonicalize(entry, seen)}`)
      .join(",")}}`;
  } finally {
    seen.delete(value);
  }
}

export async function fingerprintRequest(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(value, new Set()));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
